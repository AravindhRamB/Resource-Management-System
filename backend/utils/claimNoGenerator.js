/**
 * ==========================================================
 * File        : claimNoGenerator.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Utility to generate unique claim numbers
 * ==========================================================
 */
const { writeLog } = require("../utils/logger");

// Maintain an in-memory counter per employee
const claimCounters = {};

/**
 * Generate a new claim number based on empId.
 * Format: EMPID-CURRENTEPOCH-COUNT(001,002,...)
 */
function generateClaimNumber(empId) {
  if (!empId) throw new Error("empId is required");

  // Get current epoch (in seconds or milliseconds as you prefer)
  const epoch = Date.now(); // milliseconds since 1970

  // Initialize counter for this empId if not present
  if (!claimCounters[empId]) {
    claimCounters[empId] = 1;
  } else {
    claimCounters[empId] += 1;
  }

  // Format count as 3 digits (e.g. 001, 002, 010, 101)
  const formattedCount = claimCounters[empId].toString().padStart(3, "0");

  // Final claim number
  const claimNumber = `${empId}-${epoch}-${formattedCount}`;

  writeLog(`Generated claim number: ${claimNumber}`);
  return claimNumber;
}

module.exports = { generateClaimNumber };
