const mongoose = require('mongoose');
const config = require('../utils/config');
const seedAdmin = require('./seed');

const connectDB = async () => {
    const dbUri = config.mongodbUri;
    const dbName = config.dbName;
    console.log('Connecting to MongoDB...');
    try {
        await mongoose.connect(dbUri, {
            serverSelectionTimeoutMS: 5000, // Timeout for connection
            autoIndex: true, // Automatically create indexes
        });

        console.log(`MongoDB connected to ${config.dbName}`);

        // Optionally seed the admin
        try {
            await seedAdmin();
            console.log('Admin user seeded successfully');
        } catch (error) {
            console.error('Failed to seed admin user:', error.message);
        }
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }

    // Handle MongoDB disconnection and termination signals
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
};

module.exports = connectDB;
