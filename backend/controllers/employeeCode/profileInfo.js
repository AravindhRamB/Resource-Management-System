/**
 * ==========================================================
 * File        : profileInfo.js
 * Author      : Aravindh Ram
 * Created On  :
 * Description : Controller to handle employee profile information fetching
 * ==========================================================
 */
const query = require("../../database/select_queries");
const { getData } = require("../../database/db_function");
const response = require("../../utils/resposne_module");
const { writeLog } = require("../../utils/logger");

function isArrayEmpty(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return true;

  return arr.every((item) => {
    if (typeof item !== "object" || item === null) return true;
    return Object.values(item).every(
      (val) => val === null || val === undefined || val === ""
    );
  });
}

// Check if all meaningful fields in the profile data are null/empty
function isProfileDataEmpty(data) {
  const fieldsToIgnore = [
    "appliedForPassport",
    "employmentStatus",
    "declaration",
  ];

  for (const [key, value] of Object.entries(data)) {
    // Skip ignored fields
    if (fieldsToIgnore.includes(key)) continue;

    // Check arrays
    if (Array.isArray(value)) {
      if (!isArrayEmpty(value)) return false;
      continue;
    }

    // Check objects (like profilePicture, documents)
    if (typeof value === "object" && value !== null) {
      const hasValue = Object.values(value).some(
        (v) => v !== null && v !== undefined && v !== ""
      );
      if (hasValue) return false;
      continue;
    }

    // Check primitive values (strings, numbers, etc.)
    // Ignore booleans
    if (typeof value === "boolean") continue;

    if (value !== null && value !== undefined && value !== "") {
      return false;
    }
  }

  return true;
}

