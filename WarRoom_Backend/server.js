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

// Use Routes
app.use('/api/v1/cases', caseRoutes);
app.use('/api/v1/evidence', evidenceRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/operations', operationRoutes);
app.use('/api/v1/intelligence', threatRoutes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rakshak_warroom';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
