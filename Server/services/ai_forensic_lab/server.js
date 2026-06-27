require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

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

const PORT = process.env.PORT || 5004;

server.listen(PORT, () => console.log(`AI Forensic Lab Server running on port ${PORT}`));
