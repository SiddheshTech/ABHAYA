const express = require('express');
const router = express.Router();

const feedController = require('../controllers/feedController');
const alertController = require('../controllers/alertController');
const sightingController = require('../controllers/sightingController');
const reportController = require('../controllers/reportController');
const profileController = require('../controllers/profileController');

router.get('/global-stats', feedController.getGlobalStats);
router.get('/feed', feedController.getFeed);

router.get('/alerts', alertController.getAlerts);
router.get('/alerts/:id', alertController.getAlertById);

router.post('/sightings', sightingController.submitSighting);
router.post('/reports', reportController.reportMissingChild);

router.get('/profile/:id', profileController.getProfile);
router.get('/impact/:id', profileController.getImpactDashboard);

module.exports = router;
