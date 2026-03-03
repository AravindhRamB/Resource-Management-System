/**
 * ==========================================================
 * File        : sql_queries.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Database queries module
 * ==========================================================
 */
const insertUserDetails = `
            INSERT INTO users_details (emp_id, username, password_hash,designation,
            new_user,designation_type)
            VALUES ($1, $2, $3,$4,true,$5)
            RETURNING *`;

const insertEmployeeDetails = `
  INSERT INTO employees_details (
      emp_id, salutation, date_of_join, middle_name, first_name, last_name,
      email, phone, gender, father_name, mother_name, date_of_birth,
      place_of_birth, marital_status, nationality, passport_no,
      passport_issue_place, passport_issue_date, passport_expiry_date,
      declaration, designation, designation_type, area_type, status, country,
      state, permanent_address, permanent_address_pincode, present_address,
      present_pincode,declaration2,declaration3
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,
              $17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32)
  `;

const insertEmployeeBankDetails = `
  INSERT INTO emp_bank_details (
      emp_id, acc_number, ifsc_code, bank_name, branch
    ) VALUES ($1,$2,$3,$4,$5)`;

const insertEmployeeEducation = `
 INSERT INTO emp_education (
      emp_id, instituation_name, degree, course_start_date,
      course_end_date, percentage, specialization, education_level
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;

const insertEmployeeHistory = `
  INSERT INTO employee_history (
      emp_id, prev_employer_name, prev_emp_id,
      start_date, end_date, designation, prev_salary_drawn,
      duty_description, address
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;

const insertEmployeeDocuments = `
  INSERT INTO emp_documents (
    emp_id,
    ssc_marks_card_path, ssc_marks_card_name, ssc_marks_card_type,
    hsc_marks_card_path, hsc_marks_card_name, hsc_marks_card_type,
    ug_certificate_path, ug_certificate_name, ug_certificate_type,
    aadhar_card_path, aadhar_card_name, aadhar_card_type,
    pan_card_path, pan_card_name, pan_card_type,
    bank_details_attachment_path, bank_details_attachment_name, bank_details_attachment_type,
    resume_path, resume_name, resume_type,
    experience_letter_path, experience_letter_name, experience_letter_type,
    last_three_months_payslip_path, last_three_months_payslip_name, last_three_months_payslip_type,
    profile_picture,profile_picture_name,profile_picture_type
  )
  VALUES (
    $1,  -- emp_id
    $2, $3, $4,   -- ssc
    $5, $6, $7,   -- hsc
    $8, $9, $10,  -- ug
    $11, $12, $13, -- aadhar
    $14, $15, $16, -- pan
    $17, $18, $19, -- bank
    $20, $21, $22, -- resume
    $23, $24, $25, -- experience letter
    $26, $27, $28,  -- payslip
    $29, $30, $31  -- profilePicture
  );
`;


// Reimbursement Cliams

const insertClaim = `
  INSERT INTO reimb_claims (project, claim_number, place_of_visit,emp_id,flag_verify) 
  VALUES ($1, $2, $3, $4,True) 
  RETURNING id
`;

// Insert into expenses
const insertExpense = `
  INSERT INTO claim_expenses 
    (claim_id, category, currency, bill_date, paid_to, advance_paid, amount) 
  VALUES ($1,$2,$3,$4,$5,$6,$7) 
  RETURNING id
`;

const insertAttachment = `
  INSERT INTO claim_attachments (expense_id, file_path, file_name, file_type)
  VALUES ($1,$2,$3,$4)
  RETURNING id;
`;


const insertLeaveRequest = `
  INSERT INTO leave_requests 
    (emp_id, leave_type_id, start_date, end_date, reason, status, severity, assistance_needed,approver_id,file_path,duration )
  VALUES ($1, $2, $3, $4, $5, 'PENDING', $6, $7,$8,$9,$10)
  RETURNING *;
`;

const initLeaveBalanceQuery = `
INSERT INTO leave_balances (emp_id, leave_type_id, year, allocated, used, carried_forward)
  SELECT e.emp_id, lp.leave_type_id, EXTRACT(YEAR FROM CURRENT_DATE)::int, lp.accrual_value, 0, 0
  FROM employees_details e
  JOIN roles_type rt ON rt.id = e.designation_type
  JOIN leave_policies lp ON lp.employee_type_id = rt.id
  WHERE e.emp_id = $1
    AND (lp.gender IS NULL OR lp.gender = e.gender)
  ON CONFLICT (emp_id, leave_type_id, year) DO NOTHING;`;


// Insert for attendence

const insertAttendence = `
      INSERT INTO employee_attendance
      (emp_id, latitude, longitude)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;


// Insert timesheet

const insertTimesheet=`INSERT INTO timesheets (
    emp_id,
    approver_id,
    month_id,
    project,
    task,
    status_per_task,
    task_description,
    deliverables,
    hours_spent,
    attachments,
    uploaded_at,
    subtask
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
  RETURNING *;`

// Insert Resource Allocation 
const ResourceinsertQuery = `
            INSERT INTO resource_allocations
                (project_name, emp_id, allocated_by, 
                 task_description, 
                allocated_hours, start_date, deadline_date)
            VALUES
                ($1, $2, $3, $4, $5, $6,$7)
            RETURNING *;
        `;

const insertOTP = `
  UPDATE employees_details
  SET reset_otp = $2
  WHERE email = $1
  RETURNING email, reset_otp;
`;

module.exports = {
  insertUserDetails,
  insertEmployeeDetails,
  insertEmployeeBankDetails,
  insertEmployeeEducation,
  insertEmployeeHistory,
  insertEmployeeDocuments,
  insertClaim,
  insertExpense,
  insertAttachment,
  insertTimesheet,
  insertLeaveRequest,
  initLeaveBalanceQuery,
  insertAttendence,
  ResourceinsertQuery,
  insertOTP
};