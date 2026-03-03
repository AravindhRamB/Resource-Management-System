/**
 * ==========================================================
 * File        : timesheetAdminView.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle timesheet admin view fetching
 * ==========================================================
 */
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module');
const queries = require('../../database/select_queries'); 

// Fetch timesheet admin summary
async function timeadminSummary(req, res) {
    try {
    
        const { empId = 'ALL', startDate, endDate } = req.query;

        const approveId = req.user.emp_id;

        // params must align with placeholders in SQL
        const params = [
            empId || 'ALL',
            startDate ,
            endDate,
            approveId
        ];

        // Fetch timesheet admin flexible data
        const result = await getData(queries.timesheetAdminFlexible, params);
        console.log("Result:",result)
        
        // Handle case where result is an array with a single empty object
        if (result.length === 1 && Object.keys(result[0]).length === 0) 
            {
            return response.responseSuccess(res, []);
        }
        return response.responseSuccess(res, result);

    } catch (err) {
        console.error("Error fetching time summary:", err);
        return response.responseException(res, err);
    }
}

module.exports = { timeadminSummary };
