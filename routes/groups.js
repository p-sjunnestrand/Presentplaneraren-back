const router = require('express').Router();
const { ObjectId } = require('mongodb');
// const List = require('../schemas/list');
const Group = require('../schemas/group');
const User = require('../schemas/user');

router.post("/create", (req, res) => {
    if(req.user) {
        const invitees = req.body.invited

        const createdGroup = new Group({
            name: req.body.name,
            users: [req.user.id],
            //Mongoose understands to put only the _id in the array instead of the entire object! Pretty neat!
            invitees: invitees,
            owner: req.user.id,
        });

        createdGroup.save(async (err, group) => {
            if(err) {
                console.log(err);
                res.sendStatus(500);
            }
            for(let i = 0; i < invitees.length; i++) {
                const updatedUser = await User.findByIdAndUpdate(invitees[i]._id, { $push: { invites: {_id: group._id, name: group.name, owner: req.user.email} }});
                if(updatedUser){
                    // This needs to come before updatedUser above!

                    const updatedOwner = await User.findByIdAndUpdate(req.user.id, { $push: { groups: group._id }});
                    console.log(updatedOwner);
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
        try {
            const foundUser = await User.findOne({email: invitee});
            if(foundUser){
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

router.post("/invites", async(req, res) => {
    console.log(req.body);
    const userId = req.user.id
    const groupId = new ObjectId(req.body.id)

    Promise.all([
        User.findByIdAndUpdate(userId, { $pull: { invites: {_id: req.body.id} }}),
        Group.findByIdAndUpdate(req.body.id, { $pull: { invitees: req.user._id }}),
        User.findByIdAndUpdate(userId, { $push: { groups: groupId }}, {new: true}),
        Group.findByIdAndUpdate(req.body.id, { $push: { users: req.user._id }}, {new: true})
    ]).then(resp => {
        console.log(resp[2], resp[3]);
        res.status(200).json({user: resp[2], group: resp[3]});
        }
    ).catch(err => {
        console.log(err);
    })
});

router.post("/newInvite", async (req, res) => {
    console.log(req.body);
    const invitees = req.body.invites;
    const group = req.body.group;

    const updatedGroup = await Group.findOneAndUpdate({_id: group}, {$push: {invitees: invitees}});

    if(updatedGroup) {
        for(let i = 0; i < invitees.length; i++) {
            console.log("invited id: ", invitees[i]._id);
            // Push should be exchanged for addToSet to prevent adding value already present!
            const updatedUser = await User.findByIdAndUpdate(invitees[i]._id, { $push: { invites: {_id: group._id, name: group.name, owner: req.user.email} }});
            if(updatedUser){
                // This needs to come before updatedUser above!
    
                const updatedOwner = await User.findByIdAndUpdate(req.user.id, { $push: { groups: group }});
                console.log(updatedOwner);
                continue;
            } else {
                throw new Error("Something went wrong inviting!");
            }
        }
    }
})

module.exports = router;