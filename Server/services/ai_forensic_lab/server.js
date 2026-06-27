require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Connect to Database
connectDB().then(async () => {
    const AIReconstruction = require('./models/AIReconstruction');
    const Genome = require('./models/Genome');
    const Prediction = require('./models/Prediction');
    const AuditLog = require('./models/AuditLog');

    const reconCount = await AIReconstruction.countDocuments();
    if (reconCount === 0) {
        console.log("Seeding AI Forensic data...");
        await AIReconstruction.insertMany([
            { caseId: "REC-942", photoUrl: "mock", voiceSampleUrl: "mock", predictedOrigin: { state: "Bihar", district: "Patna", confidence: 98 }, villageCluster: ["Rampur", "Baghpat"], potentialFamilies: 1, reasoning: ["Facial bone structure matches Eastern Indo-Aryan group", "Dialect analysis confirms Maithili variations"] },
            { caseId: "REC-881", photoUrl: "mock", voiceSampleUrl: "mock", predictedOrigin: { state: "Assam", district: "Dhubri", confidence: 84 }, villageCluster: ["Goalpara"], potentialFamilies: 0, reasoning: ["Voice harmonics suggest Tibeto-Burman influence"] },
            { caseId: "REC-705", photoUrl: "mock", voiceSampleUrl: "mock", predictedOrigin: { state: "Maharashtra", district: "Pune", confidence: 92 }, villageCluster: ["Kothrud"], potentialFamilies: 2, reasoning: ["Aadhaar biometrics generated partial fingerprint matches"] }
        ]);
        
        await Genome.insertMany([
            { networkId: "NET-ALPHA", mutationProbability: 82, expectedShift: "Logistics to Cyber-laundering", predictedExpansion: "High probability (91%) into West Bengal", kingpinDetected: true, networkStrength: 88, collapsePoint: "3 Nodes", nodes: ["Node-A1", "Node-A2", "Node-A3"] },
            { networkId: "NET-BETA", mutationProbability: 45, expectedShift: "Recruitment to Coercion", predictedExpansion: "Moderate (40%) into Karnataka", kingpinDetected: false, networkStrength: 45, collapsePoint: "1 Node", nodes: ["Node-B1"] },
            { networkId: "NET-GAMMA", mutationProbability: 12, expectedShift: "Dormant", predictedExpansion: "Low (10%)", kingpinDetected: false, networkStrength: 20, collapsePoint: "0 Nodes", nodes: [] }
        ]);
        
        await Prediction.insertMany([
            { 
                id: "PRED-101", 
                timeframe: "7 Days",
                timestamp: new Date().toISOString(),
                migrationRisk: { level: "High", trend: "up", confidence: 88, reasoning: "Analyzing movement vectors in frontier blocks.", factors: ["Crop failure", "Debt defaults"], regions: ["Assam", "Bengal"], timeline: "Next 48h", actions: "Deploy border units" },
                floodRisk: { probability: 65, rainfall: "Heavy", riverLevels: "Rising", satelliteData: "SAR active", districts: ["Kamrup"], forecast: "Inundation expected", impactAssessment: "Severe" },
                economicDistress: { vulnerabilityScore: 78, employment: "Low", migration: "High", inflation: "8%", foodSupply: "Strained", povertyIndex: "High", trendCharts: [10, 20, 30] },
                socialUnrest: { riskScore: 45, socialMedia: "Stable", crimeReports: "Average", protestMonitoring: "None", sentimentAnalysis: "Neutral", communityAlerts: "None" },
                predictedCases: { value: 114, changePercent: "+14%", confidence: 90, historicalComparison: "Higher than 2025", weeklyForecast: [10,12,15,20,18,25,14], monthlyForecast: [100, 120] },
                expectedLocations: [{ name: "Siliguri Corridor", probability: 85, confidence: 90, expectedTime: "24h", distance: "50km", lastActivity: "2h ago", details: "Transit hub" }],
                threatProbability: { gaugeValue: 90, trend: "Rising", forecast: "Critical", riskContributors: ["Syndicate Alpha"], mitigationSuggestions: "Intercept at transit points" },
                confidenceScore: { accuracy: "High", freshness: "Real-time", level: "90%", reliability: "Verified", quality: "A-Grade", modelVersion: "Gemini 2.5 Flash" },
                aiExplanation: "Synthesized from 42 datastreams."
            }
        ]);
        
        await AuditLog.insertMany([
            { action: "Prediction Generated", details: "Pattern Matches", severity: "High" },
            { action: "Genome Sequenced", details: "Network NET-ALPHA analyzed", severity: "Medium" }
        ]);
        console.log("Seed complete for AI Forensic Lab.");
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Inject IO into requests
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5004;

server.listen(PORT, () => console.log(`AI Forensic Lab Server running on port ${PORT}`));
