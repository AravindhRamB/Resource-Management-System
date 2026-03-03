/**
 * ==========================================================
 * File        : empList.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee list fetching
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module');
const { writeLog } = require("../../utils/logger");

// Fetch all roles
async function getEmp(req, res) {
    try {
        // Fetch employee list from database
        const result = await getData(query.emp_list); 
        writeLog("Task List GET ");
        
        // Check if any employees were found
        if (!result ) {
            return response.responseNotFound(res,{ message: 'No project found'});
        }
        writeLog("Task List send Successfully");
        return response.responseSuccess(res,result);
    } catch (error) {
        writeLog('Error fetching task:', error);
        return response.responseException(res,{message:error});
    }
}

module.exports = {
    getEmp
};
