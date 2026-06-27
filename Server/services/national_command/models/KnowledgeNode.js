const mongoose = require('mongoose');

const knowledgeNodeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String },
    riskScore: { type: Number, default: 0 },
    details: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeNode', knowledgeNodeSchema);
