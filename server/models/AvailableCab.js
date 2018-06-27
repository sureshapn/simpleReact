const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AvailableCab = new mongoose.Schema({
    cab: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    isAllotted: {
        type: Boolean,
        default: false,
    },
});
module.exports = mongoose.model('AvailableCab', AvailableCab);
