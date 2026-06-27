import mongoose from 'mongoose';
import { db } from './server/dataStore';
import { initialCriminalProfiles } from './server/criminalStore';

async function seedDatabases() {
    console.log("Seeding child_recovery DB...");
    const childDbUri = "mongodb://localhost:27017/child_recovery";
    const childConn = await mongoose.createConnection(childDbUri).asPromise();
    await childConn.dropDatabase();
    
    const Child = childConn.model('Child', new mongoose.Schema({ id: String }, { strict: false }));
    const Shelter = childConn.model('Shelter', new mongoose.Schema({ id: String }, { strict: false }));
    const FamilyMatch = childConn.model('FamilyMatch', new mongoose.Schema({ id: String }, { strict: false }));
    const WellnessRecord = childConn.model('WellnessRecord', new mongoose.Schema({ id: String }, { strict: false }));
    const JourneyMilestone = childConn.model('JourneyMilestone', new mongoose.Schema({ id: String }, { strict: false }));

    await Child.deleteMany({});
    await Shelter.deleteMany({});
    await FamilyMatch.deleteMany({});
    await WellnessRecord.deleteMany({});
    await JourneyMilestone.deleteMany({});
    
    await Child.insertMany(db.children);
    await Shelter.insertMany(db.shelters);
    await FamilyMatch.insertMany(db.familyMatches);
    await WellnessRecord.insertMany(db.wellnessRecords);
    await JourneyMilestone.insertMany(db.journeyMilestones);
    
    await childConn.close();
    console.log("child_recovery DB seeded successfully.");

    console.log("Seeding mission_control DB...");
    const missionUri = "mongodb://localhost:27017/mission_control";
    const missionConn = await mongoose.createConnection(missionUri).asPromise();
    await missionConn.dropDatabase();
    
    const Team = missionConn.model('Team', new mongoose.Schema({ id: String }, { strict: false }));
    const Drone = missionConn.model('Drone', new mongoose.Schema({ id: String }, { strict: false }));
    const Mission = missionConn.model('Mission', new mongoose.Schema({ id: String }, { strict: false }));

    await Team.deleteMany({});
    await Drone.deleteMany({});
    await Mission.deleteMany({});
    
    await Team.insertMany(db.teams);
    await Drone.insertMany(db.drones);
    await Mission.insertMany(db.missions);
    
    await missionConn.close();
    console.log("mission_control DB seeded successfully.");

    console.log("Seeding ai_forensic_lab DB...");
    const forensicUri = "mongodb://localhost:27017/ai_forensic_lab";
    const forensicConn = await mongoose.createConnection(forensicUri).asPromise();
    await forensicConn.dropDatabase();
    
    const CriminalProfile = forensicConn.model('CriminalProfile', new mongoose.Schema({ id: String }, { strict: false }));

    await CriminalProfile.deleteMany({});
    
    await CriminalProfile.insertMany(initialCriminalProfiles);
    
    await forensicConn.close();
    console.log("ai_forensic_lab DB seeded successfully.");

    console.log("Seeding complete.");
    process.exit(0);
}

seedDatabases().catch(console.error);
