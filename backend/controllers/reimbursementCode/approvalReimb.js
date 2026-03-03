/**
 * ==========================================================
 * File        : approvalReimb.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee reimbursement approval updates
 * ==========================================================
 */
const { executeSQL } = require('../../database/db_function');
const queries = require('../../database/update_queries');
const response = require('../../utils/resposne_module');

// Update reimbursement approvals
const updateReimbApproval = async (req, res) => {
  try {
    // Extract data from request body
    const data = req.body; 
   
    // Expecting an object with claimId, action, comments, etc.
    if (!data || Object.keys(data).length === 0) {
      return response.responseParamMissing(res, { message: "No data provided" });
    }

    const { claimId,action, comments } = data;
    const emp_id = req.user.emp_id;

    // --- Update Claim Approval ---
    if (claimId) {
      const claimParams = [action, comments || null, claimId,emp_id];
      console.log("Claim Approval Update SQL:", queries.updateClaimApproval, claimParams);
      await executeSQL(queries.updateClaimApproval, claimParams);
    }

    // // --- Update Expense Approval ---
    // if (expenseId) {
    //   const expenseParams = [approval, expenseId];
    //   console.log("Expense Approval Update SQL:", queries.updateExpenseApproval, expenseParams);
    //   await executeSQL(queries.updateExpenseApproval, expenseParams);
    // }

    // // --- Update Attachment Approval ---
    // if (claimattachmentId) {
    //   const attachParams = [approval, claimattachmentId];
    //   console.log("Attachment Approval Update SQL:", queries.updateAttachmentApproval, attachParams);
    //   await executeSQL(queries.updateAttachmentApproval, attachParams);
    // }

    return response.responseSuccess(res, {
      success: true,
      message: "Approval(s) updated successfully"
    });

  } catch (error) {
    console.error("Error updating approvals:", error);
    return response.responseException(res, error, 'updateReimbApproval');
  }
};

module.exports = {
  updateReimbApproval
};
