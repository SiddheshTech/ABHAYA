require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const AIReconstruction = require('./models/AIReconstruction');
const Profile = require('./models/Profile');
const Genome = require('./models/Genome');
const Prediction = require('./models/Prediction');
const { addBlock, AuditBlock } = require('./services/blockchain');

const seedData = async () => {
    await connectDB();
    console.log('Clearing old data...');
    await AIReconstruction.deleteMany();
    await Profile.deleteMany();
    await Genome.deleteMany();
    await Prediction.deleteMany();
    await AuditBlock.deleteMany();

    console.log('Creating Reconstructions...');
    const rec1 = await AIReconstruction.create({
        caseId: 'RK-Ghost-01',
        predictedOrigin: { state: 'Jharkhand', district: 'Latehar', confidence: 89 },
        villageCluster: ['Village A', 'Village B', 'Village C'],
        potentialFamilies: 7,
        reasoning: ['Dialect matches Southern Jharkhand', 'Voice pattern matches 3 local dialect clusters']
    });

    console.log('Creating Profiles...');
    await Profile.create({
        suspectId: 'SUS-901',
        archetype: 'Transporter',
        similarityScore: 87,
        riskLevel: 'High',
        violencePotential: 'Low',
        reoffendingProbability: 92,
        behaviorHistory: ['Moves victims at night', 'Uses rail transport'],
        associatedCrimes: ['Kidnapping', 'Extortion'],
        aiExplanation: 'Matches 2019 pattern. 87% similarity.'
    });

    console.log('Creating Genomes...');
    await Genome.create({
        networkId: 'G-12',
        mutationProbability: 78,
        expectedShift: 'Mumbai → Pune',
        predictedExpansion: 'Nashik',
        kingpinDetected: true,
        networkStrength: 85,
        collapsePoint: 'Financial Hub',
        nodes: ['Person', 'Vehicle', 'Location']
    });

    console.log('Creating Predictions...');
    await Prediction.create({
        district: 'Assam Sector 4',
        traffickingRisk: 'High',
        riskWindow: '4-8 Weeks',
        recommendedAction: 'Deploy NGO Resources',
        predictedCases: 15,
        threatProbability: 82,
        confidenceScore: 91,
        riskFactors: { floodRisk: 'High', economicDistress: 'Severe' }
    });

    console.log('Logging to Blockchain...');
    await addBlock({ eventType: 'Reconstruction Generated', eventId: rec1._id, timestamp: rec1.createdAt });

    console.log('Seeding complete!');
    process.exit();
};

seedData();
