/**
 * ==========================================================
 * File        : employeeRoutes.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Routes for employee management
 * ==========================================================
 */
const multer = require("multer");
const express = require('express');
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const verifyToken = require('../middleware/auth_middleware');
const employeeController = require('../controllers/employeeCode/employeeController');
const updateemployeeController = require('../controllers/employeeCode/updateemployeeController');
const employee_list=require('../controllers/employeeCode/employeeList');
const employee_analysis=require('../controllers/employeeCode/employeeAnalysis');
const createUserDetails =require('../controllers/employeeCode/createUser');
const profileDetails=require('../controllers/employeeCode/profileInfo');
const configration=require('../controllers/employeeCode/configration');
const { config } = require("dotenv");


// Route starts from root
router.post('/createUser',verifyToken,createUserDetails.createUser);
router.post('/onboard',verifyToken,upload.any(),employeeController.insertEmployee);
router.put('/profile/update',verifyToken,upload.any(),updateemployeeController.updateEmployee);
router.get('/employee_list',verifyToken,employee_list.getEmpdetails);
router.get('/emp_analysis',verifyToken,employee_analysis.EmpAnalysis);
router.get('/emp_analysis/yearly_data',verifyToken,employee_analysis.EmpYearlyAnalysis);
router.get('/emp_analysis/designation_data',verifyToken,employee_analysis.EmpDeptAndTypeAnalysis);
router.get('/emp_demographic',verifyToken,employee_analysis.EmpDemographic);
router.get('/profile/info',verifyToken,profileDetails.getProfiledetails);
router.put('/configration/page/update',verifyToken,configration.updateEmpConfigration);
router.get('/configration/page/get',verifyToken,configration.getEmpConfigration);

module.exports = router;
