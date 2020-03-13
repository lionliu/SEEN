const mongoose = require('mongoose');

// TODO: Verify if the modeling is ok
const EventSchema = mongoose.Schema({
    eventType: {
        type: String,
        required: true,
        match: /Blocked|PBlocked|Vulnerable|Suspect|Cloned|Normal/
    },
    targetAddrMac: {
        type: String,
        required: true,
        match: /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/
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