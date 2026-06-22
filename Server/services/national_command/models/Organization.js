const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    type: { type: String, enum: ['Police', 'NGO', 'Shelter', 'Hospital', 'CWC', 'Government Agency'], required: true },
    name: { type: String, required: true },
    activeUsers: { type: Number, default: 0 },
    casesHandled: { type: Number, default: 0 },
    performanceScore: { type: Number, default: 100 },
    complianceScore: { type: Number, default: 100 },
    status: { type: String, enum: ['Active', 'Pending', 'Suspended'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);
