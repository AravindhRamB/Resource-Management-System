/**
 * ==========================================================
 * File        : employeeList.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee listing fetching
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module');
const { writeLog } = require("../../utils/logger");

// Fetch all employee details
async function getEmpdetails(req, res) {
    try {
        const result = await getData(query.employee_list); 
        writeLog("Employee List GET ");
        
        if (!result ) {
            return response.responseNotFound(res,{ message: 'No employee found'});
        }
        writeLog("Employee List send Successfully");
        return response.responseSuccess(res,result);
    } catch (error) {
        writeLog('Error fetching employee:', error);
        return response.responseException(res,{message:error});
    }
}

module.exports = {
    getEmpdetails
};
