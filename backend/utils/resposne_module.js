/**
 * ==========================================================
 * File        : resposne_module.js
 * Author      : Aravindh Ram
 * Created On  : 01-Aug-2025
 * Description : This file contains the responses of modules
 * ==========================================================
 */

const STATUS = require("../constants/status_code");
const { writeLog } = require("./logger");

// 200 OK
const responseSuccess = (res, data) => {
  return res.status(STATUS.HTTP_200_OK).json(data);
};

//201 Created
const responseCreated = (res, data) => {
  return res.status(STATUS.HTTP_201_CREATED).json(data || { message: "Resource created successfully" });
};

// 400 Bad Request
const responseParamMissing = (res) => {
  return res.status(STATUS.HTTP_400_BAD_REQUEST).json({ Message: "Required parameters are missing or invalid" });
};

const responseParamMissingMessage = (res, message) => {
  const msg = typeof message === 'string' ? message : (message?.message || message?.error || "Required parameters are missing or invalid");
  return res.status(STATUS.HTTP_400_BAD_REQUEST).json({ Message: msg });
};

// 400 Bad Request - Generic
const responseBadRequest = (res, message) => {
  const msg = typeof message === 'string' ? message : (message?.message || message?.error || "Bad Request");
  return res.status(STATUS.HTTP_400_BAD_REQUEST).json({ Message: msg });
};

// 401 Unauthorized
const responseUnauthorized = (res, err) => {
  const msg = typeof err === 'string' ? err : (err?.message || err?.error || "Unauthorized: Invalid username or password");
  return res.status(STATUS.HTTP_401_UNAUTHORIZED).json({ Message: msg });
};

const responseInvalidToken = (res) => {
  return res.status(STATUS.HTTP_401_UNAUTHORIZED).json({ Message: "Token is invalid or expired. Login again" });
};

//403 Forbidden
const responseForbidden = (res, message) => {
  const msg = typeof message === 'string' ? message : (message?.message || message?.error || "Forbidden");
  return res.status(STATUS.HTTP_403_FORBIDDEN).json({ Message: msg });
};

// 404 Not Found
const responseNotFound = (res, message) => {
  const msg = typeof message === 'string' ? message : (message?.message || "Resource not found");
  return res.status(STATUS.HTTP_404_NOT_FOUND).json({ Message: msg });
};

// 405 Method Not Allowed
const responseWrongMethod = (res) => {
  return res.status(STATUS.HTTP_405_METHOD_NOT_ALLOWED).json({ Message: "Request Method Not Allowed" });
};

// 409 Conflict
const responseConflict = (res, kind) => {
  const msg = typeof kind === 'string' ? kind : (kind?.message || "Unable to process request");
  return res.status(STATUS.HTTP_409_CONFLICT).json({ Message: msg });
};

// 424 Failed Dependency
const responseFailedDependency = (res, err) => {
  const msg = typeof err === 'string' ? err : (err?.message || err?.error || "Failed Dependency");
  return res.status(STATUS.HTTP_424_FAILED_DEPENDENCY).json({ Message: msg });
};

// Helper to format database errors
const formatDbError = (err) => {
  if (err?.code) {
    // PostgreSQL error codes
    if (err.code === '23505') return { message: "Duplicate entry: Resource already exists", code: err.code };
    if (err.code === '23503') return { message: "Foreign key constraint violation", code: err.code };
    if (err.code === '23502') return { message: "Not null constraint violation", code: err.code };
    if (err.code === '42P01') return { message: "Database table does not exist", code: err.code };
    if (err.code === '42703') return { message: "Database column does not exist", code: err.code };
  }
  return { message: err?.message || String(err), code: err?.code || 'UNKNOWN' };
};

// 500 Internal Server Error
const responseException = (res, err, context = '') => {
  const errorMessage = err?.message || String(err);
  const logMessage = context ? `[${context}] ${errorMessage}` : errorMessage;
  writeLog(logMessage, "error");
  
  // Check if it's a database error
  if (err?.code || err?.name === 'QueryError' || err?.name === 'DatabaseError') {
    const dbError = formatDbError(err);
    return res.status(STATUS.HTTP_500_INTERNAL_SERVER_ERROR).json({ 
      Message: "Database error occurred. Please contact support.",
      error: dbError.message 
    });
  }
  
  return res.status(STATUS.HTTP_500_INTERNAL_SERVER_ERROR).json({ 
    Message: "Internal Server Error",
    error: errorMessage 
  });
};

const responseNoDbConn = (res) => {
  writeLog("Error while connecting to Database", "error");
  return res.status(STATUS.HTTP_500_INTERNAL_SERVER_ERROR).json({ Message: "Internal Server Error: Database connection failed" });
};

module.exports = {
  responseSuccess,
  responseCreated,
  responseParamMissing,
  responseParamMissingMessage,
  responseBadRequest,
  responseUnauthorized,
  responseInvalidToken,
  responseForbidden,
  responseNotFound,
  responseWrongMethod,
  responseConflict,
  responseFailedDependency,
  responseException,
  responseNoDbConn,
  formatDbError,
};
