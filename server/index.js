const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

const routers = require('./api/index');

app.use('/', routers);

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

module.exports = app;
