const Shelter = require('../models/Shelter');

exports.getAllShelters = async (req, res) => {
    try {
        const shelters = await Shelter.find();
        res.json(shelters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getShelterById = async (req, res) => {
    try {
        const shelter = await Shelter.findById(req.params.id);
        if (!shelter) return res.status(404).json({ message: 'Shelter not found' });
        res.json(shelter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createShelter = async (req, res) => {
    try {
        const shelter = new Shelter(req.body);
        await shelter.save();
        res.status(201).json(shelter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateShelter = async (req, res) => {
    try {
        const shelter = await Shelter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!shelter) return res.status(404).json({ message: 'Shelter not found' });
        res.json(shelter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
