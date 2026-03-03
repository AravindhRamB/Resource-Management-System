/**
 * ==========================================================
 * File        : logger.js
 * Author      : Aravindh Ram
 * Created On  : 31-July-2025
 * Description : Handles creating logger and log dir
 * ==========================================================
 */

const fs = require('fs');
const path = require('path');
const constant = require('../constants/generals');

// Format: dd-mm-yyyy
const getCurrentDateString = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

// Ensure logs directory exists
const ensureLogDir = () => {
  const logDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  return logDir;
};

// Write to logs/dd-mm-yyyy.log
const writeLog = (message) => {
  const logDir = ensureLogDir();
  const currentDate = getCurrentDateString();
  const logFilePath = path.join(logDir, `${currentDate}.log`);

  const now = new Date().toLocaleString('en-GB', {
    timeZone: constant.DEFAULT_TZ,
    hour12: false,
  });

  const [date, time] = now.split(', ');
  const [day, month, year] = date.split('/');
  const formattedTimestamp = `[${year}-${month}-${day} ${time}]`;

  fs.appendFileSync(logFilePath, `${formattedTimestamp} ${message}\n`);
};

module.exports = { writeLog };
