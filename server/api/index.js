const Express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('../config/db');
// const logger = require('../utils/logger');

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
const themeSettingsRoutes = require('../routes/themeSettingsRoutes');
const authRoutes = require('../routes/authRoutes');

// Import Middlewares
const { notFound, errorHandler } = require('../middlewares/errorMiddleware');

// Initialize the Express app
const app = Express();

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(Express.urlencoded({ extended: true }));

// Serve static files
app.use(Express.static(path.join(__dirname, '../public')));
app.use('/uploads', Express.static(path.join(__dirname, '../uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json({ message: err.message });
    } else {
        next();
    }
});

// Routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/files', fileRoutes);
app.use('/bookings', bookingRoutes);
app.use('/offers', offersRoutes);
app.use('/services', servicesRoutes);
app.use('/doctors', doctorsRoutes);
app.use('/clinics', clinicRoutes);
app.use('/testimonies', testimonyRoutes);
app.use('/faqs', faqRoutes);
app.use('/messages', messageRoutes);
app.use('/subscribers', subscribeRoutes);
app.use('/blogs', blogRoutes);
app.use('/comments', commentRoutes);
app.use('/galleries', galleryRoutes);
app.use('/before-after', beforeAfterRoutes);
app.use('/notifications', notificationRoutes);
app.use('/theme-settings', themeSettingsRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = (req, res) => {
    app(req, res);
};
