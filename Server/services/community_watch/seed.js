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
        notes: 'He was alone, looking lost.',
        status: 'Pending'
    });

    const Broadcast = require('./models/Broadcast');
    const Patrol = require('./models/Patrol');
    const Incident = require('./models/Incident');

    console.log('Clearing new models...');
    await Broadcast.deleteMany();
    await Patrol.deleteMany();
    await Incident.deleteMany();

    console.log('Creating Patrols, Broadcasts, Incidents...');
    await Broadcast.insertMany([
        { sender: "Delhi HQ", msg: "Immediate priority alert: Active search in South West District. Volunteers check your emails.", time: "10 mins ago", level: "Critical" },
        { sender: "Patna Command", msg: "Operation Muskaan Phase IV initialized. High density shelters listed.", time: "42 mins ago", level: "Warning" },
        { sender: "Mumbai Metro", msg: "Security check completed for Central station railway shelter.", time: "2 hrs ago", level: "Info" }
    ]);

    await Patrol.insertMany([
        { patrolId: "P-401", area: "Sarojini Nagar Market", volunteers: 4, status: "On Patrol", lastPing: "3 mins ago" },
        { patrolId: "P-402", area: "Noida Sector 62", volunteers: 3, status: "Resting", lastPing: "18 mins ago" },
        { patrolId: "P-403", area: "Howrah Jn Platform 3-5", volunteers: 6, status: "Responding", lastPing: "Just Now" },
        { patrolId: "P-404", area: "Patna Junction Gate A", volunteers: 2, status: "On Patrol", lastPing: "12 mins ago" }
    ]);

    await Incident.insertMany([
        { incidentId: "INC-883", title: "Sighting of Missing Boy #3381", loc: "New Delhi Railway Station", status: "Verified", time: "1 hr ago" },
        { incidentId: "INC-882", title: "Suspicious group near school gate", loc: "Sector 4, Dwarka", status: "Dispatched", time: "3 hrs ago" },
        { incidentId: "INC-881", title: "Unidentified runaway girl sheltered", loc: "Sewa Ashram, Ghaziabad", status: "Resolved", time: "5 hrs ago" }
    ]);

    console.log('Database seeded successfully!');


    console.log('Seeding complete!');
    process.exit();
};

seedData();
