/**
 * ==========================================================
 * File        : taskList.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee task fetching
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module');
const { writeLog } = require("../../utils/logger");

// Fetch all tasks
async function getTask(req, res) {
    try {
        const result = await getData(query.task_list); 
        writeLog("Task List GET ");
        
        if (!result ) {
            return response.responseNotFound(res,{ message: 'No project found'});
        }
        writeLog("Task List send Successfully");
        return response.responseSuccess(res,result);
    } catch (error) {
        writeLog('Error fetching task:', error);
        return response.responseException(res,{message:error});
    }
}

module.exports = {
    getTask
};
