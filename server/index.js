const Express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const app = Express();

const routers = require('./api/index');

app.use('/', routers);
app.use('/uploads', Express.static(path.join(__dirname, '../uploads')));

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
} else {
    app.use(Express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

module.exports = app;
