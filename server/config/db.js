const mongoose = require('mongoose');
const config = require('../utils/config');
const seedAdmin = require('./seed');

const connectDB = async () => {
    const dbUri = config.mongodbUri;
    const dbName = config.dbName;

    console.log('Connecting to MongoDB...');
    try {
        // Connect to MongoDB
        await mongoose.connect(dbUri, { dbName });

        console.log(`MongoDB connected to ${dbName}`);

        // Seed the admin user if applicable
        try {
            await seedAdmin();
            console.log('Admin user seeded successfully');
        } catch (error) {
            console.error('Failed to seed admin user:', error.message);
        }
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit with failure if the connection fails
    }

    // Handle MongoDB disconnection
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });

    // Handle app termination signals
    process.on('SIGINT', async () => {
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
        } catch (error) {
            console.error('Error closing MongoDB connection:', error.message);
        } finally {
            process.exit(0);
        }
    });
};

module.exports = connectDB;
