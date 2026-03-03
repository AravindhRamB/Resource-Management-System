/**
 * ==========================================================
 * File        : dailyTrack.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee daily attendance tracking
 * ==========================================================
 */


const { getData } = require('../../database/db_function');
const queries = require('../../database/select_queries');
const response = require('../../utils/resposne_module');


async function attendenceData(req, res) {
    try {
        const empId = req.user.emp_id;

        const result = await getData(queries.attendenceData, [empId]);
        console.log("Database Result:", result);

        let record = null;
        if (result.length > 0) {
            record = result[0];
            // Check if the record object itself is effectively empty/all nulls
            const hasData = record && (record.status || record.timeValue);
            if (!hasData) {
                record = null; // Treat empty object as no record found
            }
        }

        let responseData;
       
        if (record) {
            // Found a valid running or stopped record
            console.log("Fetched Record:", record);
            responseData = {
                status: record.status,
                // Use the simplified rule for timeValue
                timeValue: record.timeValue || (record.status === 'idle' ? '00:00:00' : null),
            };
        } else {
            // No valid record found (status must be 'idle')
            responseData = {
                status: 'idle',
                timeValue: '00:00:00',
            };
        }

        return response.responseSuccess(res, responseData);

    } catch (err) {
        console.error("Error fetching the Date:", err);
        return response.responseException(res, err);
    }
}
async function attendenceView(req, res) {
    try {
        const { start_date, end_date, emp_id } = req.query;

        // make a copy of the base query
        let query = queries.attendenceView;  
        const params = [start_date, end_date];

        // dynamically add emp_id condition only when needed
        if (emp_id && emp_id !== 'all') {
            query += ` AND ea.emp_id = $3`;
            params.push(emp_id);
        }

        // add ordering for better readability
        query += ` ORDER BY ea.attendance_date DESC;`;

        // fetch data
        const result = await getData(query, params);

        // handle no data
        if (!Array.isArray(result) || result.length === 0) {
            return response.responseSuccess(res, []);
        }

        // filter out completely null rows (if any)
        const validRows = result.filter(row =>
            Object.values(row).some(v => v !== null)
        );

        if (validRows.length === 0) {
            return response.responseSuccess(res, []);
        }

        // directly return the DB output (no hours formatting needed)
        return response.responseSuccess(res, validRows);

    } catch (err) {
        console.error("Error fetching the Data:", err);
        return response.responseException(res, err);
    }
}


async function employeeattendenceView(req, res) {
    try {
        const { start_date, end_date} = req.query;
        const empID= req.user.emp_id;

        const params = [start_date, end_date,empID];

        let query = await getData(queries.empAttendenceView,params);  
       
        return response.responseSuccess(res, query);

    } catch (err) {
        console.error("Error fetching the Data:", err);
        return response.responseException(res, err);
    }
}



module.exports = {
    attendenceData,
    attendenceView,
    employeeattendenceView
};

