/**
 * ==========================================================
 * File        : verifyToken.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Middleware to verify JWT tokens
 * ==========================================================
 */
const { verifyToken } = require('../utils/jwt');
const response = require('../utils/resposne_module');
const { writeLog } = require('../utils/logger');

// Middleware to verify JWT token
module.exports = function (req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return response.responseInvalidToken(res);
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return response.responseInvalidToken(res);
    }

    const token = parts[1];

    if (!token) {
      return response.responseInvalidToken(res);
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return response.responseInvalidToken(res);
    }

    req.user = decoded; // Attach decoded token payload to request
    next(); // Pass control to next middleware/controller
  } catch (err) {
    writeLog(`Token verification error: ${err.message}`, "error");
    return response.responseInvalidToken(res);
  }
};
