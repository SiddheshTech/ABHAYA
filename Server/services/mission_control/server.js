require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');
const Team = require('./models/Team');
const Drone = require('./models/Drone');
const Mission = require('./models/Mission');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Inject IO into requests
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5005;

server.listen(PORT, () => {
    console.log(`Mission Control Server running on port ${PORT}`);
    
    // Start Simulation Loop
    setInterval(async () => {
        try {
            const teams = await Team.find({});
            for (let t of teams) {
                t.location.lat += (Math.random() - 0.5) * 0.002;
                t.location.lng += (Math.random() - 0.5) * 0.002;
                t.battery = Math.max(0, t.battery - 0.1);
                await t.save();
            }

            const drones = await Drone.find({});
            for (let d of drones) {
                d.location.lat += (Math.random() - 0.5) * 0.005;
                d.location.lng += (Math.random() - 0.5) * 0.005;
                d.battery = Math.max(0, d.battery - 0.2);
                await d.save();
            }

            const missions = await Mission.find({ status: 'Active' });
            for (let m of missions) {
                if (Math.random() > 0.7) {
                    m.progress = Math.min(100, m.progress + Math.floor(Math.random() * 5));
                    await m.save();
                }
            }

            io.emit("update", { type: "teams", data: await Team.find({}) });
            io.emit("update", { type: "drones", data: await Drone.find({}) });
            io.emit("update", { type: "missions", data: await Mission.find({}) });
        } catch (err) {
            console.error("Simulation error", err);
        }
    }, 3000);
});
