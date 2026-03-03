/**
 * ==========================================================
 * File        : reimbStatus.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee reimbursement status fetching
 * ==========================================================
 */
const {getData}= require('../../database/db_function');
const queries = require('../../database/select_queries');
const response = require('../../utils/resposne_module');

// Fetch reimbursement status for employee
async function reimbStatusdata(req, res) {
    try {
        // Extract empId from authenticated user token
        const empId = req.user.emp_id;
        console.log("EMPID:",empId)

        if (!empId) {
            return response.responseBadRequest(res, { error: "Employee ID not found in token" });
        }

        const result = await getData(queries.reimStatus, [empId]);
        

        return response.responseSuccess(res, result);

    } catch (err) {
        console.error('Error fetching reimbursement status:', err);
        return response.responseException(res, err, 'reimbStatusdata');
    }
}

module.exports = {
    reimbStatusdata
};



