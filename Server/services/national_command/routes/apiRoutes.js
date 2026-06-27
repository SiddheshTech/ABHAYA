const express = require('express');
const router = express.Router();

const commandController = require('../controllers/commandController');
const networkController = require('../controllers/networkController');
const aiController = require('../controllers/aiController');
const orgController = require('../controllers/orgController');
const blockchainService = require('../services/blockchain');

// Command & Nation
router.get('/command/dashboard', commandController.getDashboard);
router.get('/nation/states', commandController.getStates);
router.get('/command/recoveries', commandController.getRecoveries);
router.get('/command/majorCases', commandController.getMajorCases);

// Networks
router.get('/genome/networks', networkController.getNetworks);

// AI & Forecasts
router.get('/forecasts/predictions', aiController.getPredictions);
router.get('/ai/health', aiController.getAIHealth);

// Organizations & Ledger
router.get('/organizations', orgController.getOrganizations);
router.get('/ledger/timeline', orgController.getAuditLedger);

// Blockchain Audit Utility
router.get('/ledger/verify', async (req, res) => {
    try {
        const isValid = await blockchainService.verifyChain();
        res.json({ valid: isValid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
