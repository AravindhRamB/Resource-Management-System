/**
 * ==========================================================
 * File        : timesheetSummary.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle timesheet summary fetching
 * ==========================================================
 */
const { getData } = require('../../database/db_function');
const queries = require('../../database/select_queries');
const response = require('../../utils/resposne_module');

// Fetch timesheet summary for an employee
async function timeSummary(req, res) {
    try {
        // Extract employee ID from authenticated user token
        const empId = req.user.emp_id;
        const { start_date, end_date } = req.query;
        console.log("EMPID:", empId);
        
        if (!empId) {
            return response.responseParamMissing(res);
        }
        if(!start_date || !end_date){
            return response.responseParamMissing(res);
        }
        console.log("Start Date:", start_date, "End Date:", end_date);

        const params = [
            empId,
            start_date,
            end_date
        ];

        // Fetch timesheet summary data
        let result = await getData(queries.timeSummary, params);
        console.log(queries.timeSummary, params)
        if (Array.isArray(result) && result.length === 1 && Object.keys(result[0]).length === 0) {
            result = [];
        }
        return response.responseSuccess(res,result);

    } catch (err) {
        console.error("Error fetching time summary:", err);
        return response.responseException(res, err);
    }
}


// Fetch timesheet summary popup data for an employee
// Fetch timesheet summary popup data for an employee
async function timeSummaryPopup(req, res) {
    try {
        // Extract employee ID from authenticated user token
        const empId = req.user.emp_id;
        console.log("EMPID:", empId);

        // Get date from query parameters
        const { Date } = req.query;
        
        if (!empId) {
            return response.responseParamMissing(res);
        }

        if (!Date) {
            return response.responseParamMissing(res);
        }

        // Prepare parameters for the query
        const params = [
            empId,
            Date
        ];

        console.log("Fetching timesheet popup data with params:", params);

        // Fetch timesheet popup data
        const result = await getData(queries.timesheetSummaryPopup, params);

        return response.responseSuccess(res, result);

    } catch (err) {
        console.error("Error fetching time summary popup:", err);
        return response.responseException(res, err);
    }
}

module.exports = {
    timeSummary,
    timeSummaryPopup
};
