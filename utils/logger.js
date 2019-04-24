const winston = require('winston');

const options = {
  console: {
    colorize: true,
    handleExceptions: true,
    json: false,
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  },
  file: {
    colorize: false,
    filename: 'logs/debug.log',
    handleExceptions: true,
    json: true,
    level: 'info',
    maxFiles: 5,
    maxsize: 5242880, // 5MB
  },
};

const stream = {
  write: message => {
    logger.info(message);
  },
};

const logger = winston.createLogger({
  exitOnError: false, // do not exit on handled exceptions
  transports: [new winston.transports.Console(options.console), new winston.transports.File(options.file)],
});

module.exports = logger;
