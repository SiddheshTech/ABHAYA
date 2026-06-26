const mongoose = require('mongoose');
const Case = require('../models/Case');
const Lead = require('../models/Lead');
const GenomeMutation = require('../models/GenomeMutation');
const LiveTracker = require('../models/LiveTracker');

// Configure MongoDB connection URI matching docker-compose
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/investigation_war_room';

async function seed() {
  try {
    console.log('Connecting to MongoDB at ' + MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    // Clear existing data
    console.log('Clearing existing data...');
    await Case.deleteMany({});
    await Lead.deleteMany({});
    await GenomeMutation.deleteMany({});
    await LiveTracker.deleteMany({});

    // Seed Cases
    console.log('Seeding Cases...');
    const case1 = await Case.create({
      caseId: 'MH-2026-4001',
      name: 'Rohan Kumar',
      age: 8,
      hoursMissing: 48,
      riskScore: 92,
      status: 'Active',
      state: 'Maharashtra',
      district: 'Mumbai',
      officerAssigned: 'Insp. Smith Kadam',
      photoUrl: 'https://images.unsplash.com/photo-1618640726880-9092497f1fbc?auto=format&fit=crop&w=150&q=80',
      lastSeenLocation: 'Sector 14 Market, Navi Mumbai',
      mostRecentLead: 'Similar description matched at Lonavala toll plaza. Vehicle plate partial match.',
      timeline: [
        { event: 'Reported', timestamp: new Date(Date.now() - 48*60*60*1000) },
        { event: 'Verified', timestamp: new Date(Date.now() - 47*60*60*1000) },
        { event: 'Evidence Added', timestamp: new Date(Date.now() - 24*60*60*1000) }
      ],
      aiPredictions: { likelyRoute: 'Mumbai -> Pune', confidence: 84, recommendedAction: 'Deploy Team Bravo' }
    });

    const case2 = await Case.create({
      caseId: 'MH-2026-4002',
      name: 'Aarav Patel',
      age: 6,
      hoursMissing: 24,
      riskScore: 85,
      status: 'Active',
      state: 'Maharashtra',
      district: 'Pune',
      officerAssigned: 'Insp. Neha Sharma',
      photoUrl: 'https://images.unsplash.com/photo-1519340241574-2cebc577ee80?auto=format&fit=crop&w=150&q=80',
      lastSeenLocation: 'Viman Nagar, Pune',
      mostRecentLead: 'Caller reported seeing child at local bus stop.',
      timeline: [{ event: 'Reported', timestamp: new Date(Date.now() - 24*60*60*1000) }]
    });

    const case3 = await Case.create({
      caseId: 'MH-2026-4003',
      name: 'Priya Singh',
      age: 10,
      hoursMissing: 72,
      riskScore: 98,
      status: 'Escalated',
      state: 'Maharashtra',
      district: 'Nagpur',
      officerAssigned: 'Insp. Rajesh Kumar',
      photoUrl: 'https://images.unsplash.com/photo-1522262590532-a991489a0253?auto=format&fit=crop&w=150&q=80',
      lastSeenLocation: 'Dharampeth, Nagpur',
      mostRecentLead: 'Photo matched with 98% confidence on traffic camera.',
      timeline: [{ event: 'Reported', timestamp: new Date(Date.now() - 72*60*60*1000) }]
    });

    // Seed Leads
    console.log('Seeding Leads...');
    await Lead.create([
      {
        type: 'Sighting',
        status: 'Unverified',
        location: 'Pune-Mumbai Expressway, Toll Plaza',
        confidence: 45,
        distanceFromLastSeenKm: 4.2,
        linkedCaseId: case1._id,
        aiRecommendation: { action: 'Escalate', reasoning: 'A black SUV matching the description of the suspect vehicle was seen heading towards Mumbai.' }
      },
      {
        type: 'Anonymous Tip',
        status: 'AI Reviewed',
        location: 'Sector 14, Industrial Area',
        confidence: 72,
        distanceFromLastSeenKm: 1.1,
        linkedCaseId: case2._id,
        aiRecommendation: { action: 'Merge', reasoning: 'Multiple unfamiliar vehicles parked outside the abandoned warehouse since midnight.' }
      },
      {
        type: 'Witness Report',
        status: 'Officer Reviewed',
        location: 'Nashik City Center Mall',
        confidence: 85,
        distanceFromLastSeenKm: 0.8,
        linkedCaseId: case1._id,
        aiRecommendation: { action: 'Request Verification', reasoning: 'A witness reported seeing an individual resembling Kingpin Alpha entering the mall basement.' }
      }
    ]);

    // Seed Genome Mutations
    console.log('Seeding Genome Mutations...');
    await GenomeMutation.create([
      {
        networkId: 'G12',
        status: 'Rapid Growth',
        metrics: { kingpinDetected: true, networkStrength: 85, collapsePointProbability: 42, mutationRisk: 78 },
        forecast: { mutationProbability: 80, expectedShiftRoute: 'Nashik Corridor', predictedExpansionArea: 'Pune' }
      },
      {
        networkId: 'ViperCell',
        status: 'Rapid Growth',
        metrics: { kingpinDetected: true, networkStrength: 90, collapsePointProbability: 30, mutationRisk: 85 },
        forecast: { mutationProbability: 95, expectedShiftRoute: 'Eastern Highway', predictedExpansionArea: 'Nagpur' }
      },
      {
        networkId: 'SyndicateX',
        status: 'Emerging',
        metrics: { kingpinDetected: false, networkStrength: 40, collapsePointProbability: 80, mutationRisk: 45 },
        forecast: { mutationProbability: 25, expectedShiftRoute: 'Coastal Highway', predictedExpansionArea: 'Mumbai' }
      }
    ]);

    // Seed LiveTrackers
    console.log('Seeding Live Trackers...');
    await LiveTracker.create([
      {
        entityId: 'Suspected Transit (Terminal 2)',
        entityType: 'DangerZone',
        missionId: 'M-001',
        location: { type: 'Point', coordinates: [72.8732, 19.0967] }
      },
      {
        entityId: 'Alpha Team Deployed',
        entityType: 'GroundTeam',
        missionId: 'M-002',
        location: { type: 'Point', coordinates: [73.8567, 18.5204] }
      },
      {
        entityId: 'CCTV 45 Match',
        entityType: 'MissingChild',
        missionId: 'M-003',
        location: { type: 'Point', coordinates: [77.2090, 28.6139] }
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
