// server.js
const express = require('express');
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
const app = express();

// cors options
const corsOptions = {
    origin: config.CORS_ORIGIN,
    credentials: true,
};

// // Serve the React build folder
// if (process.env.NODE_ENV === 'production') {
//     const buildPath = path.join(__dirname, 'client/dist');
//     app.use(express.static(buildPath));

//     app.get('*', (req, res) => {
//         res.sendFile(path.join(buildPath, 'index.html'));
//     });
// } else {
//     app.get('/', (req, res) => {
//         res.send('API is running....');
//     });
// }

// Middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 60000 },
    })
);

// Passport.js for authentication
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
// Serve uploads directory as static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Call the database connection function
connectDB();
// Seed the admin user
seedAdmin();

// Custom Api routes
app.get('/', (req, res) => {
    res.send('API Server is running....');
});
app.use('/api/files', fileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/clinic', clinicRoutes);
app.use('/api/testimonials', testimonyRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/theme-settings', themeSettingsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/before-after', beforeAfterRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = config.port || 5000;
app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} ...`);
});
