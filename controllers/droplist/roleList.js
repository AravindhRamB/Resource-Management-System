/**
 * ==========================================================
 * File        : roleList.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee role fetching
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module'); 

// Fetch all roles
async function getRoles(req, res) {
    try {
        // Fetch roles from database
        const result = await getData(query.rolelist); 
        console.log("Query:",query.rolelist);

        // Check if any roles were found
        if (!result ) {
            return response.responseNotFound(res,{ message: 'No roles found'});
        }

        return response.responseSuccess(res,result);
    } catch (error) {
        console.error('Error fetching roles:', error);
        return response.responseException(res, error, 'getRoles');
    }
}

module.exports = {
    getRoles
};
