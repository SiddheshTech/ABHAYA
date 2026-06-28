const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO for real-time War Room updates
io.on('connection', (socket) => {
  console.log('A client connected to War Room Live Feed:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Pass io to routes so they can emit events
app.set('io', io);

// Basic Route
app.get('/', (req, res) => {
  res.send('Rakshak War Room API is running');
});

// Import Routes
const caseRoutes = require('./routes/cases');
const evidenceRoutes = require('./routes/evidence');
const leadRoutes = require('./routes/leads');
const operationRoutes = require('./routes/operations');
const threatRoutes = require('./routes/threats');
const forensicRoutes = require('./routes/forensics');
const rescueRoutes = require('./routes/rescue');
const dashboardRoutes = require('./routes/dashboard');

// Use Routes
app.use('/api/v1/cases', caseRoutes);
app.use('/api/v1/evidence', evidenceRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/operations', operationRoutes);
app.use('/api/v1/intelligence', threatRoutes);
app.use('/api/v1/forensics', forensicRoutes);
app.use('/api/v1/rescue', rescueRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5003;

// Connect to MongoDB and start server
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rakshak_warroom';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    // --- Auto-seed logic for views that need data ---
    const Lead = require('./models/Lead');
    const Operation = require('./models/Operation');
    const ThreatEvent = require('./models/ThreatEvent');
    const Evidence = require('./models/Evidence');

    const leadCount = await Lead.countDocuments();
    if (leadCount === 0) {
      console.log('Seeding Leads...');
      await Lead.insertMany([
        { type: 'Sighting', status: 'Unverified', location: 'Pune Station Platform 4', confidence: 91, distanceFromLastSeenKm: 2.3, aiRecommendation: { reasoning: 'CCTV footage timestamp aligns with last confirmed location. High probability match.' } },
        { type: 'Witness Report', status: 'Unverified', location: 'Nashik Bus Depot', confidence: 67, distanceFromLastSeenKm: 8.1, aiRecommendation: { reasoning: 'Citizen described clothing matching missing child profile. Medium confidence.' } },
        { type: 'Sighting', status: 'Verified', location: 'Siliguri Corridor - NH27', confidence: 88, distanceFromLastSeenKm: 45.0, aiRecommendation: { reasoning: 'Cell tower triangulation places target device at this location 3 hours ago.' } },
        { type: 'Media Upload', status: 'Verified', location: 'New Delhi Anand Vihar Bus Terminal', confidence: 95, distanceFromLastSeenKm: 120.5, aiRecommendation: { reasoning: 'Aadhaar-linked facial match at 95% confidence from railway CCTV scan.' } },
        { type: 'Anonymous Tip', status: 'Unverified', location: 'Mumbai Dharavi Sector 7', confidence: 45, distanceFromLastSeenKm: 5.0, aiRecommendation: { reasoning: 'Anonymous informant. Credibility score low. Requires field verification.' } },
      ]);
    }

    const opCount = await Operation.countDocuments();
    if (opCount === 0) {
      console.log('Seeding Operations...');
      await Operation.insertMany([
        { teamName: 'Team Alpha', status: 'On Mission', currentMission: { searchZone: 'Siliguri Corridor Sector 4', etaMinutes: 15, expectedCoverage: 88, successProbability: 76 } },
        { teamName: 'K9 Unit Bravo', status: 'Standby', currentMission: { searchZone: 'Darjeeling Border Ridge', etaMinutes: 30, expectedCoverage: 72, successProbability: 65 } },
        { teamName: 'UAV-Delta Aerial', status: 'Airborne', currentMission: { searchZone: 'Gangtok Transit Corridor', etaMinutes: 5, expectedCoverage: 95, successProbability: 89 } },
        { teamName: 'Patrol-Echo', status: 'On Mission', currentMission: { searchZone: 'Siliguri Railway Terminal', etaMinutes: 22, expectedCoverage: 80, successProbability: 71 } },
      ]);
    }

    const threatCount = await ThreatEvent.countDocuments();
    if (threatCount === 0) {
      console.log('Seeding ThreatEvents...');
      await ThreatEvent.insertMany([
        { type: 'Cross-State Movement', level: 'Critical', description: 'Target vehicle spotted crossing toll plaza into Nashik corridor. License plate partially matched.', confidenceScore: 95, sources: ['CCTV', 'ANPR'] },
        { type: 'New Criminal Links', level: 'High', description: 'Encrypted communication intercepted between Syndicate X node and known local associate in Pune.', confidenceScore: 88, sources: ['OSINT', 'SIGINT'] },
        { type: 'Suspicious Financial Activity', level: 'Medium', description: 'Bulk untraceable fund transfer of Rs.4.7L flagged via newly detected UPI handle linked to trafficking route.', confidenceScore: 65, sources: ['FinCEN'] },
        { type: 'Repeat Offender Sighting', level: 'Low', description: 'Minor associate released on bail spotted in CCTV surveillance zone near Dadar Station.', confidenceScore: 40, sources: ['CCTV'] },
        { type: 'Emerging Hotspot', level: 'High', description: 'Increased density of suspect cell pings near Sector 14 Market area. Pattern matches historical trafficking route.', confidenceScore: 82, sources: ['SIGINT', 'OSINT'] },
      ]);
    }

    const evidenceCount = await Evidence.countDocuments();
    if (evidenceCount === 0) {
      console.log('Seeding Evidence...');
      await Evidence.insertMany([
        { caseId: 'MH-2026-4001', type: 'Video', url: 'mock://cctv_pune_st_04.mp4', metadata: { size: '124 MB', location: 'Pune Station Platform 4', timestamp: '2026-10-24T14:30:00Z' }, uploaderId: 'insp_sharma', aiAnalysis: { facesDetected: 3, vehiclesIdentified: 1, textExtracted: 'None', objectsDetected: ['Backpack', 'Blue Jacket'], relatedCases: ['MH-2026-4001'] }, chainOfCustodyHash: 'abc123mock' },
        { caseId: 'MH-2026-4001', type: 'Audio', url: 'mock://intercept_audio_a1.wav', metadata: { size: '14 MB', location: 'Intercepted Channel', timestamp: '2026-10-24T12:00:00Z' }, uploaderId: 'cyber_cell', aiAnalysis: { facesDetected: 0, vehiclesIdentified: 0, textExtracted: 'Partial voice transcription available', objectsDetected: [], relatedCases: ['MH-2026-4001'] }, chainOfCustodyHash: 'def456mock' },
        { caseId: 'MH-2026-3992', type: 'Photos', url: 'mock://suspect_vehicle_plate.jpg', metadata: { size: '4.2 MB', location: 'Nashik NH-160', timestamp: '2026-10-23T08:15:00Z' }, uploaderId: 'traffic_dept', aiAnalysis: { facesDetected: 0, vehiclesIdentified: 1, textExtracted: 'MH 12 AB 7890', objectsDetected: ['Car'], relatedCases: ['MH-2026-3992'] }, chainOfCustodyHash: 'ghi789mock' },
        { caseId: 'DL-2026-0881', type: 'Device Dumps', url: 'mock://phone_dump_pixel7.zip', metadata: { size: '4.8 GB', location: 'Forensics Lab Delhi', timestamp: '2026-10-22T16:45:00Z' }, uploaderId: 'forensics_team', aiAnalysis: { facesDetected: 0, vehiclesIdentified: 0, textExtracted: '14,200 messages extracted', objectsDetected: [], relatedCases: ['DL-2026-0881', 'WB-2026-1104'] }, chainOfCustodyHash: 'jkl012mock' },
        { caseId: 'WB-2026-1104', type: 'Documents', url: 'mock://bank_statements_oct.pdf', metadata: { size: '2.1 MB', location: 'Kolkata Fin-Intel Division', timestamp: '2026-10-21T11:00:00Z' }, uploaderId: 'fin_intel', aiAnalysis: { facesDetected: 0, vehiclesIdentified: 0, textExtracted: '28 transactions flagged', objectsDetected: [], relatedCases: ['WB-2026-1104'] }, chainOfCustodyHash: 'mno345mock' },
      ]);
    }

    console.log('IWR Seed check complete.');

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
