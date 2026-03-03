/**
 * ==========================================================
 * File        : notificationRoutes.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Routes for notification management
 * ==========================================================
 */
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth_middleware');
const resourceAllocate = require('../controllers/resourceManagementCode/resourceAdd')


//Routes root start here

router.post('/todo', verifyToken,resourceAllocate.handleResource);
router.post('/events', verifyToken,resourceAllocate.handleResource);

module.exports = router;