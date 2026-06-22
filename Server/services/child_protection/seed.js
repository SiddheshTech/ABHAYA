require('dotenv').config();
const mongoose = require('mongoose');
const Shelter = require('./models/Shelter');
const Child = require('./models/Child');
const FamilyMatch = require('./models/FamilyMatch');
const AuditBlock = require('./models/AuditBlock');
const connectDB = require('./config/db');
const { addBlock } = require('./services/blockchain');

const seedData = async () => {
    await connectDB();

    console.log('Clearing old data...');
    await Shelter.deleteMany();
    await Child.deleteMany();
    await FamilyMatch.deleteMany();
    await AuditBlock.deleteMany();

    console.log('Creating Shelters...');
    const shelter1 = await Shelter.create({
        name: 'Mumbai Central Relief Shelter',
        location: 'Mumbai, India',
        capacity: 100,
        currentOccupancy: 85,
        medicalFacilities: true,
        staffCount: 20,
        performanceScore: 95,
        inspectionStatus: 'Pass'
    });

    console.log('Creating Children...');
    const child1 = new Child({
        temporaryId: 'CHD-1001',
        name: 'Aarav',
        age: 8,
        currentStatus: 'Rescued',
        riskLevel: 'Medium',
        assignedShelter: shelter1._id,
        wellness: {
            physicalHealth: 'Stable',
            mentalHealth: 'Stable',
            nutrition: 'Underweight',
            education: 'None',
            socialDevelopment: 'Withdrawn'
        },
        timeline: [
            { stage: 'Rescued', notes: 'Found near railway station.', date: new Date() }
        ]
    });
    await child1.save();
    await addBlock({ eventType: 'CHILD_REGISTERED', childId: child1._id, temporaryId: child1.temporaryId, timestamp: new Date() });

    const child2 = new Child({
        temporaryId: 'CHD-1002',
        name: 'Priya',
        age: 6,
        currentStatus: 'Verified',
        riskLevel: 'Low',
        assignedShelter: shelter1._id,
        timeline: [
            { stage: 'Rescued', notes: 'Found in market.', date: new Date(Date.now() - 1000000000) },
            { stage: 'Medical Check', notes: 'Clearance received.', date: new Date(Date.now() - 500000000) }
        ]
    });
    await child2.save();
    await addBlock({ eventType: 'CHILD_REGISTERED', childId: child2._id, temporaryId: child2.temporaryId, timestamp: new Date() });

    console.log('Creating Family Match...');
    await FamilyMatch.create({
        childId: child2._id,
        candidates: [
            {
                familyName: 'Sharma Family',
                location: 'Delhi',
                confidenceScore: 95,
                matchCriteria: { identityMatch: 98, voiceMatch: 90, villageMatch: 95, communityMatch: 92 },
                verificationStatus: 'Pending',
                aiExplanation: {
                    languageMatch: "Hindi dialect perfectly matches child's vocabulary.",
                    regionalSimilarity: "Family originates from the same district child was suspected to be taken from.",
                    villageCorrelation: "Both mention 'Rampur' frequently."
                }
            }
        ]
    });

    console.log('Seeding complete!');
    process.exit();
};

seedData();
