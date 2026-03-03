/**
 * ==========================================================
 * File        : employeeController.js
 * Author      : Aravindh Ram
 * Created On  :
 * Description : Controller to handle employee operations
 * ==========================================================
 */
const queries = require("../../database/sql_queries");
const update = require("../../database/update_queries");
const execute_sql = require("../../database/db_function");
const response = require("../../utils/resposne_module");
const { saveUploadedFile } = require("../../utils/fileSaver");

// Insert new employee
async function insertEmployee(req, res) {
  let client;
  const savedFiles = []; // Track saved files for cleanup on error

  try {
    const emp_id = req.user.emp_id;
    const designation = req.user.designation;
    const designation_type = req.user.designation_type;

    // Parse form-data text fields
    const data = req.body;

    console.log("Creating employee:", emp_id);

    // --- Validate required fields ---
    if (!data.first_name || !data.email || !data.phone) {
      return response.responseBadRequest(res, "Missing required fields: first_name, email, or phone");
    }

    // --- Save uploaded documents ---
    const uploadedFiles = {};
    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          const savedFile = saveUploadedFile(file, emp_id);
          uploadedFiles[file.fieldname] = savedFile;
          savedFiles.push(savedFile.filePath); // Track for cleanup
        } catch (fileErr) {
          console.error(`Failed to save file ${file.fieldname}:`, fileErr);
          throw new Error(`File upload failed for ${file.fieldname}`);
        }
      }
    }

    // --- Parse JSON fields safely ---
    let educationDetails = [];
    try {
      if (data.educationDetails) {
        educationDetails = JSON.parse(data.educationDetails);
        if (!Array.isArray(educationDetails)) {
          educationDetails = [];
        }
      }
    } catch (err) {
      console.warn("educationDetails parsing failed:", err.message);
      educationDetails = [];
    }

    let previousEmployments = [];
    try {
      if (data.previousEmployments) {
        previousEmployments = JSON.parse(data.previousEmployments);
        if (!Array.isArray(previousEmployments)) {
          previousEmployments = [];
        }
      }
    } catch (err) {
      console.warn("previousEmployments parsing failed:", err.message);
      previousEmployments = [];
    }

    // ========================================
    // START DATABASE TRANSACTION
    // ========================================
    client = await execute_sql.getClient();
    await client.query('BEGIN');

    try {
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
        data.declaration || false,
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
        data.declaration2 || false,
        data.declaration3 || false,
      ];

      await client.query(queries.insertEmployeeDetails, empParams);

      // --- Insert bank details ---
      const bankParams = [
        emp_id,
        data.acc_number || null,
        data.ifsc_code || null,
        data.bank_name || null,
        data.branch || null,
      ];
      await client.query(queries.insertEmployeeBankDetails, bankParams);

      // --- Insert education details ---
      if (Array.isArray(educationDetails) && educationDetails.length > 0) {
        for (const edu of educationDetails) {
          const eduParams = [
            emp_id,
            edu.instituation_name || null,
            edu.degree || null,
            edu.course_start_date || null,
            edu.course_end_date || null,
            edu.percentage || null,
            edu.specialization || null,
            edu.education_level || null,
          ];
          await client.query(queries.insertEmployeeEducation, eduParams);
        }
      }

      // --- Insert previous employments ---
      if (Array.isArray(previousEmployments) && previousEmployments.length > 0) {
        for (const prev of previousEmployments) {
          const prevParams = [
            emp_id,
            prev.prev_employer_name || null,
            prev.prev_emp_id || null,
            prev.periodFrom || null,
            prev.periodTo || null,
            prev.designation || null,
            prev.prev_salary_drawn || null,
            prev.duty_description || null,
            prev.prev_address || null,
          ];
          await client.query(queries.insertEmployeeHistory, prevParams);
        }
      }

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

      await client.query(queries.insertEmployeeDocuments, docParams);

      // --- Mark user as not new ---
      await client.query(update.updateNewUserFlag, [emp_id]);

      // ========================================
      // COMMIT TRANSACTION - All operations succeeded
      // ========================================
      await client.query('COMMIT');

      console.log("Employee created successfully:", emp_id);

      // --- Success ---
      response.responseCreated(res, {
        success: true,
        message: "Employee data inserted successfully",
      });

    } catch (dbError) {
      // ========================================
      // ROLLBACK TRANSACTION - Something failed
      // ========================================
      await client.query('ROLLBACK');
      console.error("Database transaction failed, rolled back:", dbError);
      throw dbError; // Re-throw to outer catch
    }

  } catch (err) {
    // --- ERROR ---
    console.error("Insert Error:", err);

    // ✅ Handle duplicate employee ID error
    if (
      (err.code && err.code === "23505") ||
      (err.message && err.message.includes("duplicate key value"))
    ) {
      return response.responseConflict(res, "Employee ID already exists");
    }

    // ✅ Handle file upload errors
    if (err.message && err.message.includes("File upload failed")) {
      return response.responseBadRequest(res, err.message);
    }

    return response.responseException(res, err, 'insertEmployee');

  } finally {
    // ========================================
    // ALWAYS RELEASE DATABASE CLIENT
    // ========================================
    if (client) {
      client.release();
    }
  }
}

module.exports = { insertEmployee };