const Child = require('../models/Child');
const { addBlock } = require('../services/blockchain');

exports.getAllChildren = async (req, res) => {
    try {
        const children = await Child.find().populate('assignedShelter');
        res.json(children);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getChildById = async (req, res) => {
    try {
        const child = await Child.findById(req.params.id).populate('assignedShelter');
        if (!child) return res.status(404).json({ message: 'Child not found' });
        res.json(child);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createChild = async (req, res) => {
    try {
        const child = new Child(req.body);
        
        // Add genesis event
        child.timeline.push({ stage: 'Rescued', notes: 'Initial Rescue recorded.' });
        await child.save();

        // Create a blockchain log for immutable record
        await addBlock({ eventType: 'CHILD_REGISTERED', childId: child._id, temporaryId: child.temporaryId, timestamp: new Date() });

        res.status(201).json(child);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateChildStatus = async (req, res) => {
    try {
        const { currentStatus, wellness, statusFlags, eventNotes } = req.body;
        const child = await Child.findById(req.params.id);
        if (!child) return res.status(404).json({ message: 'Child not found' });

        if (currentStatus) child.currentStatus = currentStatus;
        if (wellness) child.wellness = { ...child.wellness, ...wellness };
        if (statusFlags) child.statusFlags = { ...child.statusFlags, ...statusFlags };

        // Define mapping for statuses to timeline stages if needed
        const stageMapping = {
            'Recovering': 'Sheltered',
            'Verified': 'Medical Check',
            'Family Matched': 'Family Search',
            'Reintegrated': 'Reintegration'
        };

        if (currentStatus && stageMapping[currentStatus]) {
            child.timeline.push({ stage: stageMapping[currentStatus], notes: eventNotes || `Status updated to ${currentStatus}` });
        }

        await child.save();

        // Log to blockchain
        await addBlock({ eventType: 'STATUS_UPDATE', childId: child._id, status: currentStatus, timestamp: new Date() });

        res.json(child);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
