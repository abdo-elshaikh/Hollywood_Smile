const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Import Routes
const userRoutes = require('../routes/userRoutes');
const fileRoutes = require('../routes/fileRoutes');
const bookingRoutes = require('../routes/bookingRoutes');
const offersRoutes = require('../routes/offersRoutes');
const servicesRoutes = require('../routes/servicesRoutes');
const doctorsRoutes = require('../routes/doctorsRoutes');
const clinicRoutes = require('../routes/clinicRoutes');
const testimonyRoutes = require('../routes/testimonyRoutes');
const faqRoutes = require('../routes/faqRoutes');
const messageRoutes = require('../routes/messageRoutes');
const subscribeRoutes = require('../routes/subscribeRoutes');
const blogRoutes = require('../routes/blogRoutes');
const commentRoutes = require('../routes/commentRoutes');
const galleryRoutes = require('../routes/galleryRoutes');
const beforeAfterRoutes = require('../routes/beforeAfterRoutes');
const notificationRoutes = require('../routes/notificationRoutes');
const authRoutes = require('../routes/authRoutes');
const themeRoutes = require('../routes/ThemeRoutes');
const smsRoutes = require('../routes/smsRoutes');

// Import Middlewares
const error = require('../middlewares/errorMiddleware');

// Database Connection
const connectDB = require('../config/db');

// Initialize Express App
const app = express();

// Load Environment Variables
dotenv.config();

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGINS?.split(',');
app.use(cors({
    origin: allowedOrigins || '*',
    credentials: true,
}));

connectDB().catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
});

// Middleware for Parsing JSON and URL Encoded Data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting Middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
});


app.use(limiter);

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));

// trust first proxy
app.set('trust proxy', 1);

// Default Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the API',
        version: '1.0.0',
        description: 'A RESTful API for a clinic management system',
        environment: process.env.NODE_ENV,
    });
});

// Define Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/files', fileRoutes);
app.use('/bookings', bookingRoutes);
app.use('/offers', offersRoutes);
app.use('/services', servicesRoutes);
app.use('/doctors', doctorsRoutes);
app.use('/clinics', clinicRoutes);
app.use('/testimonials', testimonyRoutes);
app.use('/faqs', faqRoutes);
app.use('/messages', messageRoutes);
app.use('/subscribers', subscribeRoutes);
app.use('/blogs', blogRoutes);
app.use('/comments', commentRoutes);
app.use('/gallery', galleryRoutes);
app.use('/before-after', beforeAfterRoutes);
app.use('/notifications', notificationRoutes);
app.use('/theme', themeRoutes);
app.use('/sms', smsRoutes);

// CORS Configuration
// app.options('*', cors());

//Caching headers
app.use((req, res, next) => {
    res.set('Cache-Control', 'public, max-age=31557600');
    next();
});

// Error Handling Middleware
app.use(error.notFound);
app.use(error.errorHandler);

// Export the App Module
module.exports = app;
