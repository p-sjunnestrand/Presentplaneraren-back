const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    name: String,
    users: Array,
});

module.exports = mongoose.model('Group', groupSchema);