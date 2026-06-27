const mongoose = require('mongoose');

const aiSuggestionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    confidence: { type: Number, default: 0 },
    why: { type: String, required: true },
    supportingEvidence: [String],
    recommendedAction: { type: String, required: true },
    reasoning: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('AISuggestion', aiSuggestionSchema);
