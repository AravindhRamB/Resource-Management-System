/**
 * ==========================================================
 * File        : reimbSummary.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee reimbursement summary fetching
 * ==========================================================
 */
const { getData } = require('../../database/db_function');
const queries = require('../../database/select_queries');
const response = require('../../utils/resposne_module');

// Fetch reimbursement summary for employee
async function reimbSummarydata(req, res) {
    try {
        // Extract empId from authenticated user token
        const empId = req.user.emp_id;
        console.log("EMPID:", empId);

        if (!empId) {
            return response.responseBadRequest(res, { error: "Employee ID not found in token" });
        }

        // Run query with empId
        let result = await getData(queries.summaryReimb, [empId]);
        console.log("Query:", queries.summaryReimb);
        console.log("Result before fix:", result);

        // Handle case where result is an array with a single empty object
        if (Array.isArray(result) && result.length === 1 && Object.keys(result[0]).length === 0) {
            result = [];
        }

        console.log("Final Result:", result);
        return response.responseSuccess(res, result);

    } catch (err) {
        console.error('Error fetching reimbursement summary:', err);
        return response.responseException(res, err, 'reimbSummarydata');
    }
}

module.exports = {
    reimbSummarydata
};
