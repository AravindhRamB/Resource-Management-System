/**
 * ==========================================================
 * File        : adminSummary.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee reimbursement summary fetching
 * ==========================================================
 */
const {getData}= require('../../database/db_function');
const queries = require('../../database/select_queries');
const response = require('../../utils/resposne_module');

// Fetch reimbursement summary for admin
async function reimbAdmindata(req, res) {
    try {
        // Fetch reimbursement data
        const result = await getData(queries.adminReimb);
        
        console.log("Query:",queries.reimStatus)

        return response.responseSuccess(res, result);

    } catch (err) {
        console.error('Error fetching admin reimbursement summary:', err);
        return response.responseException(res, err, 'reimbAdmindata');
    }
}

module.exports = {
    reimbAdmindata
};



