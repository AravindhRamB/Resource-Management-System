const queries = require("../../database/update_queries");
const execute_sql = require("../../database/db_function");
const response = require("../../utils/resposne_module");
const { saveUploadedFile } = require("../../utils/fileSaver");

async function updateEmployee(req, res) {
  try {
    const emp_id = req.user.emp_id;
    const designation = req.user.designation;
    const designation_type = req.user.designation_type;

    // Parse form-data text fields
    const data = req.body;

    console.log("Creating employee:", emp_id);

    // ---  Save uploaded documents ---
    const uploadedFiles = {};
    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        uploadedFiles[file.fieldname] = saveUploadedFile(file, emp_id);
      }
    }

    // --- Insert employee details ---
    const empParams = [
      emp_id,
      data.salutation || null,
      data.date_of_join || null,
      data.middleName || null,
      data.first_name || null,
      data.last_name || null,
      data.email || null,
      data.phone || null,
      data.gender || null,
      data.father_name || null,
      data.mother_name || null,
      data.date_of_birth || null,
      data.place_of_birth || null,
      data.marital_status || null,
      data.nationality || null,
      data.passport_no || null,
      data.passport_issue_place || null,
      data.passport_issue_date || null,
      data.passport_expiry_date || null,
      data.declaration || null,
      designation,
      designation_type,
      data.area_type || null,
      data.employmentStatus || null,
      data.country || null,
      data.state || null,
      data.permanent_address || null,
      data.permanent_address_pincode || null,
      data.present_address || null,
      data.present_address_pincode || null,
      data.declaration2,
      data.declaration3,
    ];

    await execute_sql.executeSQL(queries.updateEmployeeDetails, empParams);
    console.log(
      "employee details updated",
      queries.updateEmployeeDetails,
      empParams
    );
    // --- Insert bank details ---
    const bankParams = [
      emp_id,
      data.acc_number || null,
      data.ifsc_code || null,
      data.bank_name || null,
      data.branch || null,
    ];
    await execute_sql.executeSQL(queries.updateEmployeeBankDetails, bankParams);

    console.log(
      "bank details updated",
      queries.updateEmployeeBankDetails,
      bankParams
    );

    // --- Insert education details ---
    let educationDetails = [];
    try {
      educationDetails = JSON.parse(data.educationDetails);
    } catch (err) {
      console.warn("educationDetails parsing failed:", err.message);
    }

    if (Array.isArray(educationDetails)) {
      for (const edu of educationDetails) {
        const eduParams = [
          emp_id,
          edu.instituation_name,
          edu.degree,
          edu.course_start_date,
          edu.course_end_date,
          edu.percentage || null,
          edu.specialization,
          edu.education_level,
        ];
        await execute_sql.executeSQL(
          queries.updateEmployeeEducation,
          eduParams
        );
        console.log(
          "education details updated",
          queries.updateEmployeeEducation,
          eduParams
        );
      }
    }

    // --- Insert previous employments ---
    let previousEmployments = [];
    try {
      previousEmployments = JSON.parse(data.previousEmployments);
    } catch (err) {
      console.warn("previousEmployments parsing failed:", err.message);
    }

    if (Array.isArray(previousEmployments)) {
      for (const prev of previousEmployments) {
        const prevParams = [
          emp_id,
          prev.prev_employer_name,
          prev.prev_emp_id,
          prev.periodFrom,
          prev.periodTo,
          prev.designation,
          prev.prev_salary_drawn || null,
          prev.duty_description,
          prev.prev_address || null,
        ];
        await execute_sql.executeSQL(queries.updateEmployeeHistory, prevParams);
        console.log(
          "previous employment details updated",
          queries.updateEmployeeHistory,
          prevParams
        );
      }
    }

    // --- Insert document paths ---
    // --- Insert document paths, names, and types ---
    const docParams = [
      
      emp_id,
      // ssc
      uploadedFiles["sscMarksCard"]?.filePath || null,
      uploadedFiles["sscMarksCard"]?.fileName || null,
      uploadedFiles["sscMarksCard"]?.fileType || null,

      // hsc
      uploadedFiles["hscMarksCard"]?.filePath || null,
      uploadedFiles["hscMarksCard"]?.fileName || null,
      uploadedFiles["hscMarksCard"]?.fileType || null,

      // ug
      uploadedFiles["degreeCertificate"]?.filePath || null,
      uploadedFiles["degreeCertificate"]?.fileName || null,
      uploadedFiles["degreeCertificate"]?.fileType || null,

      // aadhar
      uploadedFiles["aadharCard"]?.filePath || null,
      uploadedFiles["aadharCard"]?.fileName || null,
      uploadedFiles["aadharCard"]?.fileType || null,

      // pan
      uploadedFiles["panCard"]?.filePath || null,
      uploadedFiles["panCard"]?.fileName || null,
      uploadedFiles["panCard"]?.fileType || null,

      // bank
      uploadedFiles["bankDetailsAttachment"]?.filePath || null,
      uploadedFiles["bankDetailsAttachment"]?.fileName || null,
      uploadedFiles["bankDetailsAttachment"]?.fileType || null,

      // resume
      uploadedFiles["resume"]?.filePath || null,
      uploadedFiles["resume"]?.fileName || null,
      uploadedFiles["resume"]?.fileType || null,

      // experience letter
      uploadedFiles["experienceLetter"]?.filePath || null,
      uploadedFiles["experienceLetter"]?.fileName || null,
      uploadedFiles["experienceLetter"]?.fileType || null,

      // last three months payslip
      uploadedFiles["lastThreeMonthsPaySlip"]?.filePath || null,
      uploadedFiles["lastThreeMonthsPaySlip"]?.fileName || null,
      uploadedFiles["lastThreeMonthsPaySlip"]?.fileType || null,

      // profile picture
      uploadedFiles["profilePicture"]?.filePath || null,
      uploadedFiles["profilePicture"]?.fileName || null,
      uploadedFiles["profilePicture"]?.fileType || null,
     
    ];

    await execute_sql.executeSQL(queries.updateEmployeeDocuments, docParams);
    console.log("Update qury for docmuments" , queries.updateEmployeeDocuments,docParams);

    // ---  Success ---
    response.responseCreated(res, {
      success: true,
      message: "Employee data updated successfully",
    });
  } catch (err) {
    // ---  ERROR ---
    console.error("Insert Error:", err);
    response.responseException(res, err);
  }
}

module.exports = { updateEmployee };
