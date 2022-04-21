const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
    title: String,
    owner: ObjectId,
    items: Array,
    group: ObjectId,
    taken: String,
})

module.exports = mongoose.model('List', listSchema);