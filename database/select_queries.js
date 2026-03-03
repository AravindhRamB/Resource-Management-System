/**
 * ==========================================================
 * File        : select_queries.js
 * Author      : Aravindh Ram
 * Created On  :
 * Description : Database select queries module
 * ==========================================================
 */

const userdetails = `SELECT * FROM users_details WHERE username = $1;`;

const resetPassword = `SELECT * FROM users_details WHERE username = $1`;

const checkNewUserStatus = `SELECT emp_id, username, new_user 
                            FROM users_details WHERE emp_id = $1;`;

const permission = `
      SELECT r.access_permission
      FROM roles r
      INNER JOIN users_details ud ON ud.designation::int = r.id
      WHERE ud.emp_id = $1;
    `;

const rolelist = `SELECT DISTINCT id as value, role_title as label
FROM roles
ORDER BY id ASC;`;

const managerlist = `SELECT 
    r.role_title AS designation,
    ed.emp_id AS id,
    (ed.first_name || ' ' || ed.last_name) AS label
FROM employees_details ed
INNER JOIN roles r
    ON ed.designation = r.id
where r.id =2 ;`;

const roletypeList = `SELECT 
DISTINCT id as value, role_title as label
FROM roles_type rt 
ORDER BY id ASC;`;

const project_list = `Select 
project_list as value,
project_list as label
from project_list order by id ASC;`;

const category_list = `Select id as value,category_list as label 
from reimbursement_category_list order by id ASC;`;

const task_list = `Select id as value,task_title as label 
from task order by id ASC`;

const emp_list = `SELECT 
    id,
    ed.emp_id as value,
    (ed.first_name || ' ' || ed.last_name) AS label
FROM employees_details ed;`;

const employee_list = `SELECT 
    ed.id,
    ed.date_of_join as "dateOfJoin",
    r.role_title AS designation,
    ed.emp_id AS "EmpId",
    (ed.first_name || ' ' || ed.last_name) AS "Name"
FROM employees_details ed
INNER JOIN roles r
    ON ed.designation = r.id;`;

const holidayList = `select id,year,holiday_list
from holiday_list hl 
where hl.year=$1;`;

const claimNoList = `select distinct
        rc.claim_number as "value",
        rc.claim_number as "label"
    from reimb_claims rc
    where ($1 = 'all' or rc.emp_id = $1);`;

const summaryReimb = `
  select
      rc.id as "claimId" ,
      ce.id as "expenseId", 
      ca.id as "attachmentId",
      rc.claim_number AS "claimNo",
      rc.project AS "projectProspect",
      rc.place_of_visit AS "place",
      rc.emp_id,
      rc.flag_verify AS "flagVerify",
      ce.category,
      ce.bill_raised_date AS "dateOfRaised",
      ce.bill_date AS "billDate",
      ce.paid_to AS "paidTo",
      ce.customer,
      ce.currency,
      ce.advance_paid::INT AS "advance",
      ce.amount ::INT AS "amount",
      ca.file_name AS "fileName",
      ca.file_path AS "attachment",
      ca.file_type AS "attachmentType"
  FROM reimb_claims rc
  JOIN claim_expenses ce ON rc.id = ce.claim_id
  LEFT JOIN claim_attachments ca ON ce.id = ca.expense_id
  WHERE rc.emp_id = $1
    AND rc.flag_verify = true;`;

const reimStatus = `
  SELECT
    rc.id AS "key",
    MIN(ce.advance_paid)::INT AS "advance",                     
    to_char(MIN(ce.bill_raised_date), 'DD-MM-YYYY') AS "dateRaised",
    rc.project,
    rc.place_of_visit AS "place",
    rc.claim_number AS "claimNo",
    rc.approvals as "status",
    rc."comments" 
FROM reimb_claims rc
INNER JOIN employees_details ed ON ed.emp_id = rc.emp_id
INNER JOIN claim_expenses ce ON rc.id = ce.claim_id
WHERE rc.flag_verify = false
and rc.emp_id =$1
GROUP BY rc.id, rc.claim_number, rc.project, rc.place_of_visit, ed.first_name, ed.last_name
ORDER BY rc.created_on DESC;`;

