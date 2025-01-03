const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// JSON parser middleware
app.use(express.json());

// Connect to MongoDB
connectDB().catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
});

// Import routes
const routes = require('./api/index');
app.use('/api', routes);

// Default route handler
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Hollywood Smile Services',
    });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

    
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Server Error',
    });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    const mode = process.env.NODE_ENV || 'development';
    console.log(`Server running in ${mode} mode on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('SIGINT received. Closing server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

module.exports = app;
