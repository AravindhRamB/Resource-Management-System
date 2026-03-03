/**
 * ==========================================================
 * File        : financeReimb.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle finance reimbursement summary fetching
 * ==========================================================
 */
const { getData } = require('../../database/db_function');
const queries = require('../../database/select_queries');
const response = require('../../utils/resposne_module');

// Fetch reimbursement summary for finance
async function financeSummary(req, res) {
    try {
        // Extract query parameters
        const { fromDate, toDate, empId, status,claimNo } = req.query;
        
        if (!fromDate || !toDate) {
            return response.responseBadRequest(res, { error: "fromDate and toDate are required" });
        }

        // Prepare params
        const params = [
            fromDate,
            toDate,
            empId && empId.toUpperCase() !== "ALL" ? empId : null,
            status && status.toUpperCase() !== "ALL" ? status : null,
            claimNo && claimNo.toUpperCase() !=="ALL"? claimNo:null
        ];

        console.log("Query:", queries.financeReimb);
        console.log("Params:", params);

        let result = await getData(queries.financeReimb, params);

        // Handle case where result is an array with a single empty object
        if (Array.isArray(result) && result.length === 1 && Object.keys(result[0]).length === 0) {
            result = [];
        }

        return response.responseSuccess(res, result);

    } catch (err) {
        console.error('Error fetching finance reimbursement summary:', err);
        return response.responseException(res, err, 'financeSummary');
    }
}

module.exports = {
    financeSummary
};
