const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');
const config = require('./config');

// Define log directory, defaulting to /tmp in serverless environments
const logDirectory = process.env.NODE_ENV === 'production' ? '/tmp/logs' : path.join(__dirname, '..', 'logs');

// Ensure the log directory exists (for non-serverless environments)
if (process.env.NODE_ENV !== 'production' && !fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// Create a logger instance
const logger = createLogger({
    level: config.LOG_LEVEL || 'info', // Default to 'info' level, configurable via .env
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Readable timestamps
        format.errors({ stack: true }), // Capture stack traces
        format.splat(), // Support string interpolation
        format.json() // Log in JSON format
    ),
    defaultMeta: { service: config.APP_NAME || 'hollywood-smile-service' }, // Service name from config
    transports: [
        // Write error logs to a file
        new transports.File({
            filename: path.join(logDirectory, 'error.log'),
            level: 'error',
            maxsize: 5 * 1024 * 1024, // 5MB file size limit
            maxFiles: 5, // Rotate logs after 5 files
        }),
        // Write all logs to a combined log file
        new transports.File({
            filename: path.join(logDirectory, 'combined.log'),
            maxsize: 10 * 1024 * 1024, // 10MB file size limit
            maxFiles: 10, // Rotate logs after 10 files
        }),
    ],
});

// Add console transport for development
if (config.NODE_ENV === 'development') {
    logger.add(
        new transports.Console({
            format: format.combine(
                format.colorize(), // Add color to log levels
                format.printf(
                    ({ timestamp, level, message, stack }) =>
                        `${timestamp} [${level}]: ${stack || message}` // Readable log messages
                )
            ),
        })
    );
} else {
    // Console logging for production without colors
    logger.add(
        new transports.Console({
            format: format.combine(
                format.printf(
                    ({ timestamp, level, message, stack }) =>
                        `${timestamp} [${level}]: ${stack || message}`
                )
            ),
        })
    );
}

// Log startup message
logger.info('Logger initialized and ready to use.');

module.exports = logger;
