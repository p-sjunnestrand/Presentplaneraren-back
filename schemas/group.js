const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    name: String,
    // The users and invitees are saved as strings since they are saved as such in the browser before being sent to server. Compare to lists where ObjectIds are used.
    users: [{type: ObjectId}],
    invitees: [{type: ObjectId}],
    owner: ObjectId, 
    lists: [{type: ObjectId}],
});

module.exports = mongoose.model('Group', groupSchema);