// Helper function to format date as MM-DD-YYYY
function formatDate(date) {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d)) return null;
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${month}-${day}-${year}`;
}

// Fetch employee profile details
async function getProfiledetails(req, res) {
  try {
    const emp_id = req.user?.emp_id;
    if (!emp_id) {
      return response.responseBadRequest(res, {
        message: "emp_id is required",
      });
    }

    // Run all queries in parallel
    const [
      employeeDetails,
      bankDetails,
      educationDetails,
      employmentHistory,
      documents,
    ] = await Promise.all([
      getData(query.empProfileDetails, [emp_id]),
      getData(query.empBankDetails, [emp_id]),
      getData(query.empEducatioDetails, [emp_id]),
      getData(query.empHistoryDetails, [emp_id]),
      getData(query.empDocumentDetails, [emp_id]),
    ]);

    if (!employeeDetails || employeeDetails.length === 0) {
      return response.responseNotFound(res, { message: "Employee not found" });
    }

    const e = employeeDetails[0];
    const bank = bankDetails[0] || {};
    const doc = documents[0] || {};

    // --- Build final structured response ---
    const data = {
      salutation: e.salutation,
      first_name: e.first_name,
      middle_name: e.middle_name,
      last_name: e.last_name,
      phone: e.phone,
      email: e.email,
      gender: e.gender,
      father_name: e.father_name,
      mother_name: e.mother_name,
      date_of_birth: formatDate(e.date_of_birth),
      place_of_birth: e.place_of_birth,
      nationality: e.nationality,
      marital_status: e.marital_status,
      area_type: e.area_type,
      country: e.country,
      state: e.state,
      present_address: e.present_address,
      present_address_pincode: e.present_pincode,
      permanent_address: e.permanent_address,
      permanent_address_pincode: e.permanent_address_pincode,
      passport_no: e.passport_no,
      passport_issue_date: formatDate(e.passport_issue_date),
      passport_issue_place: e.passport_issue_place,
      passport_expiry_date: formatDate(e.passport_expiry_date),
      appliedForPassport: e.passport_no ? "yes" : "no",
      date_of_join: formatDate(e.date_of_join),
      declaration: e.declaration === true || e.declaration === "true",
      declaration2: e.declaration2 === true || e.declaration2 === "true",
      declaration3: e.declaration3 === true || e.declaration3 === "true",

      // --- Education Details ---
      educationDetails: (educationDetails || []).map((ed) => ({
        education_level: ed.education_level,
        instituation_name: ed.instituation_name,
        degree: ed.degree,
        course_start_date: ed.course_start_date,
        course_end_date: ed.course_end_date,
        specialization: ed.specialization,
        percentage: ed.percentage,
      })),

      // --- Bank Details ---
      acc_number: bank.acc_number,
      ifsc_code: bank.ifsc_code,
      bank_name: bank.bank_name,
      branch: bank.branch,

      // --- Employment Status ---
      employmentStatus:
        employmentHistory && employmentHistory.length > 0 ? "yes" : "no",

      // --- Previous Employment ---
      previousEmployments: (employmentHistory || []).map((emp) => ({
        prev_employer_name: emp.prev_employer_name,
        prev_emp_id: emp.prev_emp_id,
        periodFrom: formatDate(emp.start_date),
        periodTo: formatDate(emp.end_date),
        designation: emp.designation,
        prev_salary_drawn: emp.prev_salary_drawn,
        duty_description: emp.duty_description,
        prev_address: emp.address,
      })),
      
      // --- Profile Picture (Placeholder) ---
      profilePicture: doc.profile_picture
        ? {

            fileName: doc.profile_picture_name,
            fileType: doc.profile_picture_type,
            filePath: doc.profile_picture,
          }
        : null,

      // --- Documents ---
      sscMarksCard: doc.ssc_marks_card_path
        ? {
            fileName: doc.ssc_marks_card_name,
            fileType: doc.ssc_marks_card_type,
            filePath: doc.ssc_marks_card_path,
          }
        : null,

      hscMarksCard: doc.hsc_marks_card_path
        ? {
            fileName: doc.hsc_marks_card_name,
            fileType: doc.hsc_marks_card_type,
            filePath: doc.hsc_marks_card_path,
          }
        : null,

      degreeCertificate: doc.ug_certificate_path
        ? {
            fileName: doc.ug_certificate_name,
            fileType: doc.ug_certificate_type,
            filePath: doc.ug_certificate_path,
          }
        : null,

      aadharCard: doc.aadhar_card_path
        ? {
            fileName: doc.aadhar_card_name,
            fileType: doc.aadhar_card_type,
            filePath: doc.aadhar_card_path,
          }
        : null,

      panCard: doc.pan_card_path
        ? {
            fileName: doc.pan_card_name,
            fileType: doc.pan_card_type,
            filePath: doc.pan_card_path,
          }
        : null,

      bankDetailsAttachment: doc.bank_details_attachment_path
        ? {
            fileName: doc.bank_details_attachment_name,
            fileType: doc.bank_details_attachment_type,
            filePath: doc.bank_details_attachment_path,
          }
        : null,

      resume: doc.resume_path
        ? {
            fileName: doc.resume_name,
            fileType: doc.resume_type,
            filePath: doc.resume_path,
          }
        : null,

      experienceLetter: doc.experience_letter_path
        ? {
            fileName: doc.experience_letter_name,
            fileType: doc.experience_letter_type,
            filePath: doc.experience_letter_path,
          }
        : null,

      lastThreeMonthsPaySlip: doc.last_three_months_payslip_path
        ? {
            fileName: doc.last_three_months_payslip_name,
            fileType: doc.last_three_months_payslip_type,
            filePath: doc.last_three_months_payslip_path,
          }
        : null,
    };

    writeLog(`Profile data retrieved for ${emp_id}`);

    const finalData = isProfileDataEmpty(data) ? [] : data;

    if (finalData.length === 0) {
      writeLog(`Profile data is empty for ${emp_id}`);
      return response.responseSuccess(res, {});
    }
    return response.responseSuccess(res, {
      success: true,
      message: "Profile details fetched successfully",
      data: finalData,
    });
  } catch (error) {
    writeLog(
      "Error fetching profile details:",
      error?.message || JSON.stringify(error)
    );
    return response.responseException(res, {
      message: error?.message || "Internal Server Error",
    });
  }
}

module.exports = {
  getProfiledetails,
};
