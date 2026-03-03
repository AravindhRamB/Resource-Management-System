/**
 * ==========================================================
 * File        : managerList.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee manager fetching
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module'); // fixed spelling & path

// Fetch all roles
async function getManager(req, res) {
    try {
        const result = await getData(query.managerlist);         
        if (!result ) {
            return response.responseNotFound(res,{ message: 'No roles found'});
        }

        return response.responseSuccess(res,result);
    } catch (error) {
        console.error('Error fetching managers:', error);
        return response.responseException(res, error, 'getManager');
    }
}

module.exports = {
    getManager
};
