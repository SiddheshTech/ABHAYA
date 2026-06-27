const mongoose = require('mongoose');

const knowledgeEdgeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    relationship: { type: String, required: true },
    confidence: { type: Number, default: 100 },
    strength: { type: Number, default: 100 },
    details: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeEdge', knowledgeEdgeSchema);
