const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import Schemas
const Reconstruction = require('../models/Reconstruction');
const GenomeMutation = require('../models/GenomeMutation');
const CriminalProfile = require('../models/CriminalProfile');
const RiskForecast = require('../models/RiskForecast');
const Case = require('../models/Case');
const Evidence = require('../models/Evidence');
const BlockchainService = require('../services/BlockchainService');

// 1. Identity Engine (Ghost Reconstruction)
router.post('/reconstruct', async (req, res) => {
  try {
    const data = req.body;
    
    // Hash the vital biometric prediction to the blockchain for legal immutability
    const block = await BlockchainService.addBlock({
      type: 'IDENTITY_RECONSTRUCTION',
      predictedOriginState: data.aiResults.predictedOriginState,
      confidence: data.aiResults.confidence
    });
    
    data.blockchainHash = block.hash;
    const reconstruction = new Reconstruction(data);
    await reconstruction.save();
    
    res.status(201).json(reconstruction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/reconstructions/:id', async (req, res) => {
  try {
    const item = await Reconstruction.findById(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Network Genome (DNA Sequencing)
router.get('/genome/:networkId', async (req, res) => {
  try {
    const genome = await GenomeMutation.findOne({ networkId: req.params.networkId });
    res.json(genome);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/genome/mutate', async (req, res) => {
  try {
    const mutation = new GenomeMutation(req.body);
    await mutation.save();
    
    // Log massive network shifts to blockchain
    await BlockchainService.addBlock({
      type: 'NETWORK_MUTATION',
      networkId: req.body.networkId,
      shiftRoute: req.body.forecast.expectedShiftRoute
    });

    const io = req.app.get('io');
    io.emit('network-mutation', mutation);

    res.status(201).json(mutation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Criminal Mind (Behavioral Profiles)
router.get('/profile/:suspectId', async (req, res) => {
  try {
    const profile = await CriminalProfile.findOne({ suspectId: req.params.suspectId });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Prediction Engine (Risk Forecasts)
router.post('/predict', async (req, res) => {
  try {
    const forecast = new RiskForecast(req.body);
    await forecast.save();
    res.status(201).json(forecast);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/predictions/timeline', async (req, res) => {
  try {
    const forecasts = await RiskForecast.find().sort({ createdAt: -1 }).limit(10);
    res.json(forecasts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Intelligence Archive (Universal Search)
router.get('/archive/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const textSearchQuery = { $text: { $search: q } };
    
    // Search across multiple collections using the defined text indexes
    const [profiles, forecasts, genomes, reconstructions] = await Promise.all([
      CriminalProfile.find(textSearchQuery).limit(5),
      RiskForecast.find(textSearchQuery).limit(5),
      GenomeMutation.find(textSearchQuery).limit(5),
      Reconstruction.find(textSearchQuery).limit(5)
    ]);

    res.json({
      profiles,
      forecasts,
      genomes,
      reconstructions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
