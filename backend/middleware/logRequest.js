/**
 * ==========================================================
 * File        : logRequest.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Middleware to log HTTP requests
 * ==========================================================
 */
const { writeLog } = require('../utils/logger');
const chalk = require('chalk');

// Middleware to log HTTP requests
const logRequest = (req, res, next) => {
  const startTime = new Date();

  // Listen for the finish event on the response to log when it's done
  res.on('finish', () => {
    const timestamp = startTime.toISOString();
    const statusCode = res.statusCode;
    const method = req.method;
    const url = req.originalUrl;

    let coloredStatus;
    if (statusCode >= 500) {
      coloredStatus = chalk.red(statusCode);
    } else if (statusCode >= 400) {
      coloredStatus = chalk.yellow(statusCode);
    } else if (statusCode >= 200) {
      coloredStatus = chalk.green(statusCode);
    } else {
      coloredStatus = chalk.white(statusCode);
    }

    const logMessage = `[${timestamp}] ${method} ${url} ${statusCode}`;
    const consoleMessage = `[${timestamp}] ${method} ${url} ${coloredStatus}`;

    console.log(consoleMessage);
    writeLog(logMessage);
  });

  next();
};

module.exports = logRequest;
