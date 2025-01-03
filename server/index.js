const app = require('./api/index');


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} as ${process.env.NODE_ENV} mode`);
});

exports.app = app;