require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const State = require('./models/State');
const Network = require('./models/Network');
const Prediction = require('./models/Prediction');
const AIModel = require('./models/AIModel');
const Organization = require('./models/Organization');
const AuditEvent = require('./models/AuditEvent');
const { addBlock, AuditBlock } = require('./services/blockchain');

const seedData = async () => {
    await connectDB();

    console.log('Clearing old data...');
    await State.deleteMany();
    await Network.deleteMany();
    await Prediction.deleteMany();
    await AIModel.deleteMany();
    await Organization.deleteMany();
    await AuditEvent.deleteMany();
    await AuditBlock.deleteMany();

    console.log('Creating States...');
    await State.create([
        { name: 'Maharashtra', missingCases: 150, recoveredCases: 138, networksDetected: 4, riskIndex: 'High Risk', activeOperations: 12, coordinates: { lat: 19.75, lng: 75.71 } },
        { name: 'Assam', missingCases: 80, recoveredCases: 45, networksDetected: 2, riskIndex: 'Emergency', activeOperations: 8, coordinates: { lat: 26.20, lng: 92.93 } },
        { name: 'Kerala', missingCases: 20, recoveredCases: 18, networksDetected: 0, riskIndex: 'Safe', activeOperations: 1, coordinates: { lat: 10.85, lng: 76.27 } }
    ]);

    console.log('Creating Networks...');
    await Network.create([
        { clusterId: 'Cluster G12', growthStatus: 'Expanding', kingpinsDetected: 2, affectedStates: ['Maharashtra', 'Gujarat'], threatLevel: 'Critical' },
        { clusterId: 'Cluster G18', growthStatus: 'Stable', kingpinsDetected: 0, affectedStates: ['Assam'], threatLevel: 'Medium' }
    ]);

    console.log('Creating Predictions...');
    await Prediction.create({
        targetState: 'Assam',
        expectedSpike: '3 Weeks',
        confidenceScore: 87,
        riskFactors: { weatherRisk: 'High - Flooding', migrationRisk: 'Severe' },
        recommendations: ['Deploy NGOs', 'Increase Patrols', 'Launch Awareness Campaign'],
        forecastPeriod: '1 Month'
    });

    console.log('Creating AI Models...');
    await AIModel.create([
        { name: 'Identity Engine', healthStatus: 'Healthy', accuracy: 91, predictionsGenerated: 18000, retrainingStatus: 'Up to date', inferenceSpeedMs: 45, systemLoadPercent: 62 },
        { name: 'Network Genome', healthStatus: 'Degraded', accuracy: 84, predictionsGenerated: 4500, retrainingStatus: 'Training', inferenceSpeedMs: 120, systemLoadPercent: 88 }
    ]);

    console.log('Creating Organizations...');
    await Organization.create([
        { type: 'Police', name: 'Maharashtra Cyber Cell', activeUsers: 450, casesHandled: 1200, performanceScore: 92, complianceScore: 98 },
        { type: 'NGO', name: 'Save The Children India', activeUsers: 120, casesHandled: 340, performanceScore: 95, complianceScore: 100 }
    ]);

    console.log('Creating Audit Events & Blockchain Ledger...');
    const event1 = await AuditEvent.create({
        eventType: 'Network Updated',
        performedBy: 'Agent K. Sharma',
        organizationName: 'Maharashtra Cyber Cell',
        details: 'Cluster G12 tagged as Expanding towards Pune.',
        isBlockchainVerified: true
    });
    await addBlock({ eventType: event1.eventType, eventId: event1._id, timestamp: event1.timestamp });

    console.log('Seeding complete!');
    process.exit();
};

seedData();
