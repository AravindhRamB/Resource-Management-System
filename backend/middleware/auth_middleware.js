/**
 * ==========================================================
 * File        : auth_middleware.js
 * Author      : Aravindh Ram
 * Created On  : 01-Aug-2025
 * Description : Middleware to verify JWT tokens
 * ==========================================================
 */

const { verifyToken } = require('../utils/jwt');
const response = require('../utils/resposne_module');
const { writeLog } = require('../utils/logger');

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  try {
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

    console.log(token);

    const decoded = verifyToken(token);
    console.log(decoded, "decode");
    
    if (!decoded) {
      return response.responseInvalidToken(res);
    }

    req.user = decoded;
    next();
  } catch (err) {
    writeLog(`Auth middleware error: ${err.message}`, "error");
    return response.responseInvalidToken(res);
  }
}

module.exports = authenticateToken;
