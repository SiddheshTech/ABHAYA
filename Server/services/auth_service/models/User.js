const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Stakeholder' },
  
  // Profile Settings
  employeeId: { type: String },
  badgeNumber: { type: String },
  rank: { type: String },
  organization: { type: String },
  department: { type: String },
  designation: { type: String },
  phone: { type: String, default: '+1 (555) 000-0000' },
  emergencyContact: { type: String },
  bio: { type: String },
  avatarSeed: { type: String },
  
  assignedUnits: {
    primary: { type: String, default: 'Tactical Operations Div.' },
    secondary: { type: String, default: 'Emergency Response Team' }
  },
  
  preferences: {
    // Appearance
    theme: { type: String, default: 'System Default' },
    language: { type: String, default: 'English (US)' },
    timeZone: { type: String, default: 'UTC (Coordinated Universal Time)' },
    dateFormat: { type: String, default: 'YYYY-MM-DD (24hr)' },
    accessibility: { type: Boolean, default: true },
    
    // Notifications
    alerts: {
      rescue: { type: Boolean, default: true },
      emergency: { type: Boolean, default: true },
      predictive: { type: Boolean, default: true },
      verification: { type: Boolean, default: true },
      medical: { type: Boolean, default: true },
      capacity: { type: Boolean, default: false },
      psychological: { type: Boolean, default: true }
    },
    routing: {
      browserPush: { type: Boolean, default: true },
      emailDigest: { type: Boolean, default: true },
      smsGateway: { type: Boolean, default: false },
      localSystem: { type: Boolean, default: true }
    }
  },
  
  recoveryPrefs: {
    defaultDashboard: { type: String, default: 'Recovery Center' },
    autoRefreshInterval: { type: String, default: '30s' },
    defaultSearchRadius: { type: Number, default: 50 },
    aiRecommendationLevel: { type: String, default: 'Moderate' },
    defaultMapLayer: { type: String, default: 'Street View' },
    timelinePreferences: { type: String, default: 'Chronological' },
    casePriorityDisplay: { type: String, default: 'High-to-Low' },
    childCardLayout: { type: String, default: 'Detailed List' }
  },

  aiConfig: {
    recoveryAiEnabled: { type: Boolean, default: true },
    aiSuggestions: { type: Boolean, default: true },
    aiCaseSummaries: { type: Boolean, default: true },
    aiPredictions: { type: Boolean, default: true },
    aiRiskAnalysis: { type: Boolean, default: true },
    aiNotifications: { type: Boolean, default: true },
    aiAutoClassification: { type: Boolean, default: false }
  },

  privacyConfig: {
    dataSharing: { type: Boolean, default: true },
    telemetryEnabled: { type: Boolean, default: false },
    autoBackup: { type: Boolean, default: true },
    backupFrequency: { type: String, default: 'Weekly' }
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
