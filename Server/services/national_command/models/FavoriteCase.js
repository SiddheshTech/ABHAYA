const mongoose = require('mongoose');

const favoriteCaseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    tags: [String],
    priority: { type: String, required: true },
    personalNotes: { type: String, default: "" },
    reminderDate: { type: String },
    assignedOfficer: { type: String, required: true },
    lastUpdated: { type: String, required: true },
    timeline: [{
        date: String,
        event: String,
        officer: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('FavoriteCase', favoriteCaseSchema);
