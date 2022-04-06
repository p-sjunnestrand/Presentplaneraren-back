const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    nameFirst: String,
    nameLast: String,
    googleId: Number,
    email: String,
    password: String,
    groups: Array,
    lists: [{type: ObjectId}],
    invites: [{type: ObjectId}],
});


module.exports = mongoose.model('User', userSchema);