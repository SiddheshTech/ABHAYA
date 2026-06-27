const mongoose = require('mongoose');

const wellnessRecordSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    childId: { type: String, required: true },
    physicalHealth: { type: Number, required: true },
    mentalHealth: { type: Number, required: true },
    nutrition: { type: Number, required: true },
    education: { type: Number, required: true },
    emotional: { type: Number, required: true },
    social: { type: Number, required: true },
    medicalAlerts: [{ type: String }]
}, { timestamps: true });

wellnessRecordSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('WellnessRecord', wellnessRecordSchema);
