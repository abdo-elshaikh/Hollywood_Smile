const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
// const logger = require('./utils/logger');
const connectDB = require('./config/db'); // Your DB connection function
const { notFound, errorHandler } = require('./middlewares/errorMiddleware'); // Error handling middlewares

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for local or non-serverless environments)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

// Serve React app in production (for local environments)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // All other routes should serve the React app's index.html
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
    });
}

// Routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});

// Import routes
const routers = require('./api/index');
app.use('/api', routers);
// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server (only for local development)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        // logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

module.exports = app;