const financeReimb = `
    SELECT
    ed.first_name || ' ' || ed.last_name AS "name",          -- claimant
    rc.claim_number AS "claimNo",
    rc.project AS "projectProspect",
    rc.place_of_visit AS "place",
    rc.comments,
    rc.approvals,
    ce.bill_raised_date AS "dateOfRaised",
    ce.bill_date AS "billDate",
    ce.paid_to AS "paidTo",
    ce.category,
    ce.advance_paid::INT AS "advance",
    ce.currency,
    ce.amount::INT AS amount,
    ca.file_path AS "attachment",
    approver.first_name || ' ' || approver.last_name AS "approverName"  
FROM hrms.reimb_claims rc
JOIN hrms.employees_details ed 
    ON rc.emp_id = ed.emp_id
JOIN hrms.claim_expenses ce 
    ON rc.id = ce.claim_id
LEFT JOIN hrms.claim_attachments ca 
    ON ce.id = ca.expense_id
LEFT JOIN hrms.employees_details approver   -- extra join for approver
    ON rc.approver_id = approver.emp_id
WHERE ce.bill_raised_date BETWEEN $1 AND $2
  AND ($3::text IS NULL OR rc.emp_id = $3)
  AND ($4::text IS NULL OR rc.approvals = $4)
  AND ($5::text IS NULL OR rc.claim_number=$5);
`;

const month = `SELECT month_name FROM months WHERE id = $1;`;

const timeSummary = `
SELECT 
  tj.emp_id,
  TO_CHAR(tj.uploaded_at, 'YYYY-MM-DD') AS created_at,
  tj."year",
  tj.month_id,
  ARRAY_AGG(DISTINCT tj.project ORDER BY tj.project) AS project,
    TO_CHAR(
    SUM(EXTRACT(EPOCH FROM tj.hours_spent) / 3600), 
    'FM999999990.00'
  ) AS hours_spent
FROM timesheets tj
WHERE tj.emp_id = $1
  AND DATE(tj.uploaded_at) >= DATE($2::timestamp)
  AND DATE(tj.uploaded_at) <= DATE($3::timestamp)
GROUP BY TO_CHAR(tj.uploaded_at, 'YYYY-MM-DD'), tj.emp_id, tj."year", tj.month_id
ORDER BY tj."year" DESC, tj.month_id DESC, created_at DESC;
`;

const timesheetDownload = `
SELECT 
tj.id,tj.emp_id,tj.created_at,tj."year",tj.month_id,
project,task,status_per_task,task_description,deliverables,
hours_spent,attachments,comments
FROM timesheets tj
WHERE 
tj.emp_id =$1
and tj.month_id =EXTRACT(MONTH FROM TO_DATE($2, 'YYYY-MM'));`;

const timesheetAdminFlexible = `
SELECT 
  ed.first_name || ' ' || ed.last_name AS name,
  to_char(
    to_timestamp(tj.created_at) AT TIME ZONE 'Asia/Kolkata',
    'YYYY-MM-DD'
  ) AS date,
  tj.project,
  tj.task,
  tj.status_per_task AS status,
  tj.task_description AS description,
  tj.deliverables,
  tj.hours_spent
FROM hrms.timesheets tj
JOIN hrms.employees_details ed 
  ON tj.emp_id = ed.emp_id
WHERE tj.uploaded_at >= $2
  AND tj.uploaded_at < $3
  AND tj.approver_id = $4
  AND (
        $1 = 'ALL' OR tj.emp_id = $1
      )
  AND tj.status='PENDING'
ORDER BY tj.uploaded_at DESC;
`;

const timesheetFinanceSummary = `SELECT 
    tj.id,
    tj.emp_id as "empId",
    e.first_name || ' ' || e.last_name AS "name",
    a.first_name || ' ' || a.last_name AS "approver",
    tj.status
FROM timesheets tj
INNER JOIN employees_details e 
    ON e.emp_id = tj.emp_id
LEFT JOIN employees_details a 
    ON a.emp_id = tj.approver_id
where 
tj.month_id = EXTRACT(MONTH FROM TO_DATE($1, 'YYYY-MM'))`;

