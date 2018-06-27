const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TripSchema = new mongoose.Schema({
    employees: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    employers: [{
        type: String,
    }],
    vendor: {
        type: String,
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    availableEmployees: [{
        type: Schema.Types.ObjectId,
        ref: 'AvailableEmployee',
    }],
    slot: {
        type: String,
    },
    region: {
        type: String,
    },
    startTime: {
        type: Date,
        default: Date.now,
    },
    endTime: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        default: 0,
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'REQUESTED', 'REJECTED', 'COMPLETED'],
        default: 'PENDING',
    },
    tripStatus: {
        type: String,
        enum: ['IDLE', 'REQUESTED', 'ONGOING', 'COMPLETED'],
        default: 'IDLE',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model('Trip', TripSchema);
