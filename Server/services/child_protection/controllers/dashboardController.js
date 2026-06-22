const Child = require('../models/Child');
const FamilyMatch = require('../models/FamilyMatch');
const Shelter = require('../models/Shelter');

exports.getDashboardData = async (req, res) => {
    try {
        const totalChildren = await Child.countDocuments();
        const newRescues = await Child.countDocuments({ currentStatus: 'Rescued' });
        const familyMatches = await FamilyMatch.countDocuments({ 'candidates.verificationStatus': 'Verified' });
        
        // Count medical cases where healthStatus is 'Needs Attention'
        const medicalCases = await Child.countDocuments({ 'statusFlags.healthStatus': 'Needs Attention' });

        const reintegrated = await Child.countDocuments({ currentStatus: 'Reintegrated' });
        const successRate = totalChildren > 0 ? ((reintegrated / totalChildren) * 100).toFixed(1) : 0;
        
        const urgentAttentionCases = await Child.countDocuments({ riskLevel: 'Critical' });

        // Recovery Pipeline / Landscape
        const pipelineCounts = await Child.aggregate([
            { $group: { _id: "$currentStatus", count: { $sum: 1 } } }
        ]);

        const pipeline = {
            Rescued: 0, Recovering: 0, Verified: 0, 'Family Matched': 0, Reintegrated: 0
        };

        pipelineCounts.forEach(status => {
            if(pipeline[status._id] !== undefined) {
                pipeline[status._id] = status.count;
            }
        });

        // Daily Recovery Brief (Mocked for current day metrics, typically you'd query today's date)
        const dailyBrief = {
            rehabilitated: await Child.countDocuments({ currentStatus: 'Reintegrated', updatedAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } }),
            familyMatchesFound: await FamilyMatch.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } }),
            medicalEscalations: await Child.countDocuments({ 'statusFlags.healthStatus': 'Needs Attention', updatedAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } }),
            counsellingSessionsScheduled: await Child.countDocuments({ 'statusFlags.counsellingStatus': 'In Progress' })
        };

        res.json({
            topRecoveryBar: {
                totalChildren,
                newRescues,
                familyMatches,
                medicalCases,
                reintegrationSuccessRate: `${successRate}%`,
                urgentAttentionCases
            },
            recoveryLandscape: pipeline,
            dailyBrief
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
