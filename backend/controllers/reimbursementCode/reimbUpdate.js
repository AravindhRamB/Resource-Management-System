/**
 * ==========================================================
 * File        : reimbUpdate.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee reimbursement data updating
 * ==========================================================
 */
const { executeSQL } = require('../../database/db_function');
const queries = require('../../database/update_queries');
const response = require('../../utils/resposne_module');

// Update reimbursement data
async function reimbUpdatedata(req, res) {
  console.log("Raw Body:", req.body);
  console.log("Type of Body:", typeof req.body);
  console.log("Is Array:", Array.isArray(req.body));

  // Expecting an array of objects
  const clientData = req.body; 
  const empId = req.user.emp_id;

  try {
    console.log("Enter")
    // Iterate over each item in the array
    if (Array.isArray(clientData) && clientData.length > 0) {
      console.log("Enter in to id")
      for (const data of clientData) {
        console.log("data:",data)
        
        // --- Update Claim ---
        if (data.claimId) {
          const claimParams = [
            data.projectProspect,
            data.place,
            data.claimId,
            empId
          ];

          console.log("Payload Data:", data);

          // Log final query with values
          console.log("Claim Update SQL:", queries.updateClaim, [
            data.projectProspect,
            data.place,
            data.claimId,
            empId
          ]);

          await executeSQL(queries.updateClaim, claimParams);
        }

        // --- Update Expense ---
        if (data.expenseId) {
          const expenseParams = [
            data.category,
            data.billDate,
            data.dateOfRaised,
            data.paidTo,
            data.customer,
            data.currency,
            data.advance,
            data.amount,
            data.expenseId
          ];

          console.log("Expense Update SQL:", queries.updateExpense, expenseParams);

          await executeSQL(queries.updateExpense, expenseParams);
        }

        // --- Update Attachment ---
        if (data.attachmentId) {
          const attachParams = [
            data.fileName,
            data.attachment,
            data.attachmenType,
            data.attachmentId
          ];

          console.log("Attachment Update SQL:", queries.updateAttachment, attachParams);

          await executeSQL(queries.updateAttachment, attachParams);
        }
      }
    }
// Send success response after all updates
    return response.responseSuccess(res, {
      success: "Reimbursement data updated successfully"
    });

  } catch (err) {
    console.error('Error updating reimbursement data:', err);
    return response.responseException(res, err, 'reimbUpdatedata');
  }
}

module.exports = {
  reimbUpdatedata
};
