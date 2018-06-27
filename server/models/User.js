const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    passwd: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
    },
    type: {
        type: String,
        enum: ['DRIVER', 'ADMIN', 'EMPLOYEE', 'EMPLOYER', 'VENDOR'],
        default: 'EMPLOYEE',
        required: true,
    },
    employeeCode: {
        type: String,
    },
    cabNo: {
        type: String,
    },
    seats: {
        type: Number,
        default: 4,
    },
    pickupLocation: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
    },
    imageUrl: {
        type: String,
    },
    tripStatus: {
        type: String,
        enum: ['IDLE', 'REQUESTED', 'ALLOTTED', 'ONGOING'],
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
module.exports = mongoose.model('User', UserSchema);
