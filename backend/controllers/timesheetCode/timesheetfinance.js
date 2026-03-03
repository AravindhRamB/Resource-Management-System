/**
 * ==========================================================
 * File        : timesheetFinance.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle timesheet finance summary fetching
 * ==========================================================
 */
const { getData } = require('../../database/db_function');
const queries = require('../../database/select_queries');
const response = require('../../utils/resposne_module');

// Fetch timesheet finance summary
async function timeFinanceSummary(req, res) {
    try {

        const { month, empId } = req.query;   

        if (!month) {
            return response.responseParamMissing(res);
        }

        let sql = queries.timesheetFinanceSummary;
        let params = [month];

        // Add empId filter if provided and not "all"
        if (empId && empId.toLowerCase() !== "all") {
            sql += " AND tj.emp_id = $2";
            params.push(empId);
        }

        console.log("SQL:",sql)
        const result = await getData(sql, params);


        return response.responseSuccess(res, result);

    } catch (err) {
        console.error("Error fetching time summary:", err);
        return response.responseException(res, err);
    }
}

module.exports = {
    timeFinanceSummary
};
