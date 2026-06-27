require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Mission = require('./models/Mission');
const Team = require('./models/Team');
const GridSector = require('./models/GridSector');
const Emergency = require('./models/Emergency');
const { addBlock, AuditBlock } = require('./services/blockchain');

const seedData = async () => {
    await connectDB();
    console.log('Clearing old data...');
    await Mission.collection.drop().catch(() => {});
    await Team.collection.drop().catch(() => {});
    await GridSector.collection.drop().catch(() => {});
    await Emergency.collection.drop().catch(() => {});
    await AuditBlock.collection.drop().catch(() => {});

    console.log('Creating Missions...');
    const missions = await Mission.create([
        {
            id: 'CASE-409',
            title: 'Suresh (Lost Minor)',
            priority: 'Critical',
            area: 'Sikkim Corridor',
            progress: 25,
            status: 'Active',
            coordinates: { lat: 26.7271, lng: 88.5953 },
            assignedTeam: 'Team Alpha'
        },
        {
            id: 'CASE-112',
            title: 'Priya Das',
            priority: 'High',
            area: 'Darjeeling Border',
            progress: 10,
            status: 'Active',
            coordinates: { lat: 27.0375, lng: 88.2627 },
            assignedTeam: 'K9-Unit 03'
        },
        {
            id: 'CASE-802',
            title: 'Karan Johar',
            priority: 'Critical',
            area: 'Siliguri Railway Terminal',
            progress: 55,
            status: 'Active',
            coordinates: { lat: 26.7125, lng: 88.4236 },
            assignedTeam: 'Team Delta'
        },
        {
            id: 'CASE-921',
            title: 'Ananya Sen',
            priority: 'Medium',
            area: 'Gangtok Transit Block',
            progress: 80,
            status: 'Pending',
            coordinates: { lat: 27.3314, lng: 88.6138 },
            assignedTeam: 'UAV-Alpha'
        },
        {
            id: 'CASE-304',
            title: 'Rohit Sharma',
            priority: 'Low',
            area: 'Kalimpong Crossing',
            progress: 100,
            status: 'Completed',
            coordinates: { lat: 27.0594, lng: 88.4694 },
            assignedTeam: 'Patrol-02'
        }
    ]);

    console.log('Creating Teams...');
    await Team.create([
        { id: 'TEAM-001', name: 'Team Alpha', type: 'Drone', status: 'Idle', battery: 100, location: { lat: 26.7271, lng: 88.5953 } },
        { id: 'TEAM-002', name: 'Team Bravo', type: 'Ground', status: 'Active', battery: 85, location: { lat: 27.0375, lng: 88.2627 } }
    ]);

    console.log('Creating Grid Sectors...');
    await GridSector.create([
        { sectorId: 'Sector D', status: 'Unsearched', coveragePercent: 0, missProbability: 15, terrainDifficulty: 'High', highestProbability: true },
        { sectorId: 'Sector A', status: 'Completed', coveragePercent: 100, missProbability: 2, terrainDifficulty: 'Low', assignedTeam: 'Team Bravo' }
    ]);

    console.log('Creating Emergencies...');
    await Emergency.create({
        emergencyId: 'EMG-001',
        type: 'Amber Alert',
        description: 'Kidnapping alert reported near Nashik highway.',
        escalationLevel: 'Level 3',
        estimatedImpact: 'High'
    });

    console.log('Logging to Blockchain...');
    await addBlock({ eventType: 'Mission Initiated', eventId: missions[0]._id, timestamp: missions[0].createdAt });

    console.log('Seeding complete!');
    process.exit();
};

seedData();
