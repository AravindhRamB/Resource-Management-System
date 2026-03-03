/**
 * ==========================================================
 * File        : timesheetInsert.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle timesheet insertion
 * ==========================================================
 */
const { executeSQL } = require("../../database/db_function");
const { writeLog } = require("../../utils/logger");
const insertquery = require("../../database/sql_queries");
const response = require("../../utils/resposne_module");
const { saveUploadedFile } = require("../supportCode/fileHandler");

// Insert new timesheet entries
const createTimesheet = async (req, res) => {
  try {
    // Extract employee ID from authenticated user token
    const emp_id = req.user.emp_id;
    // Parse payload from request body
    const payload = req.body.data ? JSON.parse(req.body.data) : null;

    console.log("Payload:", payload);

    if (!payload) {
      return response.responseParamMissing(res, "Missing 'data' field");
    }

    // Destructure required fields from payload
    const { month, appId: approver_id, work_log } = payload;

    if (!emp_id || !month || !work_log || work_log.length === 0) {
      return response.responseParamMissing(res, "Missing required fields");
    }

    // Attach uploaded files to corresponding work logs (if any)
    let finalLogs = work_log;
    if (req.files && req.files.length > 0) {
      finalLogs = work_log.map((log, idx) => {
        const file = req.files[idx];
        if (file) {
          try {
            const savedFile = saveUploadedFile(file, null);
            log.attachment = savedFile.filePath;
          } catch (fileErr) {
            writeLog(`File upload error in timesheet: ${fileErr.message}`, "error");
            log.attachment = null;
            // Continue processing even if file upload fails
          }
        } else {
          log.attachment = null;
        }
        return log;
      });
    }

    // Build and execute insert query for each work log
    const insertedRecords = [];

    for (const log of finalLogs) {
      const uploadedAt =
        log.date && !isNaN(Date.parse(log.date))
          ? new Date(log.date)
          : new Date(); // convert to JS Date for timestamptz

          // Prepare parameters for insertion
      const params = [
        emp_id,
        approver_id,
        month,
        log.project,
        log.task,
        log.status || "Pending",
        log.taskDescription || null,
        log.deliverables || null,
        log.hoursSpent || 0,
        log.attachment || null,
        uploadedAt,
        log.subtask || null,
      ];

      console.log("Inserting timesheet entry:", params);

      const result = await executeSQL(insertquery.insertTimesheet, params);
      insertedRecords.push(result.rows[0]);
    }

    return response.responseCreated(res, {
      success: true,
      message: "Timesheet entries created successfully",
      data: insertedRecords,
    });
  } catch (err) {
    writeLog(`Error in createTimesheet: ${err.message}`, "error");
    
    // Handle JSON parse errors
    if (err instanceof SyntaxError) {
      return response.responseParamMissingMessage(res, "Invalid JSON format in 'data' field");
    }
    
    // Handle file upload errors
    if (err.name === 'FileSaveError') {
      return response.responseBadRequest(res, "File upload failed: " + err.message);
    }
    
    return response.responseException(res, err, 'createTimesheet');
  }
};

module.exports = { createTimesheet };
