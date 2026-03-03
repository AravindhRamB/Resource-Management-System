/**
 * ==========================================================
 * File        : configration.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee configuration fetching and updating
 * ==========================================================
 */
const query = require('../../database/select_queries');
const update=require('../../database/update_queries')
const { getData} = require('../../database/db_function');
const execute_sql = require("../../database/db_function");
const response = require('../../utils/resposne_module');
const { writeLog } = require("../../utils/logger");

// Get role configuration by ID
async function getEmpConfigration(req, res) {
    try {
        console.log("Enter inside code");
        const { id } = req.query;

        if (!id) {
            console.log("ID");
            return response.responseParamMissing(res, { message: "Role ID is required" });
        }
        
        console.log("Enter forquery");
        const result = await getData(query.getConfig, [id]);

        console.log("Data:",result);

        if (!result || result.length === 0) {
            return response.responseNotFound(res, { message: 'No role found with given ID' });
        }

        writeLog(`Fetched role details for ID ${id}`);
        return response.responseSuccess(res, result[0]);
    } catch (error) {
        writeLog('Error fetching role configuration:', error);
        return response.responseException(res, { message: error.message });
    }
}

// Update access_permission JSON by role ID
async function updateEmpConfigration(req, res) {
    try {
        console.log("Enter")
        const { id } = req.query;
        const permissions = req.body.permissions; 

        if (!id) {
            console.log("ID")
            return response.responseBadRequest(res, { message: "Role ID is required" });
        }

        if (!permissions) {
            console.log("Permision")
            return response.responseBadRequest(res, { message: "permissions key is required in form-data" });
        }

        // Validate JSON format
        let parsedPermissions;
        try {
            parsedPermissions = permissions;
        } catch (e) {
            console.log("Invalid JSON");
            return response.responseBadRequest(res, { message: "Invalid JSON format in permissions" });
        }

        console.log("Query Executoion")
        const result=await execute_sql.executeSQL(update.updateConfig, [JSON.stringify(parsedPermissions), id]);

        console.log("DATA:",result);

        if (!result || result.length === 0) {
            console.log("No data")
            return response.responseParamMissingMessage(res, { message: 'No role found with given ID' });
        }

        writeLog(`Updated permissions for role ID ${id}`);
        return response.responseCreated(res);
    } catch (error) {
        writeLog('Error updating role configuration:', error);
        return response.responseException(res, { message: error.message });
    }
}

module.exports = {
    getEmpConfigration,
    updateEmpConfigration
};
