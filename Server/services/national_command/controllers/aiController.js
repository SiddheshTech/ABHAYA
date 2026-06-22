const AIModel = require('../models/AIModel');
const Prediction = require('../models/Prediction');

exports.getAIHealth = async (req, res) => {
    try {
        const models = await AIModel.find();
        res.json(models);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPredictions = async (req, res) => {
    try {
        const predictions = await Prediction.find();
        res.json(predictions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
