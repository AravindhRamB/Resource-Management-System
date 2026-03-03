/**
 * ==========================================================
 * File        : update_queries.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Database update queries module
 * ==========================================================
 */
const updateFlag = `
  UPDATE reimb_claims
  SET flag_verify = FALSE
  WHERE emp_id = $1;
`;

const updatePassword=`UPDATE users_details 
       SET password_hash = $1, 
       modified_on = CURRENT_TIMESTAMP 
       WHERE username = $2 
       RETURNING emp_id, username`

const updateClaim=`
    UPDATE reimb_claims 
    SET project = $1, place_of_visit = $2, flag_verify = false
    WHERE id = $3 AND emp_id=$4;
  `;

const updateExpense=`
    UPDATE claim_expenses 
    SET category = $1, bill_date = $2, bill_raised_date = $3,
        paid_to = $4, customer = $5, currency = $6,
        advance_paid = $7, amount = $8
    WHERE id = $9;
  `;

const updateAttachment=`
    UPDATE claim_attachments 
    SET file_name = $1, file_path = $2, file_type = $3
    WHERE id = $4;
  `;

const timesheetUpdateQuery = `
      UPDATE timesheets_json
      SET work_log = work_log || $1::jsonb,
          updated_at = NOW(),
          approver_id=$4
      WHERE emp_id = $2  AND month_id = $3
      RETURNING *
    `;

const updateClaimApproval = `
  UPDATE reimb_claims
  SET approvals = $1, 
  comments = $2,
  approver_id=$4
  WHERE id = $3;
`;

const updateExpenseApproval = `
  UPDATE claim_expenses
  SET approvals = $1
  WHERE id = $2;
`;

const updateAttachmentApproval = `
  UPDATE claim_attachments
  SET approvals = $1
  WHERE id = $2;
`;

const updateBalanceQuery = `
  UPDATE leave_balances
  SET used = used + $1
  WHERE emp_id = $2
    AND leave_type_id = $3
    AND year = EXTRACT(YEAR FROM CURRENT_DATE)
  RETURNING allocated, used, carried_forward, (allocated - used) AS remaining;
`;

const updateleaveApproval=`UPDATE leave_requests lr
SET status = $1,
comments = $4
WHERE lr.id = $2
  AND lr.approver_id = $3;`;

const updateTimesheetApprovalRange = `
  UPDATE timesheets
  SET 
    status = $1,
    comments = $2,
    approver_id = $3,
    updated_at = CURRENT_TIMESTAMP
  WHERE emp_id = $4
    AND uploaded_at::date BETWEEN $5::date AND $6::date
    AND is_present = 'true';
`;



//Update Query for attendence page

const updateAttendanceDaily = `
  UPDATE employee_attendance
  SET 
    check_out_time = NOW(),
    check_out_latitude = $2,
    check_out_longitude = $3,
    is_present = FALSE
  WHERE emp_id = $1
    AND attendance_date = CURRENT_DATE 
  RETURNING hours_spent;
`;


const updateConfig=`UPDATE roles 
SET access_permission = $1 
WHERE id = $2 RETURNING *`


const updateEmployeeDetails = `
  UPDATE employees_details SET
  salutation=$2, date_of_join=$3, middle_name=$4, first_name=$5, last_name=$6,
  email=$7, phone=$8, gender=$9, father_name=$10, mother_name=$11, date_of_birth=$12,
  place_of_birth=$13, marital_status=$14, nationality=$15, passport_no=$16,
  passport_issue_place=$17, passport_issue_date=$18, passport_expiry_date=$19,
  declaration=$20, designation=$21, designation_type=$22, area_type=$23, status=$24,
  country=$25, state=$26, permanent_address=$27, permanent_address_pincode=$28,
  present_address=$29, present_pincode=$30,declaration2=$31,declaration3=$32
WHERE emp_id=$1;`;

const updateEmployeeBankDetails = `
UPDATE emp_bank_details SET acc_number=$2, ifsc_code=$3, bank_name=$4, branch=$5
WHERE emp_id=$1;`;

const updateEmployeeEducation = `
UPDATE emp_education SET
instituation_name=$2, degree=$3, course_start_date=$4, course_end_date=$5,
percentage=$6, specialization=$7, education_level=$8
WHERE emp_id=$1;`;

const updateEmployeeHistory = `
UPDATE employee_history SET
prev_employer_name=$2, prev_emp_id=$3, start_date=$4, end_date=$5,
designation=$6, prev_salary_drawn=$7, duty_description=$8, address=$9
WHERE emp_id=$1;
`;

const updateEmployeeDocuments = `
  UPDATE emp_documents SET
  ssc_marks_card_path=$2, ssc_marks_card_name=$3, ssc_marks_card_type=$4,
  hsc_marks_card_path=$5, hsc_marks_card_name=$6, hsc_marks_card_type=$7,
  ug_certificate_path=$8, ug_certificate_name=$9, ug_certificate_type=$10,
  aadhar_card_path=$11, aadhar_card_name=$12, aadhar_card_type=$13,
  pan_card_path=$14, pan_card_name=$15, pan_card_type=$16,
  bank_details_attachment_path=$17, bank_details_attachment_name=$18, bank_details_attachment_type=$19,
  resume_path=$20, resume_name=$21, resume_type=$22,
  experience_letter_path=$23, experience_letter_name=$24, experience_letter_type=$25,
  last_three_months_payslip_path=$26, last_three_months_payslip_name=$27, last_three_months_payslip_type=$28,
  profile_picture=$29, profile_picture_name=$30, profile_picture_type=$31
WHERE emp_id=$1;`;


const markOTPAsUsed = `
  UPDATE employees_details
  SET reset_otp = NULL
  WHERE email = $1 AND reset_otp = $2
  RETURNING email;
`;


// Update on the user if he is new or not 

const updateNewUserFlag = `
  UPDATE users_details
  SET new_user = FALSE
  WHERE emp_id = $1;
`;

module.exports = {
  updateFlag,
  updatePassword,
  updateClaim,
  updateExpense,
  updateAttachment,
  timesheetUpdateQuery,
  updateClaimApproval,
  updateExpenseApproval,
  updateAttachmentApproval,
  updateBalanceQuery,
  updateleaveApproval,
  updateTimesheetApprovalRange,
  updateAttendanceDaily,
  updateConfig,
  updateEmployeeDetails,
  updateEmployeeBankDetails,
  updateEmployeeEducation,
  updateEmployeeHistory,
  updateEmployeeDocuments,
  markOTPAsUsed,
  updateNewUserFlag
};
