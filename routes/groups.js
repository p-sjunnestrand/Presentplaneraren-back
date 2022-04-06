const router = require('express').Router();
// const List = require('../schemas/list');
const Group = require('../schemas/group');
const User = require('../schemas/user');

router.post("/create", (req, res) => {
    if(req.user) {
        const invitees = req.body.invited
        console.log("user id: ", req.user.id);

        const createdGroup = new Group({
            name: req.body.name,
            users: [req.user.id],
            //Mongoose understands to put only the _id in the array instead of the entire object! Pretty neat!
            invitees: invitees,
        });

        console.log("createdGroup: ", createdGroup);

        createdGroup.save(async (err, group) => {
            if(err) {
                console.log(err);
                res.sendStatus(500);
            }
            console.log("group: ", group);
            for(let i = 0; i < invitees.length; i++) {
                console.log("invited id: ", invitees[i]._id);
                const updatedUser = await User.findByIdAndUpdate(invitees[i]._id, { $push: { invites: group._id }});
                if(updatedUser){
                    continue;
                } else {
                    throw new Error("Something went wrong inviting!");
                }
            }
        })
        res.status(200).json(createdGroup);
    } else {
        res.status(401).json("Unauthorized");
    }
})

router.get("/find/:user", async (req, res) => {
    if(req.user){
        const invitee = req.params.user;
        console.log("invitee: ", invitee);
        try {
            const foundUser = await User.findOne({email: invitee});
            if(foundUser){
                console.log("found user: ", foundUser);
    
                res.status(200).json(foundUser);
            }
            else {
                res.json({message: "No user found :("})
            }
        }
        catch(error){
            console.log(error);
            res.json(error);
        }
    } else {
        res.status(401).json("Unauthorized");
    }
    
});

module.exports = router;