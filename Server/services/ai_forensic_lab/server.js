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
            { caseId: "REC-942", predictedOrigin: { confidence: 98 }, potentialFamilies: 1 },
            { caseId: "REC-881", predictedOrigin: { confidence: 84 }, potentialFamilies: 0 },
            { caseId: "REC-705", predictedOrigin: { confidence: 92 }, potentialFamilies: 2 }
        ]);
        
        await Genome.insertMany([
            { networkId: "NET-ALPHA", mutationProbability: 80, expectedShift: "Logistics", kingpinDetected: true },
            { networkId: "NET-BETA", mutationProbability: 40, expectedShift: "Recruitment", kingpinDetected: false }
        ]);
        
        await Prediction.insertMany([
            { id: "PRED-101", timeframe: "24hrs", threatProbability: { gaugeValue: 90 } }
        ]);
        
        await AuditLog.insertMany([
            { action: "Prediction Generated", details: "Pattern Matches", severity: "High" },
            { action: "Prediction Generated", details: "Network Alerts", severity: "Medium" }
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
