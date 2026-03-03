/**
 * ==========================================================
 * File        : authRoutes.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Routes for authentication
 * ==========================================================
 */
const express = require('express');
const router = express.Router();
const verifyToken = require('.././middleware/auth_middleware');
const { login,verifyTokenNewUser, resetPassword, forgotPassword, resetPasswordWithOTP } = require('../controllers/authController');
const response=require('../utils/resposne_module');
const method=require('../constants/generals');


// Routes for authentication
router.all('/login', (req, res) =>
  req.method === method.POST 
     ? login(req, res) 
     : response.responseWrongMethod(res)
);

router.all('/verify_token',verifyToken,(req, res) =>
  req.method === method.GET
    ? verifyTokenNewUser(req, res)
    : response.responseWrongMethod(res)
);

// Reset password route
router.all('/reset_password',(req,res)=>{
  req.method===method.PUT
  ?resetPassword(req,res)
  :response.responseWrongMethod(res)
})

// Forgot password route
router.all('/forget_password',(req,res)=>{
  req.method === method.POST
  ?forgotPassword(req,res)
  :response.responseWrongMethod(res)
})

// Reset password with OTP route
router.all('/reset_password_with_otp',(req,res)=>{
  req.method === method.POST
  ?resetPasswordWithOTP(req,res)
  :response.responseWrongMethod(res)
})


module.exports = router;
