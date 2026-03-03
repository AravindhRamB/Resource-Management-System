/**
 * ==========================================================
 * File        : timesheetApprove.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle timesheet approval updates
 * ==========================================================
 */
const { executeSQL } = require('../../database/db_function');
const queries = require('../../database/update_queries');
const response = require('../../utils/resposne_module');

// Update timesheet approval data
async function timesheetUpdatedata(req, res) {
  console.log("Raw Body:", req.body);

  const approverId = req.user.emp_id; // logged-in approver
  const { empId, action, comment, startDate, endDate } = req.body;

  try {
    // Validate input
    if (!empId || !action || !startDate || !endDate) {
      return response.responseParamMissing(res, "Missing one or more required parameters");
    }

    // Prepare parameters for the update query
    const params = [action.toUpperCase(), comment, approverId, empId, startDate, endDate];
    console.log("Update params:", params);

    const result = await executeSQL(queries.updateTimesheetApprovalRange, params);

    if (result.rowCount === 0) {
      return response.responseNotFound(res, "No matching records found for update");
    }

  
    return response.responseSuccess(res, {
      success: true,
      message: `Timesheet(s) updated successfully for ${empId}`,
      updatedCount: result.rowCount
    });

  } catch (err) {
    console.error("Error updating timesheet:", err);
    return response.responseException(res, err, 'timesheetUpdatedata');
  }
}

module.exports = {
  timesheetUpdatedata
};
