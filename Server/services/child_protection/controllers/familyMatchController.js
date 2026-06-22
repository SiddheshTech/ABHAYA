const FamilyMatch = require('../models/FamilyMatch');
const Child = require('../models/Child');

exports.getFamilyMatchesByChild = async (req, res) => {
    try {
        const matchRecord = await FamilyMatch.findOne({ childId: req.params.childId }).populate('childId', 'name temporaryId age photoUrl');
        if (!matchRecord) return res.status(404).json({ message: 'No family match records found for this child' });
        
        res.json(matchRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createOrUpdateFamilyMatch = async (req, res) => {
    try {
        const { childId, candidates } = req.body;
        
        let matchRecord = await FamilyMatch.findOne({ childId });
        
        if (matchRecord) {
            matchRecord.candidates = candidates;
            await matchRecord.save();
        } else {
            matchRecord = new FamilyMatch({ childId, candidates });
            await matchRecord.save();
        }
        
        res.json(matchRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCandidateStatus = async (req, res) => {
    try {
        const { childId, candidateId } = req.params;
        const { verificationStatus, interviewStatus, approvalStage } = req.body;

        const matchRecord = await FamilyMatch.findOne({ childId });
        if (!matchRecord) return res.status(404).json({ message: 'Match record not found' });

        const candidate = matchRecord.candidates.id(candidateId);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

        if (verificationStatus) candidate.verificationStatus = verificationStatus;
        if (interviewStatus) candidate.interviewStatus = interviewStatus;
        if (approvalStage) candidate.approvalStage = approvalStage;

        await matchRecord.save();
        res.json(matchRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
