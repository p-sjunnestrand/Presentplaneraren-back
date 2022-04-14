const router = require('express').Router();
const List = require('../schemas/list');
const Group = require('../schemas/group');
const User = require('../schemas/user');
const { ObjectId } = require('mongodb');

// const ObjectID = mongo.ObjectId;
router.get("/", async (req, res) => {
    console.log("get!")
    if(req.user) {
        const allLists = await List.find({owner: req.user._id});
        const allGroups = await Group.find({users: req.user._id});
        console.log(allGroups);
        res.json({
            lists: allLists,
            groups: allGroups
        });
    } else {
        res.json({message: "Unauthorized"});
    }
});

router.get("/:groupId", (req, res) => {
    if(req.user){
        const currentGroup = req.params.groupId;
        console.log(currentGroup);
        List.find({group: currentGroup}, (err, docs) => {
            if(err) console.log(err);
            console.log(docs)
            res.json(docs);
        });
    } else {
        res.status(401).json({message: "Unauthorized"});
    }
})

router.post("/create", (req, res) => {
    if(req.user) {
        console.log(req.body)
        const newList = new List({
            title: req.body.title,
            owner: req.user._id,
            group: req.body.inGroup ? new ObjectId(req.body.inGroup) : null
        });
        console.log(newList)
        newList.save( async (err, doc) => {
            if(err) {
                console.log(err);
            }
            const userId = req.user._id.toString();
            const updatedUser = await User.findByIdAndUpdate(userId, { $push: { lists: doc._id }});
            console.log(updatedUser)
            if(updatedUser){
                res.status(200).json(doc);
            } else{
                res.status(500).json(doc);
            }

        });
        // res.json({message: "ok"})
    } else {
        res.json({message: "Unauthorized"});
    }
});

router.post("/delete", async (req, res) => {
    if(req.user) {
        try {
            console.log(req.body.id);
            const deleted = await List.deleteOne({_id: req.body.id});
            if(deleted) {
                const userId = req.user._id.toString();
                const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { lists: req.body.id }});
                if(updatedUser) {
                    res.status(200).json(updatedUser);
                }
            }

        }
        catch (error) {
            console.log(error);
            res.json(error);
        }
    }
})

router.post("/items/create", (req, res) => {
    if(req.user) {
        console.log(req.body);
        const currentList = req.body.list;
        let newItem = req.body.item;
        newItem._id = new ObjectId();
        List.findOneAndUpdate({_id: currentList}, {$push: {items: newItem}}, {new: true}, (err, doc) => {
            if(err) console.log(err);
            res.status(200).json(doc)
        })
    }
});

router.post("/items/delete", (req, res) => {
    if(req.user) {
        console.log(req.body);
        const itemId = new ObjectId(req.body.item);
        List.findOneAndUpdate({_id: req.body.list}, {$pull: {items: {_id: itemId}}}, {new: true}, (err, doc) => {
            if(err) console.log(err);
            console.log(doc);
            res.status(200).json(doc);
        })
    }
})

module.exports = router;