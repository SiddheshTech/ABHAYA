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
    await Mission.deleteMany();
    await Team.deleteMany();
    await GridSector.deleteMany();
    await Emergency.deleteMany();
    await AuditBlock.deleteMany();

    console.log('Creating Missions...');
    const mission1 = await Mission.create({
        missionId: 'RK-204',
        searchRadiusKm: 12,
        coveragePercent: 74,
        successProbability: 83,
        recommendedDeployment: 'Sector 4',
        coordinates: { lat: 19.0760, lng: 72.8777 }
    });

    console.log('Creating Teams...');
    await Team.create([
        { teamId: 'Team Alpha', type: 'Drone', status: 'Ready', batteryOrFuelLevel: 100, personnelCount: 2, coverageRadiusKm: 5 },
        { teamId: 'Team Bravo', type: 'Ground', status: 'On Mission', batteryOrFuelLevel: 85, personnelCount: 12, coverageRadiusKm: 3 }
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
    await addBlock({ eventType: 'Mission Initiated', eventId: mission1._id, timestamp: mission1.createdAt });

    console.log('Seeding complete!');
    process.exit();
};

seedData();
