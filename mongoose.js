const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    nameFirst: String,
    nameLast: String,
    googleId: Number,
    email: String,
});

module.exports = mongoose.model('User', userSchema);