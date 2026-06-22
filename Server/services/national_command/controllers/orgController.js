const Organization = require('../models/Organization');
const AuditEvent = require('../models/AuditEvent');

exports.getOrganizations = async (req, res) => {
    try {
        const orgs = await Organization.find();
        res.json(orgs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAuditLedger = async (req, res) => {
    try {
        const events = await AuditEvent.find().sort({ timestamp: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
