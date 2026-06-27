require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Mission = require('./models/Mission');
const Team = require('./models/Team');
const Drone = require('./models/Drone');
const { addBlock, AuditBlock } = require('./services/blockchain');

const seedData = async () => {
    await connectDB();
    console.log('Clearing old data...');
    await Mission.deleteMany();
    await Team.deleteMany();
    await Drone.deleteMany();
    await AuditBlock.deleteMany();

    console.log('Creating Missions...');
    const mission1 = await Mission.create({
        id: 'RK-204',
        title: 'Alpha Sector Sweep',
        priority: 'High',
        area: 'Sector 4',
        progress: 74,
        status: 'Active',
        logs: ['Mission initiated', 'Teams deployed']
    });

    console.log('Creating Teams...');
    await Team.create([
        { id: 'T-01', name: 'Team Alpha', type: 'Tactical', status: 'Active', location: { lat: 19.0760, lng: 72.8777 }, battery: 100 },
        { id: 'T-02', name: 'Team Bravo', type: 'Ground', status: 'En Route', location: { lat: 19.0780, lng: 72.8787 }, battery: 85 }
    ]);
    
    console.log('Creating Drones...');
    await Drone.create([
        { id: 'D-01', name: 'Eagle 1', status: 'Airborne', altitude: 400, battery: 92, location: { lat: 19.0760, lng: 72.8777 } },
        { id: 'D-02', name: 'Falcon 9', status: 'Searching', altitude: 120, battery: 45, location: { lat: 19.0800, lng: 72.8800 } }
    ]);

    console.log('Logging to Blockchain...');
    await addBlock({ eventType: 'Mission Initiated', eventId: mission1._id, timestamp: mission1.createdAt });

    console.log('Seeding complete!');
    process.exit();
};

seedData();
