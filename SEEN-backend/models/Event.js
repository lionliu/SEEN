const mongoose = require('mongoose');

// TODO: Verify if the modeling is ok
const EventSchema = mongoose.Schema({
    eventType: {
        type: String,
        required: true
    },
    targetAddrMac: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Events', EventSchema);