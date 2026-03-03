const { getData } = require('../../database/db_function');
const queries = require('../../database/select_queries');
const response = require('../../utils/resposne_module');

async function allresourceData(req, res) {
    try {
        const { project, start_date, end_date} = req.query;
        
        const result = await getData(queries.getallResources, [project, start_date, end_date]);

        if (Array.isArray(result) && result.length === 1 && Object.keys(result[0]).length === 0) {
                    result = [];
                }
                return response.responseSuccess(res,result);

    } catch (err) {
        console.error("Error fetching the Date:", err);
        return response.responseException(res, err);
    }
}


async function employeeResourceData(req, res) {
    try {
        const { project, start_date, end_date} = req.query;

        const result = await getData(queries.employeeResources, [project, start_date, end_date]);
        const hasValidData = Array.isArray(result) && result.some(
        item => item && Object.keys(item).length > 0
        );
        const data = result.length > 0 ? result[0] : [];
        console.log(data)
        return response.responseSuccess(res, data);

    } catch (err) {
        console.error("Error fetching the Date:", err);
        return response.responseException(res, err);
    }
}

async function resourcePopupData(req, res) {
    try {
        const {emp_id, project, start_date, end_date} = req.query;
        
        // Add logging to debug
        console.log('Query params:', {emp_id, project, start_date, end_date});
        
        const result = await getData(queries.resourcePopup, [emp_id, project, start_date, end_date]);
        
        console.log('Executing query:', queries.resourcePopup,[emp_id, project, start_date, end_date]);

        console.log('Query result:', result);
        
        // Return empty array if no results or if result is falsy
        const data = (result && result.length > 0) ? result : [];
        
        return response.responseSuccess(res, data);

    } catch (err) {
        console.error("Error fetching the Date:", err);
        return response.responseException(res, err);
    }
}
module.exports = {
    allresourceData,
    employeeResourceData,
    resourcePopupData
};
