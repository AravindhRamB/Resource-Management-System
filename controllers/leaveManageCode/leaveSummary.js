/**
 * ==========================================================
 * File        : leaveSummary.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee leave summary fetching
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module');

// Fetch leave summary with filters
async function getLeaveSummary(req, res) {
    try {
        const { fromDate, toDate, employeeName, status, empId } = req.query;

        // Start fresh for every request
        let sql = query.leaveSummary + " WHERE 1=1";
        const params = [];
        let paramIndex = 1;

        // Date range filter
        if (fromDate && toDate && fromDate !== "all" && toDate !== "all") {
            sql += ` AND lr.start_date >= $${paramIndex++} AND lr.end_date <= $${paramIndex++}`;
            params.push(fromDate, toDate);
        }

    
        // Employee ID filter
        if (empId && empId !== "all") {
            sql += ` AND lr.emp_id = $${paramIndex++}`;
            params.push(empId);
        }

        // Status filter
        if (status && status !== "all") {
            sql += ` AND lr.status = $${paramIndex++}`;
            params.push(status);
        }

        const result = await getData(sql, params);
        console.log("Final Query:", sql, " Params:", params);

        if (!result || result.length === 0 || (result.length === 1 && Object.keys(result[0]).length === 0)) {
                return response.responseSuccess(res, []); // return empty array
            }

        return response.responseSuccess(res, result);
    } catch (error) {
        console.error('Error fetching leave summary:', error);
        return response.responseException(res, error, 'getLeaveSummary');
    }
}

module.exports = {
    getLeaveSummary
};
