/**
 * ==========================================================
 * File        : timesheetDownload.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle timesheet download requests
 * ==========================================================
 */
const { getData } = require('../../database/db_function');
const queries = require('../../database/select_queries');
const response = require('../../utils/resposne_module');

// Fetch timesheet download summary
async function timedownloadSummary(req, res) {
    try {
        // Get month and empId from query parameters
        const { month, empId } = req.query;
        if (!empId) {
            return response.responseParamMissing(res);
        }

        // Fetch timesheet download data
        const result = await getData(queries.timesheetDownload, [empId,month]);

        return response.responseSuccess(res,result);

    } catch (err) {
        console.error("Error fetching time summary:", err);
        return response.responseException(res, err);
    }
}

module.exports = {
    timedownloadSummary
};
