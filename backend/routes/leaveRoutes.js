/**
 * ==========================================================
 * File        : leaveRoutes.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Routes for leave management
 * ==========================================================
 */
const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const storage = multer.memoryStorage();
const upload = multer({ storage });  
const verifyToken = require('../middleware/auth_middleware');
const getlist = require('../controllers/leaveManageCode/leaveList');
const applyRoute = require('../controllers/leaveManageCode/applyLeave');
const balance=require('./../controllers/leaveManageCode/leaveBalance');
const getLeaveApprove=require('./../controllers/leaveManageCode/getApprovalList');
const managerApprove=require('./../controllers/leaveManageCode/managerApprove');
const leaveStatus=require('./../controllers/leaveManageCode/leaveStatus');
const leaveSummary=require('./../controllers/leaveManageCode/leaveSummary')


// Route starts from root
router.get('/leave_list', verifyToken, getlist.getLeave);
router.post('/leave_apply', verifyToken, upload.any(), applyRoute.applyLeave);
router.get('/get_approve',verifyToken,getLeaveApprove.leaveManagerApproval)
router.put('/leave_approve',verifyToken,managerApprove.leaveUpdatedata);
router.get('/leave_balance',verifyToken,balance.getLeaveBalance);
router.get('/leave_status',verifyToken,leaveStatus.getLeaveStatus);
router.get('/leave_summary',verifyToken,leaveSummary.getLeaveSummary);

module.exports = router;