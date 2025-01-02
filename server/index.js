const Express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();
const app = Express();

// Connect to MongoDB
connectDB().catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
});

const routers = require('./api/index');

app.use('/', routers);

// Serve React build files
if (process.env.NODE_ENV === 'production') {
    app.use(Express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
        console.log('Serving React build files');
    });
}

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    const mode = process.env.NODE_ENV || 'development';
    console.log(`Server running in ${mode} mode on port ${PORT}`);
});

module.exports = app;
