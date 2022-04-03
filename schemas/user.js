const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    nameFirst: String,
    nameLast: String,
    googleId: Number,
    email: String,
    password: String,
    groups: Array,
    lists: Array
});


module.exports = mongoose.model('User', userSchema);