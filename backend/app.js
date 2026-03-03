/**
 * ==========================================================
 * File        : app.js
 * Author      : Aravindh Ram
 * Created On  : 01-Aug-2025
 * Description : contains all the endpoint redirection
 * ==========================================================
 */

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const verifyToken = require('./middleware/auth_middleware');
const router = express.Router();
const { writeLog } = require("./utils/logger");
const logRequest = require('./middleware/logRequest');
const status=require('./constants/generals')
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');


const role_list =require('./controllers/droplist/roleList');
const role_type = require('./controllers/droplist/roleType')
const projectList=require('./controllers/droplist/projectList');
const managerList=require('./controllers/droplist/managerList')
const reimbCtegory=require('./controllers/droplist/reimbCategoryList');
const claimController=require('./controllers/reimbursementCode/reimbursementController');
const reimbSummary=require('./controllers/reimbursementCode/reimbSummary');
const reimbStatus=require('./controllers/reimbursementCode/reimbStatus');
const financeReimb=require('./controllers/reimbursementCode/financeReimb');
const reimbUpdate=require('./controllers/reimbursementCode/reimbUpdate');
const claimData=require('./controllers/reimbursementCode/claimDetails')
const timesheet=require('./controllers/timesheetCode/timesheetInsert');
const timeSummary=require('./controllers/timesheetCode/timesheetSummary');
const timesheetAdmin=require('./controllers/timesheetCode/timesheetAdminView');
const timesheetApprove=require('./controllers/timesheetCode/timesheetApprove');
const timesheetFinance=require('./controllers/timesheetCode/timesheetfinance');
const timesheetPopup=require('./controllers/timesheetCode/timesheetPopup');
const timesheetDownload=require('./controllers/timesheetCode/timesheetDownload');
const tasklist=require('./controllers/droplist/taskList');
const empList=require('./controllers/droplist/empList');
const adminReimb=require('./controllers/reimbursementCode/adminSummary');
const updateApproval=require('./controllers/reimbursementCode/approvalReimb');
const claimNo=require('./controllers/droplist/claimList');
const holiday=require('./controllers/droplist/holiday');
const attendenceRoutes = require('./routes/attendenceRoutes');
const resourceRoutes = require('./routes/resourceRoutes')
const leave=require('./routes/leaveRoutes');
const notification =require('./routes/notificationRoutes')
const reimbDel=require('./controllers/reimbursementCode/reimbDelete')
// Multer setup (store files in memory, or use diskStorage if needed)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  const response = require('./utils/resposne_module');
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return response.responseBadRequest(res, 'File size too large. Maximum size is 10MB');
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return response.responseBadRequest(res, 'Too many files uploaded');
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return response.responseBadRequest(res, 'Unexpected file field');
    }
    return response.responseBadRequest(res, `File upload error: ${err.message}`);
  }
  
  if (err) {
    return response.responseBadRequest(res, `File upload error: ${err.message}`);
  }
  
  next();
};

dotenv.config();

const app = express();
const path = require('path');
const HOST = process.env.HOST ;
const PORT = process.env.PORT ;

writeLog("Server is starting...", "server");
writeLog("HR Management System API is running...");

app.use(cors());
app.use(express.json());
app.use(logRequest);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));


//Routes to login url
app.use('/api/auth', authRoutes);

//Employee details fill route
app.use('/api/employee',employeeRoutes);

//Drop down and support api's
app.use(router.get('/api/role_list',verifyToken,role_list.getRoles));
app.use(router.get('/api/role_type',verifyToken,role_type.getType));
app.use(router.get('/api/manager_list',verifyToken,managerList.getManager));
app.use(router.get('/api/project_list',verifyToken,projectList.getProject));
app.use(router.get('/api/category_list',verifyToken,reimbCtegory.getCategory));
app.use(router.get('/api/task_list',verifyToken,tasklist.getTask));
app.use(router.get('/api/emp_list',verifyToken,empList.getEmp));
app.use(router.get('/api/holiday_list',verifyToken,holiday.getHoliday));
app.use(router.get('/api/claim_list',verifyToken,claimNo.claimType));


// Apply Reimbursement and the related activites
app.use(router.post('/api/apply_reimbursement',verifyToken,upload.any(),handleMulterError,claimController.createReimbursement));
app.use(router.get('/api/reimb_summary',verifyToken,reimbSummary.reimbSummarydata));
app.use(router.get('/api/reimb_status',verifyToken,reimbStatus.reimbStatusdata));
app.use(router.put('/api/reimb_update',verifyToken,reimbUpdate.reimbUpdatedata));
app.use(router.get('/api/admin_reimb_summary',verifyToken,adminReimb.reimbAdmindata));
app.use(router.get('/api/claim_details',verifyToken,claimData.claimDetails));
app.use(router.put('/api/approvals',verifyToken,updateApproval.updateReimbApproval));
app.use(router.get('/api/finance_summary_reimb',verifyToken,financeReimb.financeSummary));
//app.use(router.delete('/api/reimb_delete',verifyToken,reimbDel.))


// Time sheet api's 
app.use(router.post('/api/timesheet_insert',verifyToken,upload.any(),handleMulterError,timesheet.createTimesheet)); 
app.use(router.get('/api/timesheet/summary',verifyToken,timeSummary.timeSummary));
app.use(router.get('/api/timesheet_summary/popup',verifyToken,timeSummary.timeSummaryPopup));
app.use(router.get('/api/timesheet_admin',verifyToken,timesheetAdmin.timeadminSummary));
app.use(router.put('/api/timesheet_approval',verifyToken,timesheetApprove.timesheetUpdatedata));
app.use(router.get('/api/timesheet/finance_summary',verifyToken,timesheetFinance.timeFinanceSummary));
app.use(router.get('/api/timesheet/popup',verifyToken,timesheetPopup.timesheetPopupData));
app.use(router.get('/api/timesheet/download',verifyToken,timesheetDownload.timedownloadSummary));


// Leave apply and maintanence
app.use('/api/leave',leave);

// Attendance management 
app.use('/api/attendence',attendenceRoutes);

// Resource Management
app.use('/api/resource',resourceRoutes);


app.use('/api/notification',notification);

app.listen(PORT, HOST, () => {
  writeLog(`Server running at http://${HOST}:${PORT}`, "server");
  console.log(`Server is running at http://${HOST}:${PORT}`);
})

console.log("Office Coordinates:", process.env.Latitude, process.env.Longitude);