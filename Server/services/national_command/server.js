require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');
const knowledgeRoutes = require('./routes/knowledgeRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Connect to Database
connectDB().then(async () => {
    const State = require('./models/State');
    const Network = require('./models/Network');
    const Prediction = require('./models/Prediction');
    const Organization = require('./models/Organization');
    const Recovery = require('./models/Recovery');
    const MajorCase = require('./models/MajorCase');
    const AIModel = require('./models/AIModel');
    const AuditEvent = require('./models/AuditEvent');
    
    // Knowledge Vault models
    const KnowledgeNode = require('./models/KnowledgeNode');
    const KnowledgeEdge = require('./models/KnowledgeEdge');
    const RecentIntel = require('./models/RecentIntel');
    const SavedReport = require('./models/SavedReport');
    const FavoriteCase = require('./models/FavoriteCase');
    const Watchlist = require('./models/Watchlist');
    const AISuggestion = require('./models/AISuggestion');

    const count = await State.countDocuments();
    if (count === 0) {
        console.log("Seeding initial data...");
        await State.insertMany([
            { name: "Delhi-NCR", missingCases: 14, recoveredCases: 1420, networksDetected: 3, riskIndex: "Low (12/100)", activeOperations: 2, coordinates: { lat: 28.61, lng: 77.20 } },
            { name: "Maharashtra", missingCases: 42, recoveredCases: 1240, networksDetected: 8, riskIndex: "Medium (58/100)", activeOperations: 4, coordinates: { lat: 19.75, lng: 75.71 } },
            { name: "Karnataka", missingCases: 18, recoveredCases: 890, networksDetected: 4, riskIndex: "Low (24/100)", activeOperations: 1, coordinates: { lat: 15.31, lng: 75.71 } },
            { name: "Uttar Pradesh", missingCases: 94, recoveredCases: 1840, networksDetected: 12, riskIndex: "High (89/100)", activeOperations: 8, coordinates: { lat: 26.84, lng: 80.94 } },
            { name: "West Bengal", missingCases: 51, recoveredCases: 980, networksDetected: 6, riskIndex: "High (74/100)", activeOperations: 3, coordinates: { lat: 22.98, lng: 87.85 } },
            { name: "Tamil Nadu", missingCases: 12, recoveredCases: 1040, networksDetected: 2, riskIndex: "Low (18/100)", activeOperations: 1, coordinates: { lat: 11.12, lng: 78.65 } },
            { name: "Bihar", missingCases: 68, recoveredCases: 620, networksDetected: 9, riskIndex: "High (82/100)", activeOperations: 5, coordinates: { lat: 25.09, lng: 85.31 } },
            { name: "Assam", missingCases: 39, recoveredCases: 410, networksDetected: 7, riskIndex: "Critical (94/100)", activeOperations: 6, coordinates: { lat: 26.20, lng: 92.93 } }
        ]);

        await Network.insertMany([
            { clusterId: "Cluster G12", growthStatus: "+18% this month", threatLevel: "Extreme", kingpinsDetected: 1, affectedStates: ["Bihar", "Maharashtra", "Gujarat"] },
            { clusterId: "Cluster G18", growthStatus: "+12% this month", threatLevel: "Critical", kingpinsDetected: 1, affectedStates: ["Assam", "West Bengal"] },
            { clusterId: "Cluster G21", growthStatus: "Stable", threatLevel: "High", kingpinsDetected: 2, affectedStates: ["Odisha", "Andhra Pradesh"] }
        ]);

        await Prediction.insertMany([
            { targetState: 'Assam Borders', expectedSpike: 'High', confidenceScore: 87, riskFactors: { migrationRisk: 'Critical' }, recommendations: ['Deploy Allied NGOs', 'Increase Police Patrols'], forecastPeriod: '1 Month' },
            { targetState: 'North Bihar Plain', expectedSpike: 'Medium', confidenceScore: 79, riskFactors: { migrationRisk: 'High' }, recommendations: ['Issue Community Alerts'], forecastPeriod: '1 Week' }
        ]);

        await AIModel.insertMany([
            { name: "Identity Engine", version: "v4.2", status: "Online", accuracy: 96.4, inferencesCompleted: 18412 },
            { name: "Network Genome", version: "v3.1", status: "Retraining", accuracy: 94.2, inferencesCompleted: 9140 },
            { name: "Prediction Engine", version: "v2.5", status: "Online", accuracy: 91.8, inferencesCompleted: 24501 },
            { name: "Cognitive Heatmaps", version: "v1.8", status: "Online", accuracy: 92.0, inferencesCompleted: 4200 },
            { name: "Behavioral AI", version: "v4.0", status: "Online", accuracy: 95.5, inferencesCompleted: 11029 }
        ]);

        await AuditEvent.insertMany([
            { eventType: "System Change", performedBy: "Auto-Sys", organizationName: "Network Genome", details: "AI Retraining Triggered", isBlockchainVerified: true, timestamp: new Date() },
            { eventType: "Critical Event", performedBy: "Commander", organizationName: "Assam Sector-04", details: "Node Dispatch Alert", isBlockchainVerified: true, timestamp: new Date() }
        ]);

        await Organization.insertMany([
            { type: 'Police', name: 'DCPU-West-02', activeUsers: 450, casesHandled: 48, performanceScore: 92, complianceScore: 98 },
            { type: 'NGO', name: 'CRC-North-04', activeUsers: 120, casesHandled: 39, performanceScore: 95, complianceScore: 100 }
        ]);

        await Recovery.insertMany([
            { child: "Aarav Sharma", sector: "Delhi Sector 3", status: "Verified", time: "12m ago" },
            { child: "Priya Murmu", sector: "Jharkhand Hub", status: "Transited to Shelter", time: "2h ago" },
            { child: "Aditya Verma", sector: "UP Central Corridor", status: "Reunified", time: "4h ago" }
        ]);

        await MajorCase.insertMany([
            { name: "Sighting Cluster Indore", priority: "Critical", status: "Operation Active" },
            { name: "Transit Pipeline Dhubri", priority: "High", status: "Under Surveillance" }
        ]);
        console.log("Seed complete for core national command.");
    }

    const intelCount = await RecentIntel.countDocuments();
    if (intelCount === 0) {
        console.log("Seeding Knowledge Vault data...");
        await KnowledgeNode.insertMany([
            { id: "NODE-1", type: "suspect", name: "Raman Kalra", status: "ACTIVE", riskScore: 85, details: { role: "Kingpin" } },
            { id: "NODE-2", type: "location", name: "Siliguri Transit", status: "MONITOR", riskScore: 92, details: { region: "West Bengal" } }
        ]);
        await KnowledgeEdge.insertMany([
            { id: "EDGE-1", source: "NODE-1", target: "NODE-2", relationship: "operates_in", confidence: 95, strength: 88, details: {} }
        ]);
        await RecentIntel.insertMany([
            { id: "INT-001", title: "New Syndicate Pattern Detected", category: "prediction", timestamp: new Date().toISOString(), officer: "AI CORE", status: "active", summary: "Graph model indicates structural shift." }
        ]);
        await SavedReport.insertMany([
            { id: "REP-001", title: "Annual Trafficking Threat Assessment", type: "Strategic", author: "Dr. Smith Kadam", date: "2026-06-20", size: "4.2 MB", version: 1, status: "Approved", content: "Executive summary...", tags: ["Threat"] }
        ]);
        await FavoriteCase.insertMany([
            { id: "CASE-992", title: "Operation Nightfall (Assam)", tags: ["Active", "High Priority"], priority: "CRITICAL", personalNotes: "Watch node 4 closely.", assignedOfficer: "Team Alpha", lastUpdated: "2h ago", timeline: [] }
        ]);
        await Watchlist.insertMany([
            { id: "WATCH-1", type: "Vehicle", value: "MH-04-AB-1234", status: "MONITORING", addedDate: "2026-06-25", alertCount: 2, tags: ["Suspect Vehicle"], riskScore: 78 }
        ]);
        await AISuggestion.insertMany([
            { id: "SUG-1", title: "Deploy drone surveillance at Sector 4", type: "Tactical", confidence: 94, why: "Recent activity spike correlates with historical transit patterns.", supportingEvidence: ["Cell tower pings", "Informant drop"], recommendedAction: "Activate drone squad Alpha", reasoning: "Minimize risk to ground units." }
        ]);
        console.log("Seed complete for Knowledge Vault.");
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
app.use('/api/knowledge', knowledgeRoutes);

const PORT = process.env.PORT || 5002;

server.listen(PORT, () => console.log(`National Command Server (with IO) running on port ${PORT}`));
