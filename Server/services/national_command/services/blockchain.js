const crypto = require('crypto');
const mongoose = require('mongoose');

const auditBlockSchema = new mongoose.Schema({
    index: { type: Number, required: true, unique: true },
    timestamp: { type: Date, required: true, default: Date.now },
    data: { type: Object, required: true },
    previousHash: { type: String, required: true },
    hash: { type: String, required: true }
});

const AuditBlock = mongoose.model('AuditBlock', auditBlockSchema);

const generateHash = (index, timestamp, data, previousHash) => {
    return crypto.createHash('sha256').update(`${index}${timestamp}${JSON.stringify(data)}${previousHash}`).digest('hex');
};

const addBlock = async (eventData) => {
    const lastBlock = await AuditBlock.findOne().sort({ index: -1 });
    
    const index = lastBlock ? lastBlock.index + 1 : 0;
    const timestamp = new Date();
    const previousHash = lastBlock ? lastBlock.hash : "0";
    const hash = generateHash(index, timestamp, eventData, previousHash);
    
    const newBlock = new AuditBlock({ index, timestamp, data: eventData, previousHash, hash });
    
    await newBlock.save();
    return newBlock;
};

const verifyChain = async () => {
    const chain = await AuditBlock.find().sort({ index: 1 });
    for (let i = 1; i < chain.length; i++) {
        const currentBlock = chain[i];
        const previousBlock = chain[i - 1];
        
        const recalculatedHash = generateHash(currentBlock.index, currentBlock.timestamp, currentBlock.data, currentBlock.previousHash);
        
        if (currentBlock.hash !== recalculatedHash || currentBlock.previousHash !== previousBlock.hash) return false;
    }
    return true;
};

module.exports = { addBlock, verifyChain, AuditBlock };
