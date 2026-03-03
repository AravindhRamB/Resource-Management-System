/**
 * ==========================================================
 * File        : getResource.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee resource data fetching
 * ==========================================================
 */
const { getData } = require('../../database/db_function');
const queries = require('../../database/select_queries');
const response = require('../../utils/resposne_module');

// Fetch resource data
async function taskData(req, res) {
    try {
        // Get employee ID from authenticated user token
        const empId = req.user.emp_id;

        // Fetch resource data for the employee
        const result = await getData(queries.getResource, [empId]);

        // Assuming we want to return the first record if multiple are found
        const data = result.length > 0 ? result[0] : [];

        // Send success response with the data
        return response.responseSuccess(res, data);

    } catch (err) {
        console.error("Error fetching the Data:", err);
        return response.responseException(res, err, 'taskData');
    }
}


async function employeeResourceAllocated(req,res){
    try {
        // Get employee ID from authenticated user token
        const empId = req.user.emp_id;
        const project=req.query.project;
        // Fetch resource data for the employee
        const result = await getData(queries.resourceAllocated, [empId, project]);
        const data = result.length > 0 ? result : [];
        // Send success response with the data
        return response.responseSuccess(res, data);
    } catch (err) {
        console.error("Error fetching the Data:", err);
        return response.responseException(res, err, 'employeeResourceAllocated');
    }
}


module.exports = {
    taskData,
    employeeResourceAllocated
};
