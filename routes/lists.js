const router = require('express').Router();
const List = require('../schemas/list');
const Group = require('../schemas/group');
const mongo = require('mongodb');

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
})

router.post("/create", (req, res) => {
    if(req.user) {
        const newList = new List({
            title: req.body.title,
            owner: req.user._id,
        });
        newList.save((err, doc) => {
            if(err) {
                console.log(err);
            }
            const docid = doc._id;
            console.log("doc id ", docid)
            User.findOneAndUpdate({_id: req.user._id}, { $pull: { lists: { $in: [ doc._id ] } }})
            res.status(200).json(doc);

        });
    } else {
        res.json({message: "Unauthorized"});
    }
});

// router.

router.post("/items/create", (req, res) => {
    if(req.user) {
        console.log(req.body);
        const currentList = req.body.list;
        const newItem = req.body.item;
        List.findOneAndUpdate({_id: currentList}, {$push: {items: newItem}}, {new: true}, (err, doc) => {
            if(err) console.log(err);
            res.status(200).json(doc)
        })
    }
})

module.exports = router;