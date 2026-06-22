const crypto = require('crypto');
const Block = require('../models/Block');

class BlockchainService {
  /**
   * Generates a SHA-256 hash for a block.
   */
  static calculateHash(index, timestamp, data, previousHash) {
    return crypto
      .createHash('sha256')
      .update(index + timestamp + JSON.stringify(data) + previousHash)
      .digest('hex');
  }

  /**
   * Initializes the blockchain with a genesis block if it's empty.
   */
  static async initGenesisBlock() {
    const count = await Block.countDocuments();
    if (count === 0) {
      const genesisData = { message: "Genesis Block - Rakshak Ledger Started" };
      const timestamp = new Date().toISOString();
      const hash = this.calculateHash(0, timestamp, genesisData, "0");
      
      const genesisBlock = new Block({
        index: 0,
        timestamp,
        data: genesisData,
        previousHash: "0",
        hash
      });
      await genesisBlock.save();
      console.log("Genesis block created.");
    }
  }

  /**
   * Adds a new block to the chain.
   * Useful for logging Evidence uploads or critical Case timeline changes.
   */
  static async addBlock(data) {
    // Get the latest block
    const latestBlock = await Block.findOne().sort({ index: -1 });
    
    if (!latestBlock) {
      throw new Error("Blockchain not initialized. Call initGenesisBlock first.");
    }

    const newIndex = latestBlock.index + 1;
    const newTimestamp = new Date().toISOString();
    const newHash = this.calculateHash(newIndex, newTimestamp, data, latestBlock.hash);

    const newBlock = new Block({
      index: newIndex,
      timestamp: newTimestamp,
      data: data,
      previousHash: latestBlock.hash,
      hash: newHash
    });

    await newBlock.save();
    return newBlock;
  }

  /**
   * Verifies the integrity of the blockchain.
   */
  static async verifyChain() {
    const blocks = await Block.find().sort({ index: 1 });
    for (let i = 1; i < blocks.length; i++) {
      const currentBlock = blocks[i];
      const previousBlock = blocks[i - 1];

      // Check if previousHash matches the actual hash of the previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      // Check if the current hash is mathematically valid
      const recalculatedHash = this.calculateHash(
        currentBlock.index, 
        currentBlock.timestamp.toISOString(), 
        currentBlock.data, 
        currentBlock.previousHash
      );
      
      if (currentBlock.hash !== recalculatedHash) {
        return false;
      }
    }
    return true;
  }
}

module.exports = BlockchainService;
