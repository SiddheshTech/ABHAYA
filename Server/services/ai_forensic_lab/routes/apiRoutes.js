const express = require('express');
const router = express.Router();
const CriminalProfile = require('../models/CriminalProfile');
const Prediction = require('../models/Prediction');
const AuditLog = require('../models/AuditLog');
const Genome = require('../models/Genome');
const AIReconstruction = require('../models/AIReconstruction');
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

// Global Search (across profiles, cases, predictions)
router.get('/search', async (req, res) => {
    try {
        const q = (req.query.q || "").toLowerCase().trim();
        if (!q) return res.json([]);
        
        const profiles = await CriminalProfile.find({});
        const predictions = await Prediction.find({});
        
        const results = [];
        
        profiles.forEach(p => {
            if ((p.id && p.id.toLowerCase().includes(q)) || (p.name && p.name.toLowerCase().includes(q))) {
                results.push({ id: p.id, title: p.name || p.id, subtitle: p.alias || "Profile Match", type: "officer", details: p });
            }
        });
        
        predictions.forEach(p => {
            if ((p.id && p.id.toLowerCase().includes(q)) || (p.timeframe && p.timeframe.toLowerCase().includes(q))) {
                results.push({ id: p.id, title: `Prediction ${p.id}`, subtitle: `Timeframe: ${p.timeframe}`, type: "simulation", details: p });
            }
        });
        
        res.json(results);
    } catch(err) { res.status(500).json({error: err.message}); }
});

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
        
        let text = response.text.trim();
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            text = text.substring(start, end + 1);
        }
        const result = JSON.parse(text);
        result.id = profileId;
        result.source = "Gemini AI";
        
        await CriminalProfile.findOneAndUpdate({ id: profileId }, result, { upsert: true });
        
        req.io.emit('update', { type: 'criminal_profiles', data: await CriminalProfile.find({}) });
        res.json(result);
    } catch(err) {
        console.error("Profiler error:", err);
        res.status(500).json({ error: "Failed to generate profile" });
    }
});

// SECCOPILOT FORECAST ENGINE
router.get('/predictions/history', async (req, res) => {
    try {
        const history = await Prediction.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/predictions/audit', async (req, res) => {
    try {
        const audits = await AuditLog.find().sort({ createdAt: -1 });
        res.json(audits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/predictions/generate', async (req, res) => {
    try {
        const { timeframe, customPrompt, userEmail } = req.body;
        const ai = getGeminiClient();
        
        const prompt = `You are the SECCOPILOT FORECAST ENGINE. Simulate spatial crime models, trafficking risks, and climate vulnerability vectors for India. 
Context: Timeframe is "${timeframe}". Custom Directive: "${customPrompt || "Standard National Threat Baseline"}".
Generate a highly realistic JSON matching the EXACT schema below. Make up realistic regions (like Siliguri Corridor, Assam Sector 4), nodes, and percentages. Do NOT include markdown blocks, just the JSON.

{
  "id": "String (e.g. SIM-01)",
  "timeframe": "String",
  "timestamp": "String (ISO Date)",
  "migrationRisk": { "level": "String", "trend": "String", "confidence": Number(0-100), "reasoning": "String", "factors": ["String"], "regions": ["String"], "timeline": "String", "actions": "String" },
  "floodRisk": { "probability": Number(0-100), "rainfall": "String", "riverLevels": "String", "satelliteData": "String", "districts": ["String"], "forecast": "String", "impactAssessment": "String" },
  "economicDistress": { "vulnerabilityScore": Number(0-100), "employment": "String", "migration": "String", "inflation": "String", "foodSupply": "String", "povertyIndex": "String", "trendCharts": [Number] },
  "socialUnrest": { "riskScore": Number(0-100), "socialMedia": "String", "crimeReports": "String", "protestMonitoring": "String", "sentimentAnalysis": "String", "communityAlerts": "String" },
  "predictedCases": { "value": Number, "changePercent": "String", "confidence": Number(0-100), "historicalComparison": "String", "weeklyForecast": [Number], "monthlyForecast": [Number] },
  "expectedLocations": [{ "name": "String", "probability": Number(0-100), "confidence": Number(0-100), "expectedTime": "String", "distance": "String", "lastActivity": "String", "details": "String" }],
  "threatProbability": { "gaugeValue": Number(0-100), "trend": "String", "forecast": "String", "riskContributors": ["String"], "mitigationSuggestions": "String" },
  "confidenceScore": { "accuracy": "String", "freshness": "String", "level": "String", "reliability": "String", "quality": "String", "modelVersion": "String" },
  "aiExplanation": "String (Explain the reasoning for the hotzones and threats)"
}`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", temperature: 0.8 }
        });
        
        let text = response.text.trim();
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            text = text.substring(start, end + 1);
        }
        let result = JSON.parse(text);
        result.id = `SIM-${Math.floor(Math.random() * 10000)}`;
        result.timeframe = timeframe;
        result.timestamp = new Date().toISOString();
        
        // Save Prediction
        const newPrediction = new Prediction(result);
        await newPrediction.save();

        // Create Audit Log
        const newAudit = new AuditLog({
            id: `AUD-${Math.floor(Math.random() * 10000)}`,
            type: customPrompt ? 'custom_simulation' : 'standard_simulation',
            details: `Generated forecast for ${timeframe}. ${customPrompt ? `Directive: ${customPrompt}` : ''}`,
            timestamp: new Date().toISOString(),
            severity: 'info',
            user: userEmail || 'system'
        });
        await newAudit.save();

        // Emit Socket Update
        const updatedPredictions = await Prediction.find().sort({ createdAt: -1 });
        const updatedAudits = await AuditLog.find().sort({ createdAt: -1 });
        
        req.io.emit('update', { type: 'predictions', data: updatedPredictions });
        req.io.emit('update', { type: 'audit', data: updatedAudits });
        
        res.json({ prediction: newPrediction });
    } catch(err) {
        console.error("SECCOPILOT Forecast Generation error:", err);
        res.status(500).json({ error: "Failed to generate prediction forecast" });
    }
});

