/**
 * ==========================================================
 * File        : employeeAnalysis.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee analysis fetching
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module');
const { writeLog } = require("../../utils/logger");

// Fetch Employee Analysis Data
async function EmpAnalysis(req, res) {
    try {
        writeLog("Fetching Employee Analysis Data");
        const [designationType, department, gender] = await Promise.all([
            getData(query.emp_by_designation_type),
            getData(query.emp_by_department),
            getData(query.emp_by_gender)
        ]);
        // Calculate total employees
        const totalEmployees = designationType.reduce((sum, item) => sum + Number(item.total_employees), 0);
        // Prepare result
        const result = {
            totalEmployees,
            byDesignationType: designationType,
            byDepartment: department,
            byGender: gender
        };

        writeLog("Employee Analysis Data Sent Successfully");
        return response.responseSuccess(res, result);
    } catch (error) { 
        writeLog('Error fetching Employee Analysis:', error);
        return response.responseException(res, { message: error.message || error });
    }
}
// Fetch Yearly Employee Analysis
async function EmpYearlyAnalysis(req, res) {
  try {
    const { start_year, end_year } = req.query; // from UI
    console.log("Received years:", start_year, end_year);
    writeLog(`Fetching Employee Analysis from ${start_year} to ${end_year}`);

    const data = await getData(query.emp_yearly_analysis, [start_year, end_year]);
    console.log("Query:",query.emp_yearly_analysis, [start_year, end_year]);
    // Create month-wise mapping
    const resultMap = {};
    // Transform data
    data.forEach(row => {
      const { month, year, emp_count } = row;
      if (!resultMap[month]) {
        resultMap[month] = { month };
      }
      resultMap[month][year] = Number(emp_count);
    });

    // Convert map → array and ensure months are ordered
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const result = monthOrder
      .filter(m => resultMap[m]) 
      .map(m => resultMap[m]);

    writeLog("Employee Analysis Data Sent Successfully");
    return response.responseSuccess(res, result);

  } catch (error) {
    writeLog("Error fetching Employee Analysis:", error);
    return response.responseException(res, { message: error.message || error });
  }
}



async function EmpDeptAndTypeAnalysis(req, res) {
  try {
    const { year} = req.query;

    writeLog(`Fetching Department & Employment Type Analysis: ${year}`)
    // Run both queries
    const deptData = await getData(query.emp_data_by_department, [year]);

    console.log("Query1:",query.emp_data_by_department, [year]);
    const typeData = await getData(query.emp_by_employment_type, [year]);

    // Transform Department Data
    const deptMap = {};
    deptData.forEach(row => {
      const { month, department, emp_count } = row;
      if (!deptMap[month]) deptMap[month] = { month };
      deptMap[month][department] = Number(emp_count);
    });

    // Transform Employment Type Data
    const typeMap = {};
    typeData.forEach(row => {
      const { month, employment_type, emp_count } = row;
      if (!typeMap[month]) typeMap[month] = { month };
      typeMap[month][employment_type] = Number(emp_count);
    });

    // Ensure month ordering 
    const monthOrder = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const department_data = monthOrder.filter(m => deptMap[m]).map(m => deptMap[m]);
    const employment_type_data = monthOrder.filter(m => typeMap[m]).map(m => typeMap[m]);

    const result= { department_data, employment_type_data };

    writeLog("Department & Employment Type Analysis Sent Successfully");
    return response.responseSuccess(res, result);

  } catch (error) {
  console.error("Actual error:", error);
  writeLog("Error fetching Department & Employment Type Analysis:", error);
  return response.responseException(res, { message: error.message || error });
}

}

async function EmpDemographic(req, res) {
  try {
    writeLog("Fetching Employee Demographic");

    const { year } = req.query;

    const [gender, empPerState] = await Promise.all([
      getData(query.emp_by_gender, [year]),
      getData(query.emp_per_state, [year]),
    ]);

    // Helper function to clean [{}] → []
    const clean = (data) => {
      if (!Array.isArray(data)) return [];
      if (data.length === 0) return [];
      if (data.length === 1 && Object.keys(data[0]).length === 0) return [];
      return data;
    };

    const cleanGender = clean(gender);
    const cleanState = clean(empPerState);

    // If both have no data, return []
    if (cleanGender.length === 0 && cleanState.length === 0) {
      writeLog("No Employee Demographic Data Found");
      return response.responseSuccess(res, []);
    }

    const result = {
      byGender: cleanGender,
      stateData: cleanState
    };

    writeLog("Employee Analysis Data Sent Successfully");
    return response.responseSuccess(res, result);

  } catch (error) {
    writeLog("Error fetching Employee Analysis:", error);
    return response.responseException(res, { message: error.message || error });
  }
}


module.exports = {
    EmpAnalysis,
    EmpYearlyAnalysis,
    EmpDeptAndTypeAnalysis,
    EmpDemographic
};
