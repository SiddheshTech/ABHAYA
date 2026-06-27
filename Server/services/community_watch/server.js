require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Connect to Database
connectDB().then(async () => {
    const Broadcast = require('./models/Broadcast');
    const Patrol = require('./models/Patrol');
    const Incident = require('./models/Incident');

    const count = await Broadcast.countDocuments();
    if (count === 0) {
        console.log("Seeding initial data...");
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
        console.log("Seed complete.");
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5001; // Use 5001 to avoid conflict if run locally

app.listen(PORT, () => console.log(`Community Watch Server running on port ${PORT}`));
