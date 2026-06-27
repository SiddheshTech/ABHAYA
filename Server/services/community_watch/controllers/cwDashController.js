const Broadcast = require('../models/Broadcast');
const Patrol = require('../models/Patrol');
const Incident = require('../models/Incident');

exports.getBroadcasts = async (req, res) => {
    try {
        const broadcasts = await Broadcast.find().sort({ _id: -1 });
        res.json(broadcasts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addBroadcast = async (req, res) => {
    try {
        const { sender, msg, level } = req.body;
        const newBroadcast = await Broadcast.create({ sender, msg, level, time: 'Just Now' });
        res.status(201).json(newBroadcast);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPatrols = async (req, res) => {
    try {
        const patrols = await Patrol.find();
        res.json(patrols);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().sort({ _id: -1 });
        res.json(incidents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
