/**
 * ==========================================================
 * File        : supportFunction.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee leave support functions
 * ==========================================================
 */
const { executeSQL, getData } = require("../../database/db_function");
const selectQuery = require('../../database/select_queries');
const insertQuery = require('../../database/sql_queries');
const updateQuery = require('../../database/update_queries');
const { writeLog } = require("../../utils/logger");

// 1. Calculate total days
exports.calculateTotalDays = async (startDate, endDate) => {
  try { 
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }
    const result = await getData(selectQuery.totalDaysQuery, [startDate, endDate]);
    if (!result || result.length === 0 || !result[0].total_days) {
      throw new Error('Failed to calculate total days');
    }
    return result[0].total_days;
  } catch (err) {
    err.name = 'LeaveCalculationError';
    throw err;
  }
};

// 2. Check & update leave balance
exports.checkAndUpdateLeaveBalance = async (empId, leave_type_id, total_days) => {
  console.log("Enter for balance check");

  let balanceResult = await getData(selectQuery.balanceQuery, [empId, leave_type_id]);
  console.log("Balance Result:", balanceResult);

  // If no balance, create initial leave balances
  if (!balanceResult || balanceResult.length === 0 || !balanceResult[0].allocated) {
    console.log("No leave balance found, inserting initial balance...");
    await executeSQL(insertQuery.initLeaveBalanceQuery, [empId]);

    // Retry fetch
    balanceResult = await getData(selectQuery.balanceQuery, [empId, leave_type_id]);
    console.log("Refetching the balance");
    console.log("Refetching result:",balanceResult)

    // Final check
    if (!balanceResult || balanceResult.length === 0 || !balanceResult[0].allocated) {
        console.log("Leave balance not fount for employee")
        return { success: false, message: "Leave policy not found for employee" };
    }
  }

  const balance = balanceResult[0];

  // Check if sufficient balance
  // if (balance.remaining < total_days) {
  //   console.log("Final if condition")
  //   return { success: false, message: "Insufficient leave balance" };
  // }

  // Update leave balance
  const updatedBalance = await executeSQL(updateQuery.updateBalanceQuery, [total_days, empId, leave_type_id]);
  console.log("Updated Balance:", updatedBalance.rows[0]);

  return { success: true, balance: updatedBalance.rows[0] };
};

// 3. Insert leave request
exports.insertLeaveRequest = async (empId, leave_type_id, startDate, endDate, reason, severity, assistance_needed ,appId,filePath,duration) => {
  try {
    if (!empId || !leave_type_id || !startDate || !endDate) {
      throw new Error('Required fields missing for leave request');
    }
    const insertResult = await executeSQL(insertQuery.insertLeaveRequest, [
      empId,
      leave_type_id,
      startDate,
      endDate,
      reason || null,
      severity || null,
      assistance_needed || false,
      appId || null,
      filePath || null,
      duration || null
    ]);
    if (!insertResult.rows || insertResult.rows.length === 0) {
      throw new Error('Failed to insert leave request');
    }
    console.log("Leave request inserted in DB");
    return insertResult.rows[0];
  } catch (err) {
    err.name = 'LeaveInsertError';
    throw err;
  }
};
