const mongoose = require('mongoose');

const journeyEventSchema = new mongoose.Schema({
    stage: { type: String, enum: ['Rescued', 'Sheltered', 'Medical Check', 'Counselling', 'Family Search', 'Reintegration'], required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String }
});

const childSchema = new mongoose.Schema({
    temporaryId: { type: String, required: true, unique: true },
    name: { type: String, default: 'Unknown' },
    age: { type: Number },
    photoUrl: { type: String, default: '/default-child.jpg' },
    
    currentStatus: { 
        type: String, 
        enum: ['Rescued', 'Recovering', 'Verified', 'Family Matched', 'Reintegrated'], 
        default: 'Rescued' 
    },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    
    assignedShelter: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelter' },
    assignedOfficer: { type: String },

    wellness: {
        physicalHealth: { type: String, enum: ['Critical', 'Poor', 'Stable', 'Good', 'Excellent'], default: 'Stable' },
        mentalHealth: { type: String, enum: ['Critical', 'Poor', 'Stable', 'Good', 'Excellent'], default: 'Stable' },
        nutrition: { type: String, enum: ['Severe Malnutrition', 'Underweight', 'Normal'], default: 'Underweight' },
        education: { type: String, enum: ['None', 'Basic', 'Enrolled'], default: 'None' },
        socialDevelopment: { type: String, enum: ['Withdrawn', 'Improving', 'Active'], default: 'Withdrawn' }
    },

    statusFlags: {
        identityStatus: { type: String, enum: ['Pending', 'In Progress', 'Verified'], default: 'Pending' },
        healthStatus: { type: String, enum: ['Pending', 'Clearance Received', 'Needs Attention'], default: 'Pending' },
        counsellingStatus: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
        familySearchStatus: { type: String, enum: ['Not Started', 'Searching', 'Matches Found', 'Verified'], default: 'Not Started' }
    },

    timeline: [journeyEventSchema]
}, { timestamps: true });

module.exports = mongoose.model('Child', childSchema);
