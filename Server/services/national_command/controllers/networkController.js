const Network = require('../models/Network');

exports.getNetworks = async (req, res) => {
    try {
        const networks = await Network.find();
        res.json(networks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
