const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const SecurityLog = require('../models/SecurityLog');
const Passkey = require('../models/Passkey');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'abhaya_super_secret_jwt_key_2026';

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'Stakeholder',
    });

    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        assignedUnits: newUser.assignedUnits,
        preferences: newUser.preferences,
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log the session (simplified)
    const newSession = new Session({
      userId: user._id,
      device: req.body.device || 'Unknown Device',
      os: req.body.os || 'Unknown OS',
      browser: req.body.browser || 'Unknown Browser',
      ipAddress: req.ip || '127.0.0.1',
      location: req.body.location || 'Unknown Location',
      isCurrent: true
    });
    await newSession.save();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        assignedUnits: user.assignedUnits,
        preferences: user.preferences,
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Verify Token Route (useful for frontend initialization)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1] !== 'null') {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (e) {
        console.warn('Invalid token, falling back to default user');
      }
    }

    let user;
    if (userId) {
      user = await User.findById(userId).select('-password');
    }

    // DEMO FALLBACK: If no valid token, create or return the default CRC user
    if (!user) {
      user = await User.findOne({ email: 'k.rao@abhaya-crc.gov.in' }).select('-password');
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        user = await User.create({
          name: "Inspector Kavita Rao",
          email: "k.rao@abhaya-crc.gov.in",
          password: hashedPassword,
          role: "CRC",
          employeeId: "EMP-CRC-2026",
          badgeNumber: "AIF-84920",
          rank: "Chief Inspector / Child Welfare CWO",
          organization: "ABHAYA Mission Vatsalya Portal",
          department: "Special Operations & Child Rehabilitation",
          designation: "Lead Recovery Officer",
          phone: "+91 98765 43210",
          emergencyContact: "+91 99887 76655",
          bio: "Dedicated child protection advocate and emergency rescue coordinator with over 8 years of experience in family tracking, shelter operations, and trauma-informed recovery interventions.",
          avatarSeed: "Kavita",
          preferences: {
            theme: "Light Mode",
            language: "English (US)",
            timeZone: "UTC+05:30 (Indian Standard Time)",
            dateFormat: "DD/MM/YYYY",
            accessibility: true,
            alerts: { rescue: true, emergency: true, predictive: true, verification: true, medical: true, capacity: false, psychological: true },
            routing: { browserPush: true, emailDigest: true, smsGateway: false, localSystem: true }
          }
        });
        user.password = undefined; // Hide password
      }
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Token Verification Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Profile (General PUT)
router.put('/me', async (req, res) => {
  try {
    let userId = req.body.id;
    if (!userId) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1] !== 'null') {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } else {
        // Fallback to the default CRC user
        const defaultUser = await User.findOne({ email: 'k.rao@abhaya-crc.gov.in' });
        if (defaultUser) userId = defaultUser._id;
      }
    }

    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const user = await User.findByIdAndUpdate(
      userId, 
      { $set: req.body },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// Get Active Sessions
router.get('/sessions', async (req, res) => {
  try {
    // Return mock sessions if auth fails for demo
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1] !== 'null') {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (e) {}
    }

    if (!userId) {
      const defaultUser = await User.findOne({ email: 'k.rao@abhaya-crc.gov.in' });
      if (defaultUser) userId = defaultUser._id;
    }

    let sessions = [];
    if (userId) {
      sessions = await Session.find({ userId }).sort({ createdAt: -1 });
    }
    
    // Add fake demo sessions if empty
    if (sessions.length === 0) {
      sessions = [
        { id: "sess-1", device: "MacBook Pro", browser: "Chrome / New Delhi, India", ipAddress: "192.168.1.1", isCurrent: true, createdAt: new Date().toISOString() },
        { id: "sess-2", device: "iPhone 14 Pro", browser: "Mobile Safari / Mumbai, India", ipAddress: "103.45.2.19", isCurrent: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
        { id: "sess-3", device: "Ubuntu Workstation", browser: "Firefox / Bangalore, India", ipAddress: "45.118.156.40", isCurrent: false, createdAt: new Date(Date.now() - 86400000).toISOString() }
      ];
    }
    
    res.status(200).json({ sessions });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching sessions' });
  }
});

// Revoke Session
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });
    
    // Allow deleting session
    await Session.findByIdAndDelete(req.params.sessionId);
    res.status(200).json({ message: 'Session revoked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error revoking session' });
  }
});

// Get Security Logs
router.get('/security-logs', async (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1] !== 'null') {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (e) {}
    }

    if (!userId) {
      const defaultUser = await User.findOne({ email: 'k.rao@abhaya-crc.gov.in' });
      if (defaultUser) userId = defaultUser._id;
    }

    let logs = [];
    if (userId) {
      logs = await SecurityLog.find({ userId }).sort({ createdAt: -1 });
    }

    if (logs.length === 0) {
      logs = [
        { id: "log-1", event: "Password changed successfully", createdAt: "2026-06-25T11:30:00.000Z", ip: "192.168.1.1", status: "Success", type: "Password" },
        { id: "log-2", event: "New Device Registered (iPhone 14 Pro)", createdAt: "2026-06-25T09:12:00.000Z", ip: "103.45.2.19", status: "Success", type: "Device" },
        { id: "log-3", event: "2FA authentication verification", createdAt: "2026-06-25T08:00:00.000Z", ip: "192.168.1.1", status: "Success", type: "MFA" },
        { id: "log-4", event: "Failed login attempt (Wrong password)", createdAt: "2026-06-24T22:15:00.000Z", ip: "45.118.156.40", status: "Failed", type: "Auth" }
      ];
      if (userId) {
        await SecurityLog.insertMany(logs.map(l => ({...l, userId})));
        logs = await SecurityLog.find({ userId }).sort({ createdAt: -1 });
      }
    }

    res.status(200).json({ securityLogs: logs });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching security logs' });
  }
});

// Get Passkeys
router.get('/passkeys', async (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1] !== 'null') {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (e) {}
    }

    if (!userId) {
      const defaultUser = await User.findOne({ email: 'k.rao@abhaya-crc.gov.in' });
      if (defaultUser) userId = defaultUser._id;
    }

    let passkeys = [];
    if (userId) {
      passkeys = await Passkey.find({ userId }).sort({ createdAt: -1 });
    }

    if (passkeys.length === 0) {
      passkeys = [
        { name: "YubiKey 5C NFC", added: new Date("2026-02-15") },
        { name: "Windows Hello / Touch ID", added: new Date("2026-04-10") }
      ];
      if (userId) {
        await Passkey.insertMany(passkeys.map(p => ({...p, userId})));
        passkeys = await Passkey.find({ userId }).sort({ createdAt: -1 });
      }
    }

    res.status(200).json({ passkeys });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching passkeys' });
  }
});

// Get System Metrics
router.get('/system-metrics', async (req, res) => {
  try {
    // Generate some dynamic mock metrics for system
    const systemMetrics = {
      ping: Math.floor(Math.random() * 20) + 15,
      activeTransactions: Math.floor(Math.random() * 5) + 2,
      wsPacketsSent: Math.floor(Math.random() * 2000) + 1000,
      wsPacketsReceived: Math.floor(Math.random() * 2000) + 1000,
      aiLoad: Math.floor(Math.random() * 30) + 10,
      aiRequestCount: 342,
      storageUsed: 2.4,
      cacheUsed: 312,
      networkSpeed: "85 Mbps",
      isOnline: true
    };
    res.status(200).json({ systemMetrics });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching metrics' });
  }
});

module.exports = router;
