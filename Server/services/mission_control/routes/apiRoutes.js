const express = require('express');
const router = express.Router();
const Mission = require('../models/Mission');
const Team = require('../models/Team');
const Drone = require('../models/Drone');

router.get('/missions', async (req, res) => {
    try {
        const missions = await Mission.find({});
        res.json(missions);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.get('/teams', async (req, res) => {
    try {
        const teams = await Team.find({});
        res.json(teams);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.get('/drones', async (req, res) => {
    try {
        const drones = await Drone.find({});
        res.json(drones);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/emergency', (req, res) => {
    req.io.emit('emergency_alert', { active: true, timestamp: new Date() });
    res.json({ success: true, message: 'Emergency Mode Activated Globally' });
});

module.exports = router;
