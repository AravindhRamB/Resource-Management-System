/**
 * ==========================================================
 * File        : claimList.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : claimList Controller to fetch claim numbers for an employee
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module'); 

// Fetch claim numbers
async function claimType(req, res) {
    try {
        // Get employee ID from query parameters
        const empId = req.query.emp_id ;  
        const result = await getData(query.claimNoList, [empId]);
        
        // Check if any claim numbers were found
        if (!result || result.length === 0) {
            return response.responseNotFound(res, { message: 'No claim numbers found' });
        }

        return response.responseSuccess(res, result);
    } catch (error) {
        console.error('Error fetching claim numbers:', error);
        return response.responseException(res, error, 'claimType');
    }
}

module.exports = {
    claimType
};
