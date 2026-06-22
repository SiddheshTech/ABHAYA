const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const childController = require('../controllers/childController');
const shelterController = require('../controllers/shelterController');
const familyMatchController = require('../controllers/familyMatchController');
const blockchainService = require('../services/blockchain');

// Dashboard Routes
router.get('/dashboard', dashboardController.getDashboardData);

// Child Routes
router.get('/children', childController.getAllChildren);
router.get('/children/:id', childController.getChildById);
router.post('/children', childController.createChild);
router.put('/children/:id', childController.updateChildStatus);

// Shelter Routes
router.get('/shelters', shelterController.getAllShelters);
router.get('/shelters/:id', shelterController.getShelterById);
router.post('/shelters', shelterController.createShelter);
router.put('/shelters/:id', shelterController.updateShelter);

// Family Match Routes
router.get('/family-matches/:childId', familyMatchController.getFamilyMatchesByChild);
router.post('/family-matches', familyMatchController.createOrUpdateFamilyMatch);
router.put('/family-matches/:childId/candidates/:candidateId', familyMatchController.updateCandidateStatus);

// Blockchain Audit Routes
router.get('/audit/verify', async (req, res) => {
    try {
        const isValid = await blockchainService.verifyChain();
        res.json({ valid: isValid, message: isValid ? "Blockchain is valid and data is tamper-proof." : "Data corruption detected in blockchain!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
