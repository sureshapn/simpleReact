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
    tripStatus: {
        type: String,
        enum: ['STARTED', 'ONBOARD_REQ', 'ONBOARD_ACCEP', 'OFFBOARD_REQ', 'OFFBOARD_ACCEP', 'COMPLETED', 'PAYMENT_REQUESTED', 'PAYMENT_ACCEPTED'],
        default: 'STARTED',
    },
    paymentStatus: {
        type: String,
        enum: ['PAID', 'NOT PAID'],
        default: 'NOT PAID',
    },
    amount: {
        type: Number,
        default: 0,
    },
});
module.exports = mongoose.model('AvailableEmployee', AvailableEmployee);
