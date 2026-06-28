const mongoose = require('mongoose');
const connectDB = require('./config/db');
require('dotenv').config();

const Child = require('./models/Child');
const Shelter = require('./models/Shelter');
const FamilyMatch = require('./models/FamilyMatch');
const WellnessRecord = require('./models/WellnessRecord');
const JourneyMilestone = require('./models/JourneyMilestone');

const seedData = async () => {
    try {
        await connectDB();

        console.log('Clearing existing CRC data...');
        await Child.deleteMany();
        await Shelter.deleteMany();
        await FamilyMatch.deleteMany();
        await WellnessRecord.deleteMany();
        await JourneyMilestone.deleteMany();

        console.log('Inserting Shelters...');
        await Shelter.insertMany([
            { id: "SH-101", name: "Mumbai SafeHaven", capacity: 50, occupancy: 42, contactInfo: "+91 22 555 0192", specializedCare: ["Pediatric", "Trauma"], staffAvailable: 12, status: "Capacity Warning", doctors: "Dr. Alok Verma (Pediatrician), Dr. Anita Deshmukh (Psychiatrist)", counsellors: "Sanjay Joshi (Youth Specialist), Maria D'Souza (Therapist)", inspectionHistory: "Passed (January 2026)", performanceScore: "88/100", fundingStatus: "Emergency Grants Activated due to occupancy", supplyStatus: "Restocking Needed (Medical kits & therapeutic milk)", details: "Critical Western hub focusing on immediate rescue intake. High density, requires active capacity transfers." },
            { id: "SH-102", name: "Pune Aashray", capacity: 80, occupancy: 30, contactInfo: "+91 20 555 0188", specializedCare: ["Education", "Therapy"], staffAvailable: 20, status: "Normal", doctors: "Dr. Milind Kulkarni (General), Dr. Swati Patil (Nutritionist)", counsellors: "Anjali Gore (Cognitive Therapist), Rahul Sawant (Case Worker)", inspectionHistory: "Passed (February 2026)", performanceScore: "92/100", fundingStatus: "Stable (Local Trust & CSR Matching)", supplyStatus: "Sufficient (Abundant storage beds)", details: "Long-term therapeutic recovery retreat with open garden classrooms and educational workspaces." },
            { id: "SH-103", name: "Delhi Care Center", capacity: 100, occupancy: 95, contactInfo: "+91 11 555 0122", specializedCare: ["Intensive Care"], staffAvailable: 25, status: "Capacity Warning", doctors: "Dr. Sunita Sharma (Pediatrician), Dr. Ravi Sen (General)", counsellors: "Manoj Kumar (Trauma Specialist), Priya Shah (Child Psychologist)", inspectionHistory: "Passed with Honors (March 2026)", performanceScore: "95/100", fundingStatus: "Fully Funded (Ministry Grant Vatsalya)", supplyStatus: "Sufficient (3 months buffer medicine & meals)", details: "Primary Northern India gateway shelter equipped with standard child play rooms and isolation beds." }
        ]);

        console.log('Inserting Children...');
        const children = [
            { id: "CH-001", name: "Aarav", age: 7, gender: "Male", location: "Mumbai SafeHaven", status: "Recovering", riskLevel: "Low Risk", arrivalDate: "2026-05-10", medicalAlerts: ["Asthma"], profileImage: "https://i.pravatar.cc/150?u=a", officerNotes: "Child is well adjusted. Undergoing routine counselling sessions. Daily log entries indicate normal, healthy progress.", caseWorker: "Inspector Raj, Child Welfare Unit" },
            { id: "CH-002", name: "Priya", age: 5, gender: "Female", location: "Pune Aashray", status: "Rescued", riskLevel: "Medium Risk", arrivalDate: "2026-06-25", medicalAlerts: [], profileImage: "https://i.pravatar.cc/150?u=p", officerNotes: "Family matched with grandfather in Pune. Legal reintegration verification with local CWC underway. Child feels happy and secure about returning home.", caseWorker: "Senior Counsellor Devendra Rao" },
            { id: "CH-003", name: "Rohan", age: 9, gender: "Male", location: "Delhi Care Center", status: "Verified", riskLevel: "High Risk", arrivalDate: "2026-06-01", medicalAlerts: ["Malnutrition"], profileImage: "https://i.pravatar.cc/150?u=r", officerNotes: "Rahul is undergoing physical rehabilitation. Exhibiting strong learning progress. Enjoys wooden toys and reading short picture sentences. Medical staff suggests increasing dietary proteins.", caseWorker: "Inspector Raj, Child Welfare Special Unit" }
        ];
        await Child.insertMany(children);

        console.log('Inserting Family Matches...');
        await FamilyMatch.insertMany([
            { id: "FM-001", childId: "CH-001", matchName: "Rajesh Kumar", relationship: "Grandfather", confidenceScore: 92, biometricMatch: 88, voiceMatch: 95, status: "Pending Verification", location: "Pune" },
            { id: "FM-002", childId: "CH-003", matchName: "Sunita Devi", relationship: "Mother", confidenceScore: 98, biometricMatch: 99, voiceMatch: 96, status: "Interview Scheduled", location: "Delhi" }
        ]);

        console.log('Inserting Wellness Records...');
        await WellnessRecord.insertMany([
            { id: "WR-001", childId: "CH-001", physicalHealth: 80, mentalHealth: 70, nutrition: 85, education: 60, emotional: 65, social: 75, medicalAlerts: ["Asthma"] },
            { id: "WR-002", childId: "CH-002", physicalHealth: 60, mentalHealth: 50, nutrition: 55, education: 40, emotional: 45, social: 50, medicalAlerts: [] },
            { id: "WR-003", childId: "CH-003", physicalHealth: 40, mentalHealth: 30, nutrition: 45, education: 20, emotional: 35, social: 40, medicalAlerts: ["Malnutrition"] }
        ]);

        console.log('Inserting Journey Milestones...');
        await JourneyMilestone.insertMany([
            { id: "JM-001", childId: "CH-001", title: "Rescued", status: "Completed", date: "2026-05-10", description: "Child safely recovered from transit.", currentStage: "Recovering", daysInCare: 48, progressPercentage: 60 },
            { id: "JM-002", childId: "CH-001", title: "Medical Clearance", status: "Completed", date: "2026-05-12", description: "Initial health check passed.", currentStage: "Recovering", daysInCare: 48, progressPercentage: 60 },
            { id: "JM-003", childId: "CH-001", title: "Family Identified", status: "Current", date: "2026-06-20", description: "Grandfather located in Pune.", currentStage: "Recovering", daysInCare: 48, progressPercentage: 60 }
        ]);

        console.log('CRC Seeding complete!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
