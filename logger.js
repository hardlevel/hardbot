const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, json, errors, colorize } = format;

const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${message} ${stack}`;
});


const logger = winston.createLogger({
    // format: winston.format.combine(
    //     winston.format.errors({ stack: true }),
    //     winston.format.json()
    // ),
		format: combine(
			timestamp({
				format: 'DD-MM-YYYY hh:mm:ss.SSS'
			}),
			json(),
			myFormat,
			colorize(),
		),
		depth:true,
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
    ],
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;