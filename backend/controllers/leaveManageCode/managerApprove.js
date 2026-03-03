/**
 * ==========================================================
 * File        : managerApprove.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee leave approval updates
 * ==========================================================
 */
const { executeSQL } = require('../../database/db_function');
const queries = require('../../database/update_queries');
const response = require('../../utils/resposne_module');

// Update leave approval status
async function leaveUpdatedata(req, res) {
  console.log("Raw Body:", req.body);
  const empId = req.user.emp_id;
  const { id, status,comments } = req.body; // take values directly from payload

  try {
    // Prepare parameters for the update query
    const claimParams = [status, id,empId,comments];
    console.log("Update params:", claimParams);
    
    await executeSQL(queries.updateleaveApproval, claimParams);

    return response.responseSuccess(res, {
      success: true,
      message: "Leave status updated successfully"
    });

  } catch (err) {
    console.error("Error updating leave status:", err);
    return response.responseException(res, err, 'leaveUpdatedata');
  }
}

module.exports = {
  leaveUpdatedata
};