const timesheetPopupData = `
SELECT
  to_char(
    to_timestamp(tj.created_at) AT TIME ZONE 'Asia/Kolkata',
    'YYYY-MM-DD'
  ) AS date,
  tj.project,
  tj.task,
  tj.status_per_task AS status,
  tj.task_description AS "taskDescription",
  tj.deliverables,
  TO_CHAR(tj.hours_spent::interval, 'HH24:MI:SS') AS hours_spent,
  tj.attachments
FROM timesheets tj
WHERE tj.id = $1
  AND tj.month_id = EXTRACT(MONTH FROM TO_DATE($2, 'YYYY-MM'))
  AND tj.emp_id = $3
ORDER BY tj.created_at ASC;
`;

const timesheetSummaryPopup = `
SELECT 
  tj.id,
  tj.project,
  tj.task,
  tj.deliverables AS activity,
  tj.task_description,
  tj.attachments,
  TO_CHAR(
    EXTRACT(EPOCH FROM tj.hours_spent) / 3600, 
    'FM999999990.00'
  ) AS hours_spent,
  tj.status_per_task,
  tj.status AS approval_status
FROM timesheets tj
WHERE tj.emp_id = $1
  AND DATE(tj.uploaded_at) = DATE($2::timestamp)
ORDER BY tj.id ASC;`;

const emp_by_designation_type = `
    SELECT 
        rt.role_title AS designation_type,
        COUNT(*) AS total_employees
    FROM employees_details ed
    JOIN roles_type rt ON ed.designation_type = rt.id
    GROUP BY rt.role_title;
`;

const emp_by_department = `
    SELECT 
        r.role_title AS department,
        COUNT(*) AS total_employees
    FROM employees_details ed
    JOIN roles r ON ed.designation = r.id
    GROUP BY r.role_title;
`;

const emp_by_gender = `
    SELECT 
    gender,
    COUNT(*) AS total_employees
FROM employees_details
WHERE EXTRACT(YEAR FROM date_of_join) BETWEEN $1 AND $1
GROUP BY gender;
`;

const emp_yearly_analysis = `
WITH months AS (
    SELECT generate_series(
        make_date($1::int, 1, 1),       
        make_date($2::int, 12, 1),      
        interval '1 month'
    ) AS month
)
SELECT 
    TO_CHAR(m.month, 'Mon') AS month,
    EXTRACT(YEAR FROM m.month) AS year,
    COUNT(e.id) AS emp_count
FROM months m
LEFT JOIN employees_details e
    ON e.date_of_join::date <= m.month
LEFT JOIN employee_offboard o
    ON o.emp_id = e.emp_id
   AND o.exit_date::date < m.month
WHERE (o.id IS NULL OR o.exit_date >= m.month)
GROUP BY m.month
ORDER BY m.month;
`;

const emp_data_by_department = `WITH months AS (
    SELECT generate_series(
        make_date($1::int, 1, 1),       
        make_date($1::int, 12, 1),      
        interval '1 month'
    ) AS month
)
SELECT 
    TO_CHAR(m.month, 'Mon') AS month,
    r.role_title AS department,
    COUNT(e.id) AS emp_count
FROM months m
LEFT JOIN .employees_details e
    ON e.date_of_join <= m.month
LEFT JOIN .employee_offboard o
    ON o.emp_id = e.emp_id
   AND o.exit_date < m.month
LEFT JOIN .roles r
    ON r.id = e.designation
WHERE (o.id IS NULL OR o.exit_date >= m.month)
GROUP BY m.month, r.role_title
ORDER BY m.month, r.role_title;`;

const emp_by_employment_type = `
WITH months AS (
    SELECT generate_series(
        make_date($1::int, 1, 1),      
        make_date($1::int, 12, 1),      
        interval '1 month'
    ) AS month
)
SELECT 
    TO_CHAR(m999999.3month, 'Mon') AS month,
    dt.role_title AS employment_type,
    COUNT(e.id) AS emp_count
FROM months m
LEFT JOIN .employees_details e
    ON e.date_of_join <= m.month
LEFT JOIN .employee_offboard o
    ON o.emp_id = e.emp_id
   AND o.exit_date < m.month
LEFT JOIN .roles_type dt
    ON dt.id = e.designation_type
WHERE (o.id IS NULL OR o.exit_date >= m.month)
GROUP BY m.month, dt.role_title
ORDER BY m.month, dt.role_title;
`;

