/**
 * ==========================================================
 * File        : resourceAdd.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee resource allocation
 * ==========================================================
 */
const { executeSQL } = require("../../database/db_function");
const { writeLog } = require("../../utils/logger");
const response = require("../../utils/resposne_module");
const query = require('../../database/sql_queries')

// Handle resource allocation
const handleResource = async (req, res) => {
    try {
        // Extract project and resource details from request body
        const { project, resource } = req.body;
        // Get the ID of the employee allocating the resource
        const allocated_by = req.user.emp_id;

        if (!project || !resource || !Array.isArray(resource) || resource.length === 0) {
            return response.responseParamMissingMessage(res);
        }

        const insertedRows = [];

        // Iterate over each resource to allocate
        for (const r of resource) {
            const { emp_id, task_description, allocated_hours, date_range } = r;

            if (!emp_id || !task_description || !allocated_hours || !date_range || date_range.length !== 2) {
                return response.responseParamMissingMessage(res);
            }

            // Extract start_date and deadline_date from date_range
            const start_date = new Date(date_range[0]);
            const deadline_date = new Date(date_range[1]);

            const values = [
                project,
                emp_id,
                allocated_by,
                task_description,
                allocated_hours,
                start_date,
                deadline_date
            ];

            const result = await executeSQL(query.ResourceinsertQuery, values);
            insertedRows.push(result.rows[0]);

            writeLog(`Resource allocated for emp_id ${emp_id} in project ${project} by ${allocated_by}`);
        }

        return response.responseSuccess(res, insertedRows);

    } catch (err) {
        writeLog(`Error in handleResource: ${err.message}`, "error");
        return response.responseException(res, err, 'handleResource');
    }
};

module.exports = { handleResource };
