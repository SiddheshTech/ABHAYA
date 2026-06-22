const express = require('express');
const router = express.Router();
const ThreatEvent = require('../models/ThreatEvent');

// GET real-time Intelligence Feed
router.get('/feed', async (req, res) => {
  try {
    const threats = await ThreatEvent.find().sort({ createdAt: -1 }).limit(20);
    res.json(threats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST simulated threat detection from AI engine
router.post('/detect', async (req, res) => {
  try {
    const threat = new ThreatEvent(req.body);
    await threat.save();

    const io = req.app.get('io');
    io.emit('threat-detected', threat);

    res.status(201).json(threat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
