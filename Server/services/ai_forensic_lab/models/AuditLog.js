const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    details: { type: String, required: true },
    timestamp: { type: String, required: true },
    severity: { type: String, enum: ['info', 'warning', 'critical'], required: true },
    user: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
