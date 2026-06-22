const express = require('express');
const router = express.Router();
const Evidence = require('../models/Evidence');
const BlockchainService = require('../services/BlockchainService');

// POST upload new evidence and generate Chain of Custody hash
router.post('/upload', async (req, res) => {
  try {
    const { caseId, type, url, metadata, uploaderId, aiAnalysis } = req.body;

    // 1. Create block in ledger before saving to MongoDB
    const blockData = {
      type: 'EVIDENCE_UPLOAD',
      caseId,
      evidenceType: type,
      url,
      uploaderId
    };
    const block = await BlockchainService.addBlock(blockData);

    // 2. Save Evidence to MongoDB linked to the block hash
    const evidence = new Evidence({
      caseId,
      type,
      url,
      metadata,
      uploaderId,
      aiAnalysis,
      chainOfCustodyHash: block.hash
    });
    await evidence.save();

    // Emit live event
    const io = req.app.get('io');
    io.emit('evidence-uploaded', { caseId, type });

    res.status(201).json({ success: true, evidence });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Evidence Vault for a specific case
router.get('/:caseId', async (req, res) => {
  try {
    const evidenceList = await Evidence.find({ caseId: req.params.caseId });
    res.json(evidenceList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
