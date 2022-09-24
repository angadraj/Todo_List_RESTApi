require('dotenv').config();
const { createLogger, format, transports } = require('winston');
const moment = require('moment');
let currentDate = moment(new Date()).format("DD-MM-YYYY");
const { combine, timestamp, label, printf, json } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message ? JSON.stringify(message) : message}`;
});

const myFormat_2 = printf((file_format) => {
  return `${file_format.timestamp} [${file_format.label}] ${file_format.level}: ${'messsage : '} ${file_format.message}  ${'Object : '}${file_format.level == "error" ? JSON.stringify(file_format) : file_format.message}`;
});

const logger = new createLogger({
  level: 'debug',
  format: combine(
    label({ label: process.env.NODE_ENV }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console(),
  ],
  exitOnError: false
});

if (process.env.NODE_ENV === 'production') {
  logger.add(new transports.File({
    filename: './logs/' + currentDate + '-production.log',
    format: combine(
      label({ label: process.env.NODE_ENV }),
      timestamp(),
      json(),
      myFormat_2
    ),
  }));
}

module.exports = logger;

module.exports.stream = {
  write: function (message, encoding) {
    logger.info(message);
  }
};