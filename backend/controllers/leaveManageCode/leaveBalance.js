/**
 * ==========================================================
 * File        : leaveBalance.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee leave balance fetching
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module'); 

// Fetch leave balance for employee
async function getLeaveBalance(req, res) {
    try {
        // Get employee ID from request
        const empId = req.user.emp_id;
        console.log("ID",empId)

        // Fetch leave balance from database
        const result = await getData(query.balanceList,[empId]); 
        console.log("Query:",query.balanceList);
        
        // Check if any leave balance was found
        if (!result ) {
            return response.responseNotFound(res,{ message: 'No roles found'});
        }

        return response.responseSuccess(res,result);
    } catch (error) {
        console.error('Error fetching leave balance:', error);
        return response.responseException(res, error, 'getLeaveBalance');
    }
}

module.exports = {
    getLeaveBalance
};
