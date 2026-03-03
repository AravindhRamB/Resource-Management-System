/**
 * ==========================================================
 * File        : roleType.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee role type fetching
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module'); 

// Fetch all roles type
async function getType(req, res) {
    try {
        const result = await getData(query.roletypeList);         
        if (!result ) {
            return response.responseNotFound(res,{ message: 'No roles found'});
        }

        return response.responseSuccess(res,result);
    } catch (error) {
        console.error('Error fetching role types:', error);
        return response.responseException(res, error, 'getType');
    }
}

module.exports = {
    getType
};
