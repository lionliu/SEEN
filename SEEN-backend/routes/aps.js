const express = require('express');
const router = express.Router();
const Ap = require('../models/Ap')

router.get('/', (req, res) => {
    Ap.find()
        .then(data => {
            res.json(data)
        })
        .catch(() => {
            res.status(400).json({ msg: 'Access Points not found' })
        })
});

router.get('/:mac', (req, res) => {
    Ap.findOne({ "mac": req.params.mac })
        .then(data => {
            res.json(data);
        })
        .catch(() => {
            res.status(400).json({ msg: 'Access Point not found' })
        });
});

router.get('/:mac/:dmac', (req, res) => {
    Ap.findOne({ 
        "mac": req.params.mac,
        "devices.mac" : req.params.dmac })
        .then(data => {
            res.json(data);
        })
        .catch(() => {
            res.status(400).json({ msg: 'Access Point not found' })
        });
});

router.post('/', (req, res) => {
    const ap = new Ap({
        mac: req.body.mac,
        ip: req.body.ip,
        ssid: req.body.ssid,
        securityProtocol: req.body.securityProtocol,
        devices: req.body.devices
    })

    ap.save()
        .then(data => {
            res.json(data)
        })
        .catch((err) => {
            res.status(400).json({ msg: 'Something went wrong. Probably you need to fill all the necessary fields' })
        })
});

router.post('/:mac', (req, res) => {
    const device = new Ap.Device ({
        mac: req.body.mac,
        manufacturer: req.body.manufacturer,
        dispositiveType: req.body.dispositiveType,
        ip: req.body.ip,
        firmware: req.body.firmware
    })
    Ap.updateOne({ mac: req.params.mac }, {
        $push: {
            devices: device
        }
    })
    .then(data => {
        res.json(data)
    })
    .catch(err => {
        res.status(400).json({ msg: 'Ap not found' })
    });
});


router.put('/:mac', (req, res) => {
    Ap.updateOne({ mac: req.params.mac }, { $set: { 
        ip: req.body.ip,
        ssid: req.body.ssid,
        securityProtocol: req.body.securityProtocol
    }})
    .then(data => {
        res.json({ msg: 'Ap updated' })
    })
    .catch(err => {
        res.status(400).json({ msg: 'Ap not found' })
    });
});

router.put('/:mac/:dmac', (req, res) => {
    Ap.updateOne({ "mac": req.params.mac,  "devices.mac": req.params.dmac }, {
        $set: {
            "devices.$.ip": req.body.ip,
            "devices.$.manufacturer": req.body.manufacturer,
            "devices.$.dispositiveType": req.body.dispositiveType,
            "devices.$.firmware": req.body.firmware
        }
    })
    .then(data => {
        res.json({ msg: 'Device updated' })
    })
    .catch(err => {
        res.status(400).json({ msg: 'Device not found' })
    });
});

router.delete('/:mac', (req, res) => {
    Ap.deleteOne({ mac: req.params.mac }, (err, result) => {
        res.json({ msg: "Access point deleted" })
    })
})

// Delete devices not working properly

// router.delete('/:mac/:dmac', (req, res) => {
//     Ap.updateOne({ "mac": req.params.mac,  }, {
//         $pull: {
//             mac: req.params.dmac
//         }
//     })
//     .then(data => {
//         res.json({ msg: "Device deleted" })
//     })
// })



module.exports = router;