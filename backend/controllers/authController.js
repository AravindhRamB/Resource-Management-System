
/**
 * ==========================================================
 * File        : authController.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee authentication
 * ==========================================================
 */
const { loginUser,verifyTokenNewUserService, resetPasswordService, forgotPasswordService, resetPasswordWithOTPService } = require('../services/authService');
const response= require('../utils/resposne_module');

// User login controller
const login = async (req, res) => {
  try {
    // Extract username and password from request body
    const { username, password } = req.body;

    if (!username || !password) {
      return response.responseParamMissing(res);
    }

    const result = await loginUser(username, password);
    return response.responseSuccess(res, result);

  } catch (error) {
    return response.responseUnauthorized(res, error);
  }
};


const verifyTokenNewUser = async(req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"
    
    if (!token) {
      return response.responseParamMissing(res);
    }

    // Call service to verify token and check new_user status
    const result = await verifyTokenNewUserService(token);
    console.log("Token Verification Result:", result);
    
    
    return response.responseSuccess(res, result);

  } catch(error) {
    console.error("Token Verification Error:", error.message);
    
    // Handle invalid or expired token
    if (error.message === 'Invalid or expired token' || error.message === 'User must complete profile setup') {
      return response.responseUnauthorized(res, error);
    }
    
    return response.responseException(res, error, 'verifyTokenNewUser');
  }
};


// Reset password controller
const resetPassword = async (req, res) => {
  try { 
    // Extract necessary fields from request body
    const { username, oldPassword, newPassword, confirmPassword } = req.body;
    console.log(username, oldPassword, newPassword, confirmPassword);

    if (!username || !oldPassword || !newPassword || !confirmPassword) {
      return response.responseParamMissing(res);
    } 

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return response.responseBadRequest(res, { error: "New password and confirm password do not match" });
    }
    console.log("Parameters validated successfully");

    const result = await resetPasswordService(username, oldPassword, newPassword);
    return response.responseSuccess(res, result);

  } catch (error) {
    console.error("Reset Password Error:", error.message);
    if (error.message === 'User not found' || error.message === 'Old password is incorrect') {
      return response.responseUnauthorized(res, error);
    }
    return response.responseException(res, error, 'resetPassword');
  }
};

// Forgot password controller
const forgotPassword = async (req, res) => {
  try {
    // Extract email from request body
    const { email } = req.body;

    if (!email) {
      return response.responseParamMissing(res);
    }

    // Call forgot password service
    const result = await forgotPasswordService(email);
    return response.responseSuccess(res, result);

  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    if (error.message === 'No account found with this email address' || error.message === 'Failed to send OTP email') {
      return response.responseBadRequest(res, error);
    }
    return response.responseException(res, error, 'forgotPassword');
  }
};

// Reset password with OTP controller
const resetPasswordWithOTP = async (req, res) => {
  try {
    // Extract necessary fields from request body
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return response.responseParamMissing(res);
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return response.responseParamMissingMessage(res, { error: "New password and confirm password do not match" });
    }

    // Call reset password with OTP service
    const result = await resetPasswordWithOTPService(email, otp, newPassword);
    return response.responseSuccess(res, result);

  } catch (error) {
    console.error("Reset Password with OTP Error:", error.message);
    if (error.message === 'Invalid or expired OTP' || error.message === 'User not found') {
      return response.responseBadRequest(res, error);
    }
    return response.responseException(res, error, 'resetPasswordWithOTP');
  }
};

module.exports = { 
  login, 
  verifyTokenNewUser,
  resetPassword, 
  forgotPassword, 
  resetPasswordWithOTP 
};
