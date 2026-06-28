const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    occupancy: { type: Number, required: true },
    contactInfo: { type: String, required: true },
    specializedCare: [{ type: String }],
    staffAvailable: { type: Number, required: true },
    status: { type: String, enum: ['Normal', 'Capacity Warning', 'Medical Request'], required: true },
    doctors: { type: String, default: "" },
    counsellors: { type: String, default: "" },
    inspectionHistory: { type: String, default: "" },
    performanceScore: { type: String, default: "" },
    fundingStatus: { type: String, default: "" },
    supplyStatus: { type: String, default: "" },
    details: { type: String, default: "" }
}, { timestamps: true });

shelterSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Shelter', shelterSchema);
