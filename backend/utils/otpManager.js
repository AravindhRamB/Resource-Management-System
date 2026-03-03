/**
 * ==========================================================
 * File        : otpManager.js
 * Author      : Pradip Kumar
 * Created On  : 
 * Description : Utility to manage OTP generation and verification
 * ==========================================================
 */
const { getData, executeSQL } = require('../database/db_function');
const sqlQueries = require('../database/sql_queries');
const selectQueries = require('../database/select_queries');
const updateQueries = require('../database/update_queries');
const { writeLog } = require('./logger');

// Store OTP for a given email
async function storeOTP(email, otp) {
  try {
  
    const result = await executeSQL(sqlQueries.insertOTP, [email, otp]);
    
    // Check if the OTP was stored successfully
    if (result && result.length > 0) {
      writeLog(`OTP stored for email: ${email}`, 'info');
      console.log(`OTP stored successfully for ${email} - OTP remains active until used`);
      return true;
    }
    
    writeLog(`OTP update returned empty result for email: ${email}`, 'warn');
    console.log(`Warning: OTP update returned empty result for ${email}`);
    return false;
  } catch (err) {
    writeLog(`Error storing OTP: ${err.message}`, 'error');
    console.error('Error storing OTP - Full error:', err);
    throw err;
  }
}

// Verify OTP for a given email
async function verifyOTP(email, otp) {
  try {
    console.log(`[DEBUG] Verifying OTP for email: ${email}, OTP: ${otp}`);
    
    // Fetch the OTP record
    const result = await getData(selectQueries.getValidOTP, [email, otp]);
    
    console.log(`[DEBUG] Query result:`, result);
    console.log(`[DEBUG] Result length:`, result ? result.length : 'null');
    
    // Check if OTP matches
    if (!result || result.length === 0 || !result[0].email) {
      writeLog(`Invalid OTP for email: ${email}`, 'warn');
      console.log(`[VERIFY] Invalid OTP for ${email} - OTP does not match`);
      return false;
    }
    
    console.log(`[DEBUG] OTP matched, now clearing it`);
    
    const updateResult = await executeSQL(updateQueries.markOTPAsUsed, [email, otp]);
    
    console.log(`[DEBUG] Update result:`, updateResult);
    console.log(`[DEBUG] Update rowCount:`, updateResult ? updateResult.rowCount : 'null');
    
    if (!updateResult || updateResult.rowCount === 0) {
      writeLog(`Failed to clear OTP for email: ${email}`, 'error');
      console.log(`[VERIFY] Failed to clear OTP for ${email}`);
      return false;
    }
    
    writeLog(`OTP verified and cleared for email: ${email}`, 'info');
    console.log(`[VERIFY] OTP verified successfully for ${email}`);
    return true;
  } catch (err) {
    writeLog(`Error verifying OTP: ${err.message}`, 'error');
    console.error('[VERIFY] Error verifying OTP:', err);
    return false;
  }
}



module.exports = {
  storeOTP,
  verifyOTP
};
