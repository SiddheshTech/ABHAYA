const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const BlockchainService = require('../services/BlockchainService');

// GET all cases (Live Cases Overview)
router.get('/', async (req, res) => {
  try {
    const { status, risk, state } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (risk) filter.riskScore = { $gte: Number(risk) };
    if (state) filter.state = state;

    const cases = await Case.find(filter).sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single case (Case Command Center / Briefing)
router.get('/:id', async (req, res) => {
  try {
    const caseData = await Case.findOne({ caseId: req.params.id });
    if (!caseData) return res.status(404).json({ error: 'Case not found' });
    res.json(caseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to update case status and write to Blockchain
router.post('/:id/update', async (req, res) => {
  try {
    const { event, details } = req.body;
    const caseData = await Case.findOne({ caseId: req.params.id });
    if (!caseData) return res.status(404).json({ error: 'Case not found' });

    // Update MongoDB
    caseData.timeline.push({ event });
    if (details.status) caseData.status = details.status;
    await caseData.save();

    // Write to immutable ledger
    const block = await BlockchainService.addBlock({
      type: 'CASE_UPDATE',
      caseId: caseData.caseId,
      event: event,
      details: details
    });

    // Emit live socket event
    const io = req.app.get('io');
    io.emit('war-room-update', { type: 'CASE_UPDATE', caseId: caseData.caseId, event });

    res.json({ success: true, caseData, blockHash: block.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
