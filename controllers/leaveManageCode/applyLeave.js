/**
 * ==========================================================
 * File        : applyLeave.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee leave applications
 * ==========================================================
 */
const { writeLog } = require("../../utils/logger");
const { calculateTotalDays, checkAndUpdateLeaveBalance, insertLeaveRequest } = require('../../controllers/leaveManageCode/supportFunction');
const response = require('../../utils/resposne_module');
const { saveUploadedFile } = require('../supportCode/fileHandler');

// Apply for leave
exports.applyLeave = async (req, res) => {
  try {
    // Step 1: Parse and validate input data
    const empId = req.user.emp_id;
    console.log("EMPID:", empId);

    let parsedData = {};
    if (req.body.data) {
      try {
        parsedData = JSON.parse(req.body.data);
      } catch (err) {
        return response.responseParamMissingMessage(res, "Invalid JSON in 'data' field");
      }
    }

    const { leave_type_id, startDate, endDate, reason, severity, assistance_needed, appId ,duration} = parsedData;
    console.log("Parsed Data:", parsedData);

    if (!leave_type_id || !startDate || !endDate) {
      return response.responseParamMissing(res);
    }

    //  Step 2: Calculate total leave days
    const total_days = await calculateTotalDays(startDate, endDate);
    console.log("Total leave days:", total_days);

    if (!total_days || total_days <= 0) {
      return response.responseParamMissingMessage(res, "Invalid leave duration");
    }

    //  Step 3: Check and update leave balance
    const balanceCheck = await checkAndUpdateLeaveBalance(empId, leave_type_id, total_days);
    console.log("Balance check:", balanceCheck);

    if (!balanceCheck.success) {
      return response.responseParamMissingMessage(res, balanceCheck.message);
    }

    // Step 4: Handle attachments (optional)
    let filePath = null;
    const matchingFiles = req.files?.filter(f => f.fieldname === "file");

    if (matchingFiles && matchingFiles.length > 0) {
      try {
        const fileDetails = saveUploadedFile(matchingFiles[0], null);
        filePath = fileDetails.filePath;
        console.log("File saved:", fileDetails);
      } catch (fileErr) {
        writeLog(`File upload error in applyLeave: ${fileErr.message}`, "error");
        return response.responseBadRequest(res, "File upload failed: " + fileErr.message);
      }
    }

    // Step 5: Insert leave request
    const leaveRequest = await insertLeaveRequest(
      empId,
      leave_type_id,
      startDate,
      endDate,
      reason,
      severity,
      assistance_needed,
      appId,
      filePath,
      duration
    );

    console.log("Leave request inserted:", leaveRequest);

    return response.responseCreated(res, {
      success: true,
      message: "Leave applied successfully",
      updatedBalance: balanceCheck.balance
    });

  } catch (err) {
    writeLog(`Error in applyLeave: ${err.message}`, "error");
    
    // Handle file upload errors
    if (err.name === 'FileSaveError') {
      return response.responseBadRequest(res, "File upload failed: " + err.message);
    }
    
    return response.responseException(res, err, 'applyLeave');
  }
};
