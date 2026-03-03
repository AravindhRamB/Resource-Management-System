/**
 * ==========================================================
 * File        : reimbCategoryList.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee reimbursement category fetching
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module');
const { writeLog } = require("../../utils/logger");

// Fetch all reimbursement categories
async function getCategory(req, res) {
    try {
        // Fetch reimbursement categories from database
        const result = await getData(query.category_list); 
        writeLog("Category for Reimbursement List GET ");
        
        // Check if any categories were found
        if (!result ) {
            return response.responseNotFound(res,{ message: 'No Category found'});
        }
        writeLog("Reimbursement type send Successfully");
        return response.responseSuccess(res,result);
    } catch (error) {
        writeLog('Error fetching roles:', error);
        return response.responseException(res,{message:error});
    }
}

module.exports = {
    getCategory
};