const emp_per_state = `
SELECT 
    place_of_birth AS state,
    COUNT(*) AS count 
FROM employees_details
WHERE EXTRACT(YEAR FROM date_of_join) BETWEEN $1 AND $1
GROUP BY place_of_birth;`;

const adminReimb = `SELECT
    rc.id AS "key",
    MIN(ce.advance_paid)::INT AS "advance",  
    (ed.first_name || ' ' || ed.last_name) AS "name",                    
    to_char(MIN(ce.bill_raised_date), 'DD-MM-YYYY') AS "dateRaised",
    rc.project,
    rc.place_of_visit AS "place",
    rc.claim_number AS "claimNo"
FROM reimb_claims rc
INNER JOIN employees_details ed ON ed.emp_id = rc.emp_id
INNER JOIN claim_expenses ce ON rc.id = ce.claim_id
WHERE rc.flag_verify = false
  AND rc.approvals = 'PENDING'
GROUP BY rc.id, rc.claim_number, rc.project, rc.place_of_visit, ed.first_name, ed.last_name
ORDER BY rc.created_on DESC;`;

const claimReimb = `SELECT 
    ce.claim_id,
    to_char(ce.bill_raised_date, 'DD-MM-YYYY') AS "dateOfRaised",
    to_char(ce.bill_date, 'DD-MM-YYYY') AS "billDate",
    ce.paid_to AS "paidTo",
    ce.category,
    ce.advance_paid::INT AS "advance",
    ce.currency,
    ce.amount::INT AS "amount",
    ca.file_name AS "fileName",
    ca.file_path AS "attachment",
    ca.file_type AS "attachmentType"
FROM claim_expenses ce
LEFT JOIN claim_attachments ca ON ce.id = ca.expense_id
WHERE ce.claim_id =$1;`;

// Leave apply and managment
const leaveList = `SELECT lt.id as value, lt.leave_code , lt.leave_name as "label"
FROM leave_types lt
JOIN leave_policies lp ON lt.id = lp.leave_type_id
JOIN employees_details e ON e.designation_type  = lp.employee_type_id
WHERE e.emp_id = $1
AND (lp.gender IS NULL OR lp.gender = e.gender);`;

const totalDaysQuery = `SELECT ($2::date - $1::date + 1) AS total_days`;

const balanceQuery = `
  SELECT allocated, used, carried_forward, (allocated - used) AS remaining
  FROM leave_balances
  WHERE emp_id = $1 
    AND leave_type_id = $2
    AND year = EXTRACT(YEAR FROM CURRENT_DATE);
`;

const balanceList = `SELECT lt.leave_name ,lb.remaining 
FROM leave_balances lb
join leave_types lt on lt.id =lb.leave_type_id 
WHERE lb.emp_id = $1
AND lb.year = EXTRACT(YEAR FROM CURRENT_DATE);`;

const approveList = `SELECT 
       lr.id,
       e.first_name || ' ' || e.last_name AS "Name",
       lt.leave_name as "LeaveType",
       lr.start_date || ' to ' || lr.end_date AS "Date",
       lr.reason ,
       lr.severity,
       lr.duration ,
       lr.file_path as "attachment"
FROM leave_requests lr
JOIN employees_details e ON e.emp_id = lr.emp_id
JOIN leave_types lt ON lt.id = lr.leave_type_id
WHERE lr.status = 'PENDING'
  AND lr.approver_id = $1;`;

const leaveStatus = `select 
    to_char(lr.start_date,'DD-MM-YYYY') || ' to ' || to_char(lr.end_date,'DD-MM-YYYY') AS "date",
    lr.status,
    lr.comments as "reason",
    lt.leave_name as "leaveType" 
from leave_requests lr
join leave_types lt
    on lt.id = lr.leave_type_id
where lr.emp_id = $1;`;

const leaveSummary = `SELECT 
        e.first_name || ' ' || e.last_name AS "Name",
        TO_CHAR(lr.start_date, 'DD-MM-YYYY') || ' to ' || TO_CHAR(lr.end_date, 'DD-MM-YYYY') AS "Duration",
        lt.leave_name as "LeaveType",
        lr.status as "Status",
        a.first_name || ' ' || a.last_name AS "ApproverName"
    FROM leave_requests lr
    JOIN leave_types lt
        ON lt.id = lr.leave_type_id
    JOIN employees_details e
        ON e.emp_id = lr.emp_id
    LEFT JOIN employees_details a
        ON a.emp_id = lr.approver_id`;