router.post('/gemini/chat', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: "Query is required" });
        }

        const ai = getGeminiClient();
        const prompt = `You are Rakshak AI, an advanced criminal forensics and intelligence copilot. 
You assist Chief Forensics Officers and investigators. 
Be concise, highly analytical, and maintain a professional, secure tone.
Answer the following query based on typical Indian law enforcement context, citing realistic (but mock) regions, codes, or procedures if necessary.

Query: "${query}"`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: { temperature: 0.7 }
        });
        
        res.json({ reply: response.text.trim() });
    } catch (error) {
        console.error("Gemini Chat error:", error);
        res.status(500).json({ error: "Failed to process chat query" });
    }
});

// Network Genome Routes
router.get('/network-genomes', async (req, res) => {
    try {
        const genomes = await Genome.find({});
        res.json(genomes);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/network-genome/sequence', async (req, res) => {
    try {
        const ai = getGeminiClient();
        const prompt = `You are an AI Forensic intelligence system mapping criminal networks. Generate a realistic real-time network genome sequencing report. Return ONLY valid JSON in the exact following schema, making up realistic Indian criminal syndicates, targets, and tactical shifts:
{
  "emerging_networks": [{ "name": "String", "description": "String", "status": "String (e.g. High Activity/Forming)" }],
  "mutated_networks": [{ "name": "String", "description": "String" }],
  "rapid_growth": [{ "name": "String", "description": "String" }],
  "dormant_networks": [{ "name": "String", "description": "String" }],
  "analytics": {
    "network_strength_percent": Number (0-100),
    "mutation_probability": Number (0-100),
    "collapse_point_nodes": Number (2-8),
    "collapse_probability": Number (0-100),
    "logistics_shift": "String",
    "recruitment_shift": "String",
    "target_network": "String",
    "expected_shift": ["City1", "City2"],
    "predicted_expansion": "String",
    "expansion_confidence": Number (0-100)
  }
}
Generate 2 emerging networks, 1 mutated network, 1 rapid growth network, and 1 dormant network.`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", temperature: 0.8 }
        });
        
        let text = response.text.trim();
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            text = text.substring(start, end + 1);
        }
        const result = JSON.parse(text);
        res.json(result);
    } catch(err) {
        console.error("Network Genome Sequencing error:", err);
        res.status(500).json({ error: "Failed to sequence network genome" });
    }
});

// AI Reconstruction Routes
router.get('/reconstructions', async (req, res) => {
    try {
        const recons = await AIReconstruction.find({});
        res.json(recons);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.get('/dashboard/stats', async (req, res) => {
    try {
        const Genome = require('../models/Genome');
        const AIReconstruction = require('../models/AIReconstruction');

        const identityRecons = await AIReconstruction.countDocuments() || 124;
        const activeNetworks = await Genome.countDocuments() || 8;
        const predictionsGenerated = await Prediction.countDocuments() || 1400;
        const newIntelligence = await AuditLog.countDocuments({ action: 'Prediction Generated' }) || 45;
        const forensicAlerts = await AuditLog.countDocuments({ severity: 'High' }) || 12;

        const recentRecons = await AIReconstruction.find().sort({ createdAt: -1 }).limit(3);
        const mappedRecons = recentRecons.length > 0 ? recentRecons.map(r => ({
            id: r.caseId || r._id.toString().substring(0, 7).toUpperCase(),
            match: `${r.predictedOrigin?.confidence || Math.floor(Math.random() * 20 + 80)}%`,
            status: r.potentialFamilies > 0 ? "Verified" : "Pending",
            time: "Recently"
        })) : [
            { id: "REC-942", match: "98%", status: "Verified", time: "10m ago" },
            { id: "REC-881", match: "84%", status: "Pending", time: "1h ago" },
            { id: "REC-705", match: "92%", status: "Verified", time: "3h ago" }
        ];

        res.json({
            identityRecons,
            activeNetworks,
            threatLevel: "CRITICAL",
            predictionsGenerated,
            newIntelligence,
            forensicAlerts,
            newReconstructions: mappedRecons,
            activeAnalyses: [
                { name: "Deepfake Audio Sweep", progress: 65, color: "emerald" },
                { name: "Device Extraction (Mobile)", progress: 40, color: "amber" }
            ],
            aiFindings: [
                { type: "Pattern Matches", desc: "14 new links established in Syndicate X communications." },
                { type: "Network Alerts", desc: "Unusual encrypted traffic detected in Sector 4." },
                { type: "Behavior Predictions", desc: "85% probability of target relocation in 24hrs." }
            ],
            dailyBrief: {
                newNetworkClusters: 3,
                emergingKingpins: 2,
                highRiskMigration: 1,
                identityMatches: 8
            }
        });
    } catch(err) { res.status(500).json({error: err.message}); }
});

module.exports = router;
