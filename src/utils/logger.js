const winston = require('winston');
const { format } = require('winston');
const appRoot = require('app-root-path');
const env = process.env.NODE_ENV

/**
 * 
 * @returns 
 * @see https://www.codegrepper.com/code-examples/javascript/frameworks/dist/TypeError%3A+Converting+circular+structure+to+JSON
 */
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};


const printf = (info) => {
  if (typeof info.message === 'object') {
    // eslint-disable-next-line no-param-reassign
    info.message = JSON.stringify(info.message, getCircularReplacer(), 3);
  }
  return `[${info.timestamp}] ${info.level}:: ${info.message}`;
};

const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    stderrLevels: ['error'],
    format: format.combine(
      format.prettyPrint(),
      format.splat(),
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(printf)
      // format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
    ),
  },
  file: {
    level: 'debug',
    filename: `${appRoot}/logs/${new Date().toISOString().slice(0, 10)}.log`, // Date=YYYY-MM-DD
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 30,
    colorize: false,
    format: format.combine(
      format.prettyPrint(),
      format.splat(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(printf),
    ),
  },
  fresh: {
    level: 'debug',
    filename: `${appRoot}/logs/fresh.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 30,
    colorize: false,
    format: format.combine(
      format.prettyPrint(),
      format.splat(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(printf),
    ),
    options: { flags: 'w' } // Disable appending clean every log
  },
  html: {
    level: 'info',
    filename: `${appRoot}/logs/${new Date().toISOString().slice(0, 10)}.html`, // Date=YYYY-MM-DD
    handleExceptions: false,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 365,
    colorize: false,
    format: format.combine(
      // format.prettyPrint(),
      format.splat(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf((info) => info.message),
    ),
    options: { flags: 'w' } // Disable appending clean every log
  },
};

const logger = winston.createLogger({
  level: env === 'development' ? 'debug' : 'info',
  transports: [
    new winston.transports.Console(options.console),
    new winston.transports.File(options.fresh),
    new winston.transports.File(options.file),
  ],
});

// const htmlLog = winston.createLogger({
//   level: env === 'development' ? 'debug' : 'info',
//   transports: [
//     new winston.transports.File(options.html)
//   ],
// });

module.exports = logger;
// module.exports.htmlLog = htmlLog;
// module.exports.mailLog = mailLog;

/// Usage example
// logger.info('Log: info');
// logger.warn('Log: warn');
// logger.debug('Log: debug');
// logger.error('Log: error');
// logger.htmlLog.info("htmlLog test")