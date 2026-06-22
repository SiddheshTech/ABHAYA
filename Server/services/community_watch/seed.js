require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Citizen = require('./models/Citizen');
const Alert = require('./models/Alert');
const Sighting = require('./models/Sighting');
const FeedItem = require('./models/FeedItem');
const { AuditBlock } = require('./services/blockchain');

const seedData = async () => {
    await connectDB();

    console.log('Clearing old data...');
    await Citizen.deleteMany();
    await Alert.deleteMany();
    await Sighting.deleteMany();
    await FeedItem.deleteMany();
    await AuditBlock.deleteMany();

    console.log('Creating Citizens...');
    const hero = await Citizen.create({
        name: 'Rahul Sharma',
        location: 'Delhi',
        trustScore: 98,
        communityRank: 'Hero',
        verificationStatus: 'Verified',
        impact: { tipsSubmitted: 12, verifiedSightings: 5, childrenHelped: 2, alertsShared: 45 },
        badges: ['Helper', 'Protector', 'Guardian', 'Champion', 'Hero'],
        impactTimeline: [{ month: 'May', description: 'Submitted 2 Tips' }, { month: 'June', description: '5 Sightings Verified' }]
    });

    console.log('Creating Alerts...');
    const alert1 = await Alert.create({
        photoUrl: '/missing-child-1.jpg',
        name: 'Rohan',
        age: 7,
        gender: 'Male',
        location: 'Connaught Place, Delhi',
        coordinates: { lat: 28.6315, lng: 77.2167 },
        lastSeenDate: new Date(Date.now() - 50000000), // ~14 hours ago
        riskLevel: 'High',
        status: 'Active',
        shares: 120
    });

    console.log('Creating Feed Items...');
    await FeedItem.create({
        type: 'Emergency Alert',
        title: 'Missing Child: Rohan',
        description: 'Last seen wearing a red shirt near Connaught Place.',
        mediaUrl: '/missing-child-1.jpg',
        relatedAlertId: alert1._id,
        location: 'Delhi'
    });

    console.log('Creating Sighting...');
    await Sighting.create({
        citizenId: hero._id,
        alertId: alert1._id,
        location: 'Rajiv Chowk Metro Station',
        aiAnalysis: { possibleMatch: true, confidenceScore: 85, relatedCaseId: alert1._id },
        status: 'Verified'
    });

    console.log('Seeding complete!');
    process.exit();
};

seedData();
