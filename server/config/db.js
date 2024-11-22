const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('../utils/config');
const seedAdmin = require('./seed');

const dbUri = config.mongodbUri;
const dbName = config.dbName;

// Connect to MongoDB using the db name from the config
const connectDB = async () => {
    try {
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: dbName,
        });
        logger.info('MongoDB connected successfully');
        await seedAdmin();
    } catch (error) {
        logger.error('MongoDB connection failed:', error);
    }
};

module.exports = connectDB;
