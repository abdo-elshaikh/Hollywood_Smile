// server.js
const Express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const seedAdmin = require('./config/seed');
const logger = require('./utils/logger');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const config = require('./utils/config');

// Import custom routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const offersRoutes = require('./routes/offersRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const doctorsRoutes = require('./routes/doctorsRoutes');
const clinicRoutes = require('./routes/clinicRoutes');
const testimonyRoutes = require('./routes/testimonyRoutes');
const faqRoutes = require('./routes/faqRoutes');
const messageRoutes = require('./routes/messageRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const themeSettingsRoutes = require('./routes/themeSettingsRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const beforeAfterRoutes = require('./routes/beforeAfterRoutes');


// Initialize Express app
const app = Express();

// Middlewares for parsing requests
app.use(cors({
    origin: config.CORS_ORIGIN || '*',
    credentials: true,
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: new session.MemoryStore(),
        cookie: { maxAge: 60000, secure: process.env.NODE_ENV === 'production' },
    })
);

// Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// Serve static files
app.use(Express.static(path.join(__dirname, 'public')));
// Serve uploads directory as static folder
app.use('/uploads', Express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
(async () => {
    try {
        await connectDB();
        // Seed the admin user
        await seedAdmin();
        logger.info('completed seeding admin user with MongoDB');
    } catch (error) {
        logger.error(`Error connecting to MongoDB: ${error.message}`);
    }
})


// Handle API routes or other server-side logic here
app.get('/', (req, res) => {
    return res.json({ message: 'Welcome to the API server running on port 5001' });
});

// api routes should be here
app.get('/api', (req, res) => {
    return res.json({ message: 'API is running...' });
});

// Use custom routes with serverless routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/testimonies', testimonyRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/subscribes', subscribeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/theme-settings', themeSettingsRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/before-after', beforeAfterRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../client/dist');
    app.use(Express.static(clientBuildPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});

// Handle SIGINT signal
process.on('SIGINT', () => {
    logger.info('SIGINT signal received.');
    process.exit(0);
});


// Start the server
const PORT = config.port || 5000;
app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} ...`);
});
