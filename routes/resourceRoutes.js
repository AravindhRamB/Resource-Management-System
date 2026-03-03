/**
 * ==========================================================
 * File        : resourceRoutes.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Routes for resource management
 * ==========================================================
 */
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth_middleware');
const resourceAllocate = require('../controllers/resourceManagementCode/resourceAdd');
const getResourceTask=require('../controllers/resourceManagementCode/getResource');
const getallResourceTask=require('../controllers/resourceManagementCode/getallResources');


//Routes root start here

router.post('/allocate/task', verifyToken,resourceAllocate.handleResource);
router.get('/employee/task',verifyToken,getResourceTask.taskData);
router.get('/tasklist',verifyToken,getResourceTask.employeeResourceAllocated);
router.get('/resourcepopup',verifyToken,getallResourceTask.resourcePopupData);
//chait
router.get('/all/employees/tasks',verifyToken,getallResourceTask.allresourceData);
router.get('/employee/resources',verifyToken,getallResourceTask.employeeResourceData);



module.exports = router;