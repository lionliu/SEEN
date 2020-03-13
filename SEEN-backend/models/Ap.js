const mongoose = require('mongoose');

const DeviceSchema = mongoose.Schema({
    // Mac, fabricante, tipo de disp, ip?, firmware?
    mac: {
        type: String,
        required: true,
        match: /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/
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
        required: true,
        match: /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/
    },
    ip: {
        type: String,
        required: false
    },
    ssid: {
        type: String,
        required: false
    },
    securityProtocol: {
        type: String,
        required: false
    },
    devices: [DeviceSchema]
});

var Ap = mongoose.model('Ap', ApSchema);
Ap.Device = mongoose.model('Device', DeviceSchema);
module.exports = Ap;