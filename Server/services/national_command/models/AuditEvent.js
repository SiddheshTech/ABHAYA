const mongoose = require('mongoose');

const auditEventSchema = new mongoose.Schema({
    eventType: { type: String, enum: ['Login', 'Case Created', 'Evidence Uploaded', 'Child Recovered', 'Network Updated', 'System Change', 'Security Event', 'Critical Event'], required: true },
    performedBy: { type: String, required: true },
    organizationName: { type: String, required: true },
    details: { type: String },
    timestamp: { type: Date, default: Date.now },
    isBlockchainVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('AuditEvent', auditEventSchema);