//Attendence Query

const attendenceData = `SELECT
        CASE
            WHEN check_in_time IS NOT NULL AND check_out_time IS NULL THEN 'running'
            WHEN check_in_time IS NOT NULL AND check_out_time IS NOT NULL THEN 'stopped'
            ELSE 'idle'
        END AS status,
        CASE
            -- Running: return the check-in time (ISO 8601 for frontend timer start)
            WHEN check_in_time IS NOT NULL AND check_out_time IS NULL THEN to_char(check_in_time AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
            -- Stopped: return the calculated duration (HH:MI:SS)
            WHEN check_in_time IS NOT NULL AND check_out_time IS NOT NULL THEN TO_CHAR(hours_spent, 'HH24:MI:SS')
            ELSE NULL
        END AS "timeValue"
    FROM employee_attendance ea
    WHERE ea.emp_id = $1
    AND attendance_date::date = CURRENT_DATE;`;

const attendenceView = `SELECT 
                e.first_name || ' ' || e.last_name AS "name",
                to_char(ea.check_in_time AT TIME ZONE 'Asia/Kolkata', 'HH24:MI:SS') AS check_in_time,
                to_char(ea.check_out_time AT TIME ZONE 'Asia/Kolkata', 'HH24:MI:SS') AS check_out_time,
                to_char(
                    (ea.check_out_time - ea.check_in_time),
                    'HH24:MI:SS'
                ) AS hours_spent,
                ea.remarks,
                to_char((ea.attendance_date),'YYYY-MM-DD') AS date
            FROM employee_attendance ea
            JOIN employees_details e ON e.emp_id = ea.emp_id
            WHERE ea.attendance_date BETWEEN $1 AND $2`;

const empAttendenceView = `
SELECT 
    e.first_name || ' ' || e.last_name AS "name",
    to_char(ea.check_in_time AT TIME ZONE 'Asia/Kolkata', 'HH24:MI:SS') AS check_in_time,
    to_char(ea.check_out_time AT TIME ZONE 'Asia/Kolkata', 'HH24:MI:SS') AS check_out_time,
    to_char(
        (ea.check_out_time - ea.check_in_time),
        'HH24:MI:SS'
    ) AS hours_spent,
    ea.remarks,
    to_char((ea.attendance_date),'YYYY-MM-DD') AS date
FROM employee_attendance ea
JOIN employees_details e ON e.emp_id = ea.emp_id
WHERE ea.attendance_date BETWEEN $1 AND $2
AND ea.emp_id = $3;
`;

// resource allocation

const getResource = `select 
created_at,project_name,allocated_by,task_description,
allocated_hours,start_date,deadline_date
from resource_allocations ra 
where ra.emp_id =$1;`;

// Profile queries
const empProfileDetails = `SELECT * FROM employees_details WHERE emp_id = $1;`;

const empBankDetails = `SELECT * FROM emp_bank_details WHERE emp_id = $1;`;

const empEducatioDetails = `SELECT * FROM emp_education WHERE emp_id = $1;`;

const empHistoryDetails = `SELECT * FROM employee_history WHERE emp_id = $1;`;

const empDocumentDetails = `SELECT * FROM emp_documents WHERE emp_id = $1;`;

const getConfig = `select id,access_permission
from roles r where r.id =$1;`;

const getallResources = `
 WITH timesheet_sum AS (
    SELECT 
        emp_id,
        project AS project_name,
        SUM(hours_spent::interval) AS total_hours_spent
    FROM timesheets
    WHERE uploaded_at::date BETWEEN $2 AND $3
    GROUP BY emp_id, project
)
SELECT 
    ra.project_name,
    ra.emp_id,
    ed.first_name || ' ' || ed.last_name AS employee_name,
    r.role_title,
    -- allocated hours in HH:MM:SS
    TO_CHAR(SUM(ra.allocated_hours::interval), 'HH24:MI:SS') AS allocated_hours,
    -- total spent hours in HH:MM:SS
    COALESCE(
        TO_CHAR(ts.total_hours_spent, 'HH24:MI:SS'),
        '00:00:00'
    ) AS total_hours_spent
FROM resource_allocations ra
LEFT JOIN timesheet_sum ts
    ON ra.emp_id = ts.emp_id 
   AND ra.project_name = ts.project_name
JOIN employees_details ed ON ra.emp_id = ed.emp_id
JOIN roles r ON ed.designation = r.id
WHERE ra.project_name = $1
  AND ra.start_date >= $2
  AND ra.deadline_date <= $3
GROUP BY 
    ra.project_name,
    ra.emp_id,
    ed.first_name,
    ed.last_name,
    r.role_title,
    ts.total_hours_spent
ORDER BY ra.emp_id;
`;


