const mongoose = require('mongoose');
const LocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        enum: ['SOUTH', 'NORTH', 'EAST', 'WEST'],
        default: 'SOUTH',
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
module.exports = mongoose.model('Location', LocationSchema);
