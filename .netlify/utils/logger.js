const winston = require('winston');

const logger = winston.createLogger({
    level: 'debug', // Set the minimum level of messages to log
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Log to the console
        new winston.transports.File({ filename: 'combined.log' }) // Log to a file
    ],
});

module.exports = {
    logger
}