const resourceAllocated = `
SELECT ra.task_description as label, ra.task_description as value
FROM resource_allocations ra
LEFT JOIN timesheets ts
    ON ts.emp_id = ra.emp_id
    AND ts.project = ra.project_name
WHERE ra.emp_id =$1    
  AND ra.project_name = $2
  AND (
        ts.id IS NULL         
        OR ts.status_of_task = false  
      );`;



const employeeResources = `
select ra.emp_id, (ed.first_name || ' ' || ed.last_name) AS employee_name, r.role_title, 
TO_CHAR((ra.allocated_hours)::time, 'HH24:MI') AS allocated_hours, t.hours_spent
from resource_allocations ra 
join timesheets t on ra.emp_id = t.emp_id and ra.project_name = t.project
join employees_details ed on ra.emp_id = ed.emp_id 
join roles r on ed.designation = r.id 
where ra.emp_id = $1 and project_name = $2 and start_date >= $3 and deadline_date <= $4;`;

const getUserByEmail = `
  SELECT ed.emp_id, ud.username, ed.email 
  FROM employees_details ed
  INNER JOIN users_details ud ON ed.emp_id = ud.emp_id
  WHERE ed.email = $1;
`;

const getValidOTP = `SELECT email, reset_otp FROM employees_details WHERE email = $1 AND reset_otp = $2;`;

const getUserWithUsername = `
  SELECT ed.emp_id, ud.username, ed.email 
  FROM employees_details ed
  INNER JOIN users_details ud ON ed.emp_id = ud.emp_id
  WHERE ed.email = $1;
`;

const resourcePopup = `SELECT 
  TO_CHAR(ra.start_date, 'DD-MM-YYYY') AS start_date,
  TO_CHAR(ra.deadline_date, 'DD-MM-YYYY') AS end_date,
  ra.task_description AS subtask,
  COALESCE(tj.deliverables, '') AS task_description,
  TO_CHAR(tj.hours_spent::interval, 'HH24:MI:SS') AS hours_spent
FROM resource_allocations ra
left JOIN timesheets tj
  ON tj.emp_id = ra.emp_id
 AND tj.project = ra.project_name
WHERE
  ra.emp_id = $1
  AND ra.project_name = $2
  AND ra.start_date >= $3::date
  AND ra.deadline_date <= $4::date
ORDER BY
  ra.start_date DESC,
  tj.task,
  tj.subtask;

`;

  

module.exports = {
  userdetails,
  resetPassword,
  checkNewUserStatus,
  permission,
  emp_list,
  holidayList,
  managerlist,
  employee_list,
  rolelist,
  roletypeList,
  task_list,
  project_list,
  category_list,
  claimNoList,
  summaryReimb,
  reimStatus,
  claimReimb,
  financeReimb,
  month,
  timeSummary,
  timesheetDownload,
  emp_by_designation_type,
  emp_by_department,
  emp_by_gender,
  emp_yearly_analysis,
  emp_data_by_department,
  emp_by_employment_type,
  adminReimb,
  timesheetAdminFlexible,
  timesheetFinanceSummary,
  timesheetPopupData,
  timesheetSummaryPopup,
  leaveList,
  totalDaysQuery,
  balanceQuery,
  balanceList,
  approveList,
  leaveStatus,
  leaveSummary,
  emp_per_state,
  attendenceData,
  attendenceView,
  empAttendenceView,
  empProfileDetails,
  empBankDetails,
  empEducatioDetails,
  empHistoryDetails,
  empDocumentDetails,
  getResource,
  getConfig,
  getallResources,
  employeeResources,
  getUserByEmail,
  getValidOTP,
  getUserWithUsername,
  resourceAllocated,
  resourcePopup,
};
