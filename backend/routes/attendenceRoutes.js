/**
 * ==========================================================
 * File        : attendanceRoutes.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Routes for attendance management
 * ==========================================================
 */
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth_middleware');
const insertAttendence=require('../controllers/attendenceCode/attendanceTrack');
const getTime=require('../controllers/attendenceCode/dailyTrack');


//Routes for attendence
router.post('/insert', verifyToken,insertAttendence.enterAttendence);
router.put('/stop_time',verifyToken,insertAttendence.enterfinalAttendence);
router.get('/get_time',verifyToken,getTime.attendenceData);
router.get('/hr/view_attendence',verifyToken,getTime.attendenceView);
router.get('/employee/view_attendence',verifyToken,getTime.employeeattendenceView);

module.exports = router;