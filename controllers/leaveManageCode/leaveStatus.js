/**
 * ==========================================================
 * File        : leaveStatus.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee leave status fetching
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module'); // fixed spelling & path

// Fetch leave status for employee
async function getLeaveStatus(req, res) {
    try {
        // Get employee ID from request
        const empId = req.user.emp_id;
        console.log("ID",empId)

        const result = await getData(query.leaveStatus,[empId]); 
        console.log("Query:",query.leaveStatus);
        // Check if result is empty
        if (!result ) {
            return response.responseNotFound(res,{ message: 'No data found'});
        }

        return response.responseSuccess(res,result);
    } catch (error) {
        console.error('Error fetching leave status:', error);
        return response.responseException(res, error, 'getLeaveStatus');
    }
}

module.exports = {
    getLeaveStatus
};
