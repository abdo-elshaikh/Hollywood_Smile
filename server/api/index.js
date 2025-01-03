const Express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
// const bodyParser = require('body-parser');
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
const { notFound, errorHandler } = require('../middlewares/errorMiddleware');

// connect to the database
const connectDB = require('../config/db');

connectDB().catch(function (err) {
    console.log('Error connecting to the database:', err);
});

// Initialize the Express app
const app = Express();

// Load environment variables
dotenv.config();

// Configure CORS
console.log('Allowed Origins:', process.env.CORS_ORIGIN);

// Configure CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
}));

// Middleware for logging
app.use(morgan('dev'));
// app.use(bodyParser.json());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests
});
app.use(limiter);

// Security middleware
app.use(helmet());

// Default route handler
app.get('/', async (req, res) => {
    res.json({
        message: 'Welcome to the API',
        version: '1.0.0',
        description: 'A RESTful API for a clinic management system',
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

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
