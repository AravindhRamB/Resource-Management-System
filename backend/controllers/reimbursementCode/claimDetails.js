/**
 * ==========================================================
 * File        : claimDetails.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee claim reimbursement details fetching
 * ==========================================================
 */
const {getData}= require('../../database/db_function');
const queries = require('../../database/select_queries');
const response = require('../../utils/resposne_module');

// Fetch claim details
async function claimDetails(req, res) {
    try {

        // Get key from query parameters
        const key = req.query.key;
        
        // Fetch claim reimbursement data
        const result = await getData(queries.claimReimb,[key]);
        console.log("Query:",queries.claimReimb)

        return response.responseSuccess(res, result);

    } catch (err) {
        console.error('Error fetching claim details:', err);
        return response.responseException(res, err, 'claimDetails');
    }
}

module.exports = {
    claimDetails
};



