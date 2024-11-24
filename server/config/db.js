const mongoose = require('mongoose');
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
        console.log(`MongoDB connected: ${dbName}`);

        // Optionally seed the admin if the database connection is successful
        await seedAdmin();

    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
