/**
 * ==========================================================
 * File        : leaveList.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee leave list fetching
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module'); // fixed spelling & path

// Fetch all leave records for employee
async function getLeave(req, res) {
    try {
        // Get employee ID from request
        const empId = req.user.emp_id;
        console.log("ID",empId)

        const result = await getData(query.leaveList,[empId]); 
        console.log("Query:",query.leaveList);
         
        if (!result ) {
            return response.responseNotFound(res,{ message: 'No roles found'});
        }

        return response.responseSuccess(res,result);
    } catch (error) {
        console.error('Error fetching leave list:', error);
        return response.responseException(res, error, 'getLeave');
    }
}

module.exports = {
    getLeave
};
