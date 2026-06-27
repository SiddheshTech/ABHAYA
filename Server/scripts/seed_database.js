const mongoose = require('mongoose');

// Seed Data
const children = [
    { id: "RC-2041", name: "Ananya", age: 7, gender: "Female", location: "Hope Center, Delhi", status: "Recovering", riskLevel: "Low Risk", arrivalDate: "2026-06-10", medicalAlerts: [], profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya" },
    { id: "RC-2042", name: "Rahul", age: 12, gender: "Male", location: "SafeHaven, Mumbai", status: "Medical Check", riskLevel: "High Risk", arrivalDate: "2026-06-20", medicalAlerts: ["Malnutrition"], profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
    { id: "RC-2043", name: "Priya", age: 5, gender: "Female", location: "Aashray, Pune", status: "Family Matched", riskLevel: "Low Risk", arrivalDate: "2026-05-15", medicalAlerts: [], profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
    { id: "RC-2044", name: "Amit", age: 9, gender: "Male", location: "Hope Center, Delhi", status: "Rescued", riskLevel: "Medium Risk", arrivalDate: "2026-06-24", medicalAlerts: ["Anxiety"], profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit" },
    { id: "RC-2045", name: "Unknown", age: 4, gender: "Female", location: "Care Home, Bangalore", status: "Verification", riskLevel: "High Risk", arrivalDate: "2026-06-22", medicalAlerts: ["Speech Delay"], profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown" },
    { id: "RC-2046", name: "Suresh", age: 14, gender: "Male", location: "SafeHaven, Mumbai", status: "Reintegrating", riskLevel: "Low Risk", arrivalDate: "2026-02-10", medicalAlerts: [], profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh" }
];

const shelters = [
    { id: "S-1", name: "Hope Center, Delhi", capacity: 150, occupancy: 120, contactInfo: "+91 9876543210", specializedCare: ["Trauma Therapy", "Education"], staffAvailable: 24, status: "Normal" },
    { id: "S-2", name: "SafeHaven, Mumbai", capacity: 100, occupancy: 95, contactInfo: "+91 9876543211", specializedCare: ["Medical Recovery"], staffAvailable: 15, status: "Capacity Warning" },
    { id: "S-3", name: "Aashray, Pune", capacity: 50, occupancy: 20, contactInfo: "+91 9876543212", specializedCare: ["Early Childhood"], staffAvailable: 10, status: "Normal" },
    { id: "S-4", name: "Care Home, Bangalore", capacity: 200, occupancy: 150, contactInfo: "+91 9876543213", specializedCare: ["Special Needs", "Rehabilitation"], staffAvailable: 30, status: "Medical Request" }
];

const familyMatches = [
    { id: "M-1", childId: "RC-2042", matchName: "Geeta Devi", relationship: "Grandmother", confidenceScore: 95, biometricMatch: 98, voiceMatch: 85, status: "Pending Verification", location: "Pune Rural" },
    { id: "M-2", childId: "RC-2043", matchName: "Rajesh Kumar", relationship: "Father", confidenceScore: 99, biometricMatch: 99, voiceMatch: 95, status: "Approved", location: "Mumbai" },
    { id: "M-3", childId: "RC-2046", matchName: "Sita", relationship: "Aunt", confidenceScore: 82, biometricMatch: 80, voiceMatch: 75, status: "Interview Scheduled", location: "Delhi" }
];

const wellnessRecords = [
    { id: "W-1", childId: "RC-2041", physicalHealth: 80, mentalHealth: 70, nutrition: 85, education: 60, emotional: 75, social: 80, medicalAlerts: [] },
    { id: "W-2", childId: "RC-2042", physicalHealth: 40, mentalHealth: 50, nutrition: 30, education: 40, emotional: 45, social: 50, medicalAlerts: ["Malnutrition"] },
    { id: "W-3", childId: "RC-2043", physicalHealth: 90, mentalHealth: 85, nutrition: 90, education: 80, emotional: 90, social: 85, medicalAlerts: [] },
    { id: "W-4", childId: "RC-2044", physicalHealth: 70, mentalHealth: 40, nutrition: 80, education: 50, emotional: 40, social: 60, medicalAlerts: ["Anxiety"] }
];

const journeyMilestones = [
    { id: "J-1", childId: "RC-2042", title: "Rescued", status: "Completed", date: "2026-06-20", description: "Child safely recovered from station.", currentStage: "Medical Assessment", daysInCare: 5, progressPercentage: 40 },
    { id: "J-2", childId: "RC-2042", title: "Medical Assessment", status: "Completed", date: "2026-06-21", description: "Initial health checkup completed.", currentStage: "Medical Assessment", daysInCare: 5, progressPercentage: 40 },
    { id: "J-3", childId: "RC-2042", title: "Identity Verification", status: "Current", date: "2026-06-22", description: "Cross-referencing database.", currentStage: "Medical Assessment", daysInCare: 5, progressPercentage: 40 },
    { id: "J-4", childId: "RC-2042", title: "Family Matching", status: "Pending", date: "", description: "Awaiting biometric results.", currentStage: "Medical Assessment", daysInCare: 5, progressPercentage: 40 },
    { id: "J-5", childId: "RC-2042", title: "Reintegration", status: "Pending", date: "", description: "Final stage before going home.", currentStage: "Medical Assessment", daysInCare: 5, progressPercentage: 40 }
];

const teams = [
    { id: "T-1", name: "Team Alpha", type: "Ground", status: "Active", location: { lat: 34.05, lng: -118.25 }, battery: 85 },
    { id: "T-2", name: "Team Bravo", type: "Ground", status: "En Route", location: { lat: 34.06, lng: -118.24 }, battery: 92 },
    { id: "T-3", name: "K9 Unit Delta", type: "K9", status: "Active", location: { lat: 34.04, lng: -118.26 }, battery: 100 }
];

const drones = [
    { id: "D-1", name: "Air-1", status: "Searching", altitude: 120, battery: 74, location: { lat: 34.055, lng: -118.255 } },
    { id: "D-2", name: "Air-2", status: "Hovering", altitude: 80, battery: 45, location: { lat: 34.045, lng: -118.245 } }
];

const missions = [
    { id: "OP-DELTA", title: "Sector 4 Sweep", priority: "Critical", area: "8 km", progress: 45, status: "Active", logs: ["Target identified", "Moving to intercept"] },
    { id: "OP-ECHO", title: "River Zone Search", priority: "High", area: "3.5 km", progress: 80, status: "Active", logs: ["K9 unit deployed", "Scent picked up"] },
    { id: "OP-NOVA", title: "Downtown Patrol", priority: "Medium", area: "12 km", progress: 15, status: "Active", logs: ["Routine check", "No anomalies"] }
];

async function seedChildProtection() {
    const mongoUri = "mongodb://localhost:27017/child_recovery";
    console.log(`Connecting to ${mongoUri}...`);
    const conn = await mongoose.createConnection(mongoUri).asPromise();
    console.log("Connected to child_recovery DB.");
    
    // Define minimal models for seeding
    const Child = conn.model('Child', new mongoose.Schema({ id: String }, { strict: false }));
    const Shelter = conn.model('Shelter', new mongoose.Schema({ id: String }, { strict: false }));
    const FamilyMatch = conn.model('FamilyMatch', new mongoose.Schema({ id: String }, { strict: false }));
    const WellnessRecord = conn.model('WellnessRecord', new mongoose.Schema({ id: String }, { strict: false }));
    const JourneyMilestone = conn.model('JourneyMilestone', new mongoose.Schema({ id: String }, { strict: false }));

    await Child.deleteMany({});
    await Shelter.deleteMany({});
    await FamilyMatch.deleteMany({});
    await WellnessRecord.deleteMany({});
    await JourneyMilestone.deleteMany({});
    
    await Child.insertMany(children);
    await Shelter.insertMany(shelters);
    await FamilyMatch.insertMany(familyMatches);
    await WellnessRecord.insertMany(wellnessRecords);
    await JourneyMilestone.insertMany(journeyMilestones);
    
    console.log("child_protection DB seeded successfully.");
    await conn.close();
}

seedChildProtection().then(async () => {
    console.log("Seeding mission_control DB...");
    const mongoUri = "mongodb://localhost:27017/mission_control";
    const conn = await mongoose.createConnection(mongoUri).asPromise();
    
    const Team = conn.model('Team', new mongoose.Schema({ id: String }, { strict: false }));
    const Drone = conn.model('Drone', new mongoose.Schema({ id: String }, { strict: false }));
    const Mission = conn.model('Mission', new mongoose.Schema({ id: String }, { strict: false }));

    await Team.deleteMany({});
    await Drone.deleteMany({});
    await Mission.deleteMany({});
    
    await Team.insertMany(teams);
    await Drone.insertMany(drones);
    await Mission.insertMany(missions);
    
    console.log("mission_control DB seeded successfully.");
    await conn.close();

    console.log("Seeding complete.");
    process.exit(0);
}).catch(console.error);
