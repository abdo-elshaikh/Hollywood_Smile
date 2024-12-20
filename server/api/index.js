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

// Serve uploads folder
app.use('/uploads', Express.static(path.join(__dirname, '../uploads')));

// Serve static files in production
// if (process.env.NODE_ENV === 'production') {
//     app.use(Express.static(path.join(__dirname, '../client/dist')));
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, '../client/dist/index.html'));
//     });
// }

// Routes
app.get('/', (req, res) => {
    res.status(200).json(
        {
            message: 'Welcome to the API of the Hollywood Smile Server App',
            status: 'success',
            data: {
                name: 'Hollywood Smile',
                description: 'Hollywood Smile is a dental clinic that offers a variety of dental services, including teeth whitening, dental implants, and more. We are located in the heart of Dubai, UAE, and have been providing quality dental care to our patients for over 10 years. Our team of experienced dentists and dental hygienists are committed to providing the highest level of care to our patients, and we strive to create a warm and welcoming environment for everyone who walks through our doors. Whether you are in need of a routine dental cleaning or a more complex dental procedure, we are here to help you achieve the smile of your dreams.',
                location: 'Dubai, UAE',
                phone: '+971 4 000 0000',
                email: '',
                website: 'https://www.hollywoodsmile.com',
                socials: {
                    facebook: 'https://www.facebook.com/hollywoodsmile',
                    instagram: 'https://www.instagram.com/hollywoodsmile',
                    twitter: 'https://www.twitter.com/hollywoodsmile',
                    linkedin: 'https://www.linkedin.com/hollywoodsmile',
                },
                services: [
                    {
                        name: 'Teeth Whitening',
                        description: 'Teeth whitening is a cosmetic dental procedure that helps to lighten teeth and remove stains and discoloration. It is one of the most popular cosmetic dental procedures because it can greatly improve how your teeth look. Most dentists perform teeth whitening.',
                        image: 'https://via.placeholder.com/150',
                    },
                    {
                        name: 'Dental Implants',
                        description: 'Dental implants are artificial tooth roots that provide a permanent base for fixed, replacement teeth. Compared to dentures, bridges and crowns, dental implants are a popular and effective long-term solution for people who suffer from missing teeth, failing teeth or chronic dental problems.',
                        image: 'https://via.placeholder.com/150',
                    },
                    {
                        name: 'Veneers',
                        description: 'Veneers are thin shells of porcelain or composite resin that are custom made to fit over teeth, providing a natural, attractive look. They can be used to fix chipped, stained, misaligned, worn down, uneven or abnormally spaced teeth.',
                        image: 'https://via.placeholder.com/150',
                    },
                    {
                        name: 'Invisalign',
                        description: 'Invisalign is a type of orthodontic treatment that helps to straighten teeth without the use of the typical metal braces. Invisalign has quickly revolutionized the orthodontics world. Now patients have a different option besides ugly metal brackets.',
                        image: 'https://via.placeholder.com/150',
                    },
                    {
                        name: 'Dental Crowns',
                        description: 'A dental crown is a tooth-shaped "cap" that is placed over a tooth -- to cover the tooth to restore its shape and size, strength, and improve its appearance. The crowns, when cemented into place, fully encase the entire visible portion of a tooth that lies at and above the gum line.',
                        image: 'https://via.placeholder.com/150',
                    },
                    {
                        name: 'Dental Bridges',
                        description: 'A dental bridge is a fixed dental restoration used to replace one or more missing teeth by joining an artificial tooth definitively to adjacent teeth or dental implants.',
                        image: 'https://via.placeholder.com/150',
                    },
                ],
            },
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

module.exports = (req, res) => {
    app(req, res);
};
