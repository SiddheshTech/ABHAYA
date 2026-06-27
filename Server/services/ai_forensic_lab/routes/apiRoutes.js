const express = require('express');
const router = express.Router();
const CriminalProfile = require('../models/CriminalProfile');
const { GoogleGenAI } = require('@google/genai');

let aiClient = null;

function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || 'dummy',
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
  }
  return aiClient;
}

// Criminal Search
router.get('/criminal/search', async (req, res) => {
    try {
        const q = (req.query.q || "").toLowerCase().trim();
        const profiles = await CriminalProfile.find({});
        
        if (!q) {
            return res.json(profiles);
        }
        
        const results = profiles.filter(p => {
            return (
                (p.id && p.id.toLowerCase().includes(q)) ||
                (p.name && p.name.toLowerCase().includes(q)) ||
                (p.alias && p.alias.toLowerCase().includes(q))
            );
        });
        
        res.json(results);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.get('/criminal/profile/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const profile = await CriminalProfile.findOne({ id: new RegExp(`^${id}$`, 'i') });
        if (profile) res.json(profile);
        else res.status(404).json({ error: `Subject ${id} not found.` });
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/criminal/profiler', async (req, res) => {
    try {
        const { profileId, customSeed } = req.body;
        let profile = await CriminalProfile.findOne({ id: profileId });
        
        const ai = getGeminiClient();
        const prompt = `Perform complete deep psychological and behavioral profiling for Subject ID "${profileId || "CR-8824"}" (Context seed: "${customSeed || "standard investigation"}"). Output valid JSON based on the CriminalProfile schema.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", temperature: 0.3 }
        });
        
        const result = JSON.parse(response.text.trim());
        result.id = profileId;
        
        await CriminalProfile.findOneAndUpdate({ id: profileId }, result, { upsert: true });
        
        req.io.emit('update', { type: 'criminal_profiles', data: await CriminalProfile.find({}) });
        res.json(result);
    } catch(err) {
        console.error("Profiler error:", err);
        res.status(500).json({ error: "Failed to generate profile" });
    }
});

// Mock prediction generator for now to satisfy the frontend endpoint
router.post('/predictions/generate', async (req, res) => {
    res.json({ prediction: { id: "SIM-01", timeframe: req.body.timeframe, predictedCases: { value: 120 } } });
});

router.post('/gemini/chat', async (req, res) => {
    res.json({ reply: "This is a placeholder reply from the AI Forensic Lab backend." });
});

module.exports = router;
