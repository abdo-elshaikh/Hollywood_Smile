const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Define log directory dynamically based on environment
const logDirectory = process.env.NODE_ENV === 'production' 
    ? '/tmp/logs' // Use temporary directory for serverless environments
    : path.join(__dirname, '..', 'logs'); // Default to local logs directory

// Ensure the log directory exists (only for non-production environments)
if (process.env.NODE_ENV !== 'production') {
    try {
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
        }
    } catch (err) {
        console.error(`Failed to create log directory: ${err.message}`);
    }
}

// Create the logger instance
const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info', // Default log level
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamps
        format.errors({ stack: true }), // Include stack traces for errors
        format.splat(), // Enable string interpolation
        format.json() // Output logs in JSON format
    ),
    defaultMeta: { service: process.env.APP_NAME || 'default-service' }, // Set service name
    transports: [
        // Log errors to a separate file
        new transports.File({
            filename: path.join(logDirectory, 'error.log'),
            level: 'error',
            maxsize: 5 * 1024 * 1024, // 5MB per log file
            maxFiles: 5, // Keep up to 5 rotated files
        }),
        // Log all levels to a combined log file
        new transports.File({
            filename: path.join(logDirectory, 'combined.log'),
            maxsize: 10 * 1024 * 1024, // 10MB per log file
            maxFiles: 10, // Keep up to 10 rotated files
        }),
    ],
});

// Add console transport for development and production
logger.add(
    new transports.Console({
        format: process.env.NODE_ENV === 'development' 
            ? format.combine(
                format.colorize(), // Colorize logs for better readability
                format.printf(({ timestamp, level, message, stack }) =>
                    `${timestamp} [${level}]: ${stack || message}`
                )
            )
            : format.combine(
                format.printf(({ timestamp, level, message, stack }) =>
                    `${timestamp} [${level}]: ${stack || message}`
                )
            ),
    })
);

// Log a startup message
logger.info('Logger initialized and ready to use.');

module.exports = logger;
