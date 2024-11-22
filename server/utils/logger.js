const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Define log directory dynamically based on environment
const logDirectory = process.env.LOG_DIR || '/var/logs';

// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

const transportsArray = [];
// Disable File Logging for Serverless
if (process.env.NODE_ENV !== 'production') {
    // Add file transport for local development
    transportsArray.push(
        new transports.File({
            filename: path.join(logDirectory, 'error.log'),
            level: 'error',
        }),
        new transports.File({
            filename: path.join(logDirectory, 'combined.log'),
        })
    );
}

// Add console transport for all environments
transportsArray.push(new transports.Console({
    format: format.combine(
        format.colorize(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
}));

// Create a logger instance
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: process.env.SERVICE_NAME || 'express-app' },
    transports: transportsArray,
});

module.exports = logger;
