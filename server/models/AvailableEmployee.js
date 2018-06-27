const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AvailableEmployee = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    slot: {
        type: String,
    },
    location: {
        type: String,
    },
    region: {
        type: String,
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
module.exports = mongoose.model('AvailableEmployee', AvailableEmployee);
