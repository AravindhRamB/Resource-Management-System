/**
 * ==========================================================
 * File        : projectList.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee project fetching
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module');
const { writeLog } = require("../../utils/logger");

// Fetch all projects
async function getProject(req, res) {
    try {
        const result = await getData(query.project_list); 
        writeLog("Project List GET ");
        
        if (!result ) {
            return response.responseNotFound(res,{ message: 'No project found'});
        }
        writeLog("Project List send Successfully");
        return response.responseSuccess(res,result);
    } catch (error) {
        writeLog('Error fetching roles:', error);
        return response.responseException(res,{message:error});
    }
}

module.exports = {
    getProject
};
