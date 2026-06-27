const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const Ticket = require('./models/Ticket');

const app = express();
const PORT = process.env.PORT || 5010;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/help/tickets', ticketRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Auth Service is running' });
});

// MongoDB Connection
let MONGO_URI = process.env.MONGO_URI || 'mongodb://rakshak_mongodb:27017/abhaya_auth';

const startServer = async () => {
  if (MONGO_URI.includes('rakshak_mongodb')) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    MONGO_URI = mongoServer.getUri();
  }
  
  mongoose.connect(MONGO_URI)
    .then(async () => {
      console.log('Connected to MongoDB');

      const ticketCount = await Ticket.countDocuments();
      if (ticketCount === 0) {
          await Ticket.create({
              ticketId: "TK-8492",
              subject: "Aadhaar Identity Gateway Latency",
              category: "Technical Issue",
              priority: "High",
              status: "Investigating",
              created: "2026-06-25 10:15 AM",
              messages: [{ sender: "System", text: "Ticket submitted. System log analysis initiated.", time: "10:15 AM" }]
          });
      }

      console.log('Seed complete.');

    app.listen(PORT, () => {
      console.log(`Auth Service listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
};
startServer();
