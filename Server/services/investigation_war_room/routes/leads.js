const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// GET Live incoming leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).limit(50);
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new citizen lead
router.post('/report', async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();

    // Real-time alert to War Room
    const io = req.app.get('io');
    io.emit('new-lead', lead);

    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT verify lead
router.put('/:id/verify', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id, 
      { status: 'Verified' },
      { new: true }
    );
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
