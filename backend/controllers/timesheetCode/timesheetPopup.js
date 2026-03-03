/**
 * ==========================================================
 * File        : timesheetPopup.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle timesheet popup data fetching
 * ==========================================================
 */
const { getData } = require('../../database/db_function');
const queries = require('../../database/select_queries');
const response = require('../../utils/resposne_module');

async function timesheetPopupData(req, res) {
    try {
        // Get id, month and empId from query parameters
        const { id,month, empId } = req.query;

        if (!month) {
            return response.responseParamMissing(res);
        }

        // Fetch timesheet popup data
        let sql = queries.timesheetPopupData;
        let params = [id,month,empId];

        console.log("SQL:",sql)
        const result = await getData(sql, params);

        if (Array.isArray(result) && result.length === 1 && Object.keys(result[0]).length === 0) {
            result = [];
        }
        
        return response.responseSuccess(res, result);

    } catch (err) {
        console.error("Error fetching time summary:", err);
        return response.responseException(res, err);
    }
}

module.exports = {
    timesheetPopupData
};
