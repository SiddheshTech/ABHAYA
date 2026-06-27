const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/community_watch';
        
        // Spin up an in-memory DB if no real mongo is available
        const mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
        
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected (Memory Server): ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
