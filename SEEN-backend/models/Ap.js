const mongoose = require('mongoose');

const DeviceSchema = mongoose.Schema({
    // Mac, fabricante, tipo de disp, ip?, firmware?
    mac: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        require: false
    },
    kindDispositive: {
        type: String,
        required: false
    },
    ip: {
        type: String,
        required: false
    },
    firmware: {
        type: String,
        required: false
    }
})

const ApSchema = mongoose.Schema({
    // mac, ip?, ssid, protocolo de seguranca

    mac: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: false
    },
    ssid: {
        type: String,
        required: false
    },
    SecurityProtocol: {
        type: String,
        required: false
    },
    devices: [DeviceSchema]
});

module.exports = mongoose.model('Ap', ApSchema);