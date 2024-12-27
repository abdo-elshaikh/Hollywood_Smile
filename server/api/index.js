const Express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('../config/db');
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

// Initialize the Express app
const app = Express();

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
});

const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
console.log('Allowed Origins:', allowedOrigins);

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
}));

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    app.use((req, res, next) => {
        if (req.secure) {
            next();
        } else {
            res.redirect(`https://${req.headers.host}${req.url}`);
        }
    });
}


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(Express.urlencoded({ extended: true }));

// Serve static files
app.use(Express.static(path.join(__dirname, '../public')));

// Serve uploads folder
app.use('/uploads', Express.static(path.join(__dirname, '../uploads')));


// Routes
app.get('/', (req, res) => {
    res.status(200).json(
        {
            message: 'Welcome to the API',
            version: '1.0.0',
        },
    );
});

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
