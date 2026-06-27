const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, default: 'Unknown' },
    age: { type: Number },
    gender: { type: String },
    location: { type: String },
    status: { type: String },
    riskLevel: { type: String, enum: ['Low Risk', 'Medium Risk', 'High Risk'] },
    arrivalDate: { type: String },
    medicalAlerts: [{ type: String }],
    profileImage: { type: String }
}, { timestamps: true });

// Strip _id and __v from output when calling toJSON
childSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Child', childSchema);
