const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import Schemas
const Mission = require('../models/Mission');
const LiveTracker = require('../models/LiveTracker');
const SearchSector = require('../models/SearchSector');
const RescueTeam = require('../models/RescueTeam');
const EmergencyIncident = require('../models/EmergencyIncident');
const BlockchainService = require('../services/BlockchainService');

// 1. Mission Control & Operations Globe
router.get('/missions', async (req, res) => {
  try {
    const missions = await Mission.find({ status: 'Active' });
    res.json(missions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/live-tracking', async (req, res) => {
  try {
    const trackers = await LiveTracker.find();
    res.json(trackers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update location endpoint (Drones/Teams would hit this constantly)
router.post('/live-tracking/update', async (req, res) => {
  try {
    const { entityId, entityType, missionId, lat, lng, statusData } = req.body;
    
    let tracker = await LiveTracker.findOne({ entityId });
    if (!tracker) {
      tracker = new LiveTracker({ entityId, entityType, missionId });
    }
    
    tracker.location = { type: 'Point', coordinates: [lng, lat] };
    tracker.statusData = statusData;
    await tracker.save();

    // Broadcast 1Hz live update to War Room globe
    const io = req.app.get('io');
    io.emit('globe-update', tracker);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Cognitive Heatmaps
router.post('/heatmaps/generate', async (req, res) => {
  try {
    const { profile, centerLat, centerLng } = req.body;
    // Mocking the Python GIS A* algorithm using basic GeoJSON output
    const geoJsonMock = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [centerLng + 0.02, centerLat + 0.02] },
          properties: { weight: 0.85, type: "Safe Zone", reason: "Quiet Area (Autism Profile)" }
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [centerLng - 0.01, centerLat + 0.03] },
          properties: { weight: 0.95, type: "Danger Zone", reason: "Water Body" }
        }
      ]
    };
    res.json(geoJsonMock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Search Grid
router.get('/missions/:missionId/grid', async (req, res) => {
  try {
    const sectors = await SearchSector.find({ missionId: req.params.missionId });
    res.json(sectors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Team Command
router.get('/teams', async (req, res) => {
  try {
    const teams = await RescueTeam.find();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/teams/deploy', async (req, res) => {
  try {
    const { teamId, sectorId } = req.body;
    const team = await RescueTeam.findOneAndUpdate(
      { teamId },
      { status: 'On Mission' },
      { new: true }
    );
    await SearchSector.findOneAndUpdate(
      { sectorId },
      { status: 'In Progress', assignedTeamId: teamId }
    );

    const io = req.app.get('io');
    io.emit('team-deployed-rescue', { team, sectorId });

    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Emergency Mode
router.post('/emergency/trigger', async (req, res) => {
  try {
    const incident = new EmergencyIncident(req.body);

    // Blockchain integration: Log the crisis officially
    const block = await BlockchainService.addBlock({
      type: 'EMERGENCY_DECLARED',
      incidentType: incident.type,
      impact: incident.estimatedImpact
    });

    incident.blockchainHash = block.hash;
    await incident.save();

    // Trigger instant global Red Alert
    const io = req.app.get('io');
    io.emit('CRITICAL_EMERGENCY', incident);

    res.status(201).json(incident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
