const mongoose = require('mongoose');

const journeyMilestoneSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    childId: { type: String, required: true },
    title: { type: String, required: true },
    status: { type: String, enum: ['Completed', 'Current', 'Pending'], required: true },
    date: { type: String },
    description: { type: String, required: true },
    currentStage: { type: String },
    daysInCare: { type: Number },
    progressPercentage: { type: Number }
}, { timestamps: true });

journeyMilestoneSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('JourneyMilestone', journeyMilestoneSchema);
