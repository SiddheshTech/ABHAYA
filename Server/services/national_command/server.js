require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Connect to Database
connectDB().then(async () => {
    const State = require('./models/State');
    const Network = require('./models/Network');
    const Prediction = require('./models/Prediction');
    const Organization = require('./models/Organization');
    const Recovery = require('./models/Recovery');
    const MajorCase = require('./models/MajorCase');

    const count = await State.countDocuments();
    if (count === 0) {
        console.log("Seeding initial data...");
        await State.insertMany([
            { name: 'Maharashtra', missingCases: 150, recoveredCases: 138, networksDetected: 4, riskIndex: 'High Risk', activeOperations: 12, coordinates: { lat: 19.75, lng: 75.71 } },
            { name: 'Assam', missingCases: 80, recoveredCases: 45, networksDetected: 2, riskIndex: 'Emergency', activeOperations: 8, coordinates: { lat: 26.20, lng: 92.93 } },
            { name: 'Delhi-NCR', missingCases: 200, recoveredCases: 195, networksDetected: 6, riskIndex: 'Safe', activeOperations: 18, coordinates: { lat: 28.61, lng: 77.20 } }
        ]);

        await Network.insertMany([
            { clusterId: 'Cluster G12 Syndicate', growthStatus: 'Expanding', kingpinsDetected: 2, affectedStates: ['Maharashtra', 'Gujarat'], threatLevel: 'Critical' },
            { clusterId: 'Cluster G18', growthStatus: 'Stable', kingpinsDetected: 0, affectedStates: ['Assam'], threatLevel: 'Medium' }
        ]);

        await Prediction.insertMany([
            { targetState: 'Assam Borders', expectedSpike: '3 Weeks', confidenceScore: 87, riskFactors: { migrationRisk: 'High Risk' }, recommendations: [], forecastPeriod: '1 Month' },
            { targetState: 'North Bihar Plain', expectedSpike: '2 Weeks', confidenceScore: 79, riskFactors: { migrationRisk: 'Medium Risk' }, recommendations: [], forecastPeriod: '1 Week' }
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
        console.log("Seed complete.");
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => console.log(`National Command Server running on port ${PORT}`));
