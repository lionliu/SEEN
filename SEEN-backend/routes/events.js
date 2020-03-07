const express = require('express');
const router = express.Router();
const Event = require('../models/Event')


router.get('/', (req, res) => {
    Event.find()
    .then(data => {
        res.json(data)
    })
    .catch(() => {
        res.status(400).json({ msg: 'Events not found' })
    })
});

router.get('/:id', (req, res) => {
    Event.findById(req.params.id)
        .then(data => {
            res.json(data);
        })
        .catch(() => {
            res.status(400).json({ msg: 'Event not found' })
        });
})

router.post('/', (req, res) => {
    // Cria um novo objeto a partir do Schema
    const event = new Event({
        eventType: req.body.eventType,
        targetAddrMac: req.body.targetAddrMac,
        duration: req.body.duration
    })

    if(!req.body.eventType || !req.body.targetAddrMac) {
        event.save()
        .then(data => {
            res.json(data);
        })
        .catch(() => {
            res.status(400).json({ msg: 'Something went wrong' })
        })
    }

    res.status(400).json({ msg: 'Please fill all the necessary fields' });
})

module.exports = router;