// config.js
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGO_Db || 'mongodb+srv://abdo202224:RdZjLTYmNuIQUhbs@hollywood.j2xm4.mongodb.net/?retryWrites=true&w=majority&appName=Hollywood&ssl=true' || 'mongodb://localhost:27017/hollywood_smile_web_server',
  dbName: process.env.DB_NAME || 'hollywood_smile_web_server',
  sessionSecret: process.env.SESSION_SECRET || 'your_secret_key',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  SESSION_SECRET: process.env.SESSION_SECRET || 'your_session_secret',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@mail.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin@123',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  NODE_ENV: process.env.NODE_ENV || 'client',
  APP_NAME: process.env.APP_NAME || 'Hollywood Smile',
  emailConfig: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-email-password',
  },
};
