/**
 * ==========================================================
 * File        : jwt.js
 * Author      : Aravindh Ram
 * Created On  : 01-Aug-2025
 * Description : Handles JWT token creation and checking
 * ==========================================================
 */



// jwt.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256';

// Calculate seconds until end of day
function getExpiryInSeconds() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(23, 59, 59, 999);
  const timeLeftMs = midnight.getTime() - now.getTime();
  return Math.floor(timeLeftMs / 1000); // convert to seconds
}

// Generate token
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: getExpiryInSeconds(),
  });
}

// Verify token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] });
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
