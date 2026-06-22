const express = require('express');
const router = express.Router();
const Operation = require('../models/Operation');

// GET active operations and teams
router.get('/', async (req, res) => {
  try {
    const ops = await Operation.find();
    res.json(ops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Deploy team
router.post('/deploy', async (req, res) => {
  try {
    const { teamName, searchZone, etaMinutes } = req.body;
    let team = await Operation.findOne({ teamName });
    
    if (!team) {
      team = new Operation({ teamName });
    }

    team.status = 'On Mission';
    team.currentMission = {
      searchZone,
      etaMinutes,
      expectedCoverage: 85, // Mock AI estimation
      successProbability: 70
    };

    await team.save();

    const io = req.app.get('io');
    io.emit('team-deployed', team);

    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
