/**
 * ==========================================================
 * File        : getApprovalList.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee leave approval list fetching
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module'); // fixed spelling & path

// Fetch all leave approvals for manager
async function leaveManagerApproval(req, res) {
    try {
        // Get employee ID from request
        const empId = req.user.emp_id;
        console.log("ID",empId)

        const result = await getData(query.approveList,[empId]); 
        console.log("Query:",query.approveList,[empId]);
        
        if (!result || result.length === 0 || (result.length === 1 && Object.keys(result[0]).length === 0)) {
                return response.responseSuccess(res, []); 
            }

        return response.responseSuccess(res,result);
    } catch (error) {
        console.error('Error fetching approval list:', error);
        return response.responseException(res, error, 'leaveManagerApproval');
    }
}

module.exports = {
    leaveManagerApproval
};
