const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

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
    .then(() => {
      console.log('Connected to MongoDB');
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
