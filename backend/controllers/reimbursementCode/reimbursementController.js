/**
 * ==========================================================
 * File        : reimbursementController.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee reimbursement creation
 * ==========================================================
 */
const { executeSQL } = require("../../database/db_function");
const { insertClaim, insertExpense, insertAttachment } = require("../../database/sql_queries");
const { writeLog } = require("../../utils/logger");
const { saveUploadedFile } = require('../supportCode/fileHandler');
const { generateClaimNumber } = require("../../utils/claimNoGenerator");
const response = require("../../utils/resposne_module");

// Create a new reimbursement claim
exports.createReimbursement = async (req, res) => {
  try {
    console.log("Raw Body:", req.body);
    console.log("Raw Files:", req.files);
   
    // Parse input data
    const empId = req.user?.emp_id;
    if (!empId) {
      return response.responseUnauthorized(res, "Employee ID not found in token");
    }

    if (!req.body.data) {
      return response.responseParamMissing(res);
    }

    let payload;
    try {
      payload = JSON.parse(req.body.data);
    } catch (parseErr) {
      return response.responseParamMissingMessage(res, "Invalid JSON format in 'data' field");
    }

    const { project, place, advance, expenses } = payload;

    if (!project || !place || !Array.isArray(expenses) || expenses.length === 0) {
      return response.responseParamMissing(res);
    }

    // Step 1: Generate claim number automatically
    const claimNo = await generateClaimNumber(empId);
    console.log("Generated Claim Number:", claimNo);

    // Step 2: Insert claim
    const claimResult = await executeSQL(insertClaim, [project, claimNo, place, empId]);
    if (!claimResult.rows || claimResult.rows.length === 0) {
      throw new Error("Insert failed: no claim id returned");
    }

    const claimId = claimResult.rows[0].id;
    console.log("Claim ID:", claimId);

    // Step 3: Insert expenses
    for (let i = 0; i < expenses.length; i++) {
      const exp = expenses[i];
      const { category, currency, billDate, paidTo, amount } = exp;

      if (!category || !currency || !billDate || !amount) {
        return response.responseParamMissingMessage(res, `Missing required fields in expense at index ${i}`);
      }

      const expenseResult = await executeSQL(insertExpense, [
        claimId,
        category,
        currency,
        billDate,
        paidTo,
        advance,
        amount
      ]);

      if (!expenseResult.rows || expenseResult.rows.length === 0) {
        throw new Error("Insert failed: no expense id returned");
      }

      const expenseId = expenseResult.rows[0].id;
      console.log(`Expense ID [${i}]:`, expenseId);

      // Step 4: Handle file attachments
      const matchingFiles = req.files?.filter(f => f.fieldname === "bill_attachments");
      if (matchingFiles && matchingFiles.length > 0 && matchingFiles[i]) {
        try {
          const fileDetails = saveUploadedFile(matchingFiles[i], expenseId);
          if (fileDetails) {
            await executeSQL(insertAttachment, [
              fileDetails.expenseId,
              fileDetails.filePath,
              fileDetails.fileName,
              fileDetails.fileType
            ]);
            console.log(`Attachment inserted for expenseId ${expenseId}:`, fileDetails);
          }
        } catch (fileErr) {
          writeLog(`File upload error for expense ${expenseId}: ${fileErr.message}`, "error");
          // Continue processing other expenses even if file upload fails
        }
      }
    }

    // Step 5: Respond success
    return response.responseCreated(res, {
      success: true,
      message: "Reimbursement claim inserted successfully with attachments",
      claim_id: claimId,
      claim_number: claimNo
    });

  } catch (err) {
    writeLog(`Error in createReimbursement: ${err.message}`, "error");
    
    // Handle file upload errors
    if (err.name === 'FileSaveError') {
      return response.responseBadRequest(res, "File upload failed: " + err.message);
    }
    
    return response.responseException(res, err, 'createReimbursement');
  }
};
