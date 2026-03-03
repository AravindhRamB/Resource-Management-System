/**
 * ==========================================================
 * File        : authService.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Service to handle authentication-related tasks
 * ==========================================================
 */
const bcrypt = require('bcrypt');
const query = require('../database/select_queries');
const updateQuery=require('../database/update_queries');
const { getData, executeSQL } = require('../database/db_function');
const { generateToken } = require('../utils/jwt');
const { sendOtpEmail } = require('../services/emailSender');
const { storeOTP, verifyOTP } = require('../utils/otpManager');
const { verifyToken } = require('../utils/jwt');

// User login service
const loginUser = async (username, password) => {
  try {
    // Fetch user details based on username
    const result = await getData(query.userdetails, [username]);

    if (!result || result.length === 0) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const user = result[0];
    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid username or password');
    }

    // Fetch role-based access permissions
    const roleResult = await getData(query.permission, [user.emp_id]);

    // Assuming only one role per user for simplicity
    let accessPermission = null;
    if (roleResult && roleResult.length > 0) {
      accessPermission = roleResult[0].access_permission;
    }

    // Generate JWT token
    const payload = {
      id: user.id,
      username: user.username,
      emp_id: user.emp_id,
      designation: user.designation,
      designation_type:user.designation_type,
      access_permission: accessPermission,
      new_user:user.new_user
    };

    // Generate token
    const token = generateToken(payload);

    return {
      message: 'Login successful',
      token
    };

  } catch (err) {
    throw err;
  }
};

// Verify token and check new user status
const verifyTokenNewUserService = async (token) => {
  try {
    // Verify the token
    const decoded = verifyToken(token);

    if (!decoded) {
      throw new Error('Invalid or expired token');
    }
    // Fetch user details to check new_user status
    const result = await getData(query.checkNewUserStatus, [decoded.emp_id]);

    if (!result || result.length === 0) {
      throw new Error('User not found');
    }
    const user = result[0];
    const isNewUser = user.new_user;
    
    if(isNewUser === true){
      throw new Error('User must complete profile setup');
    }

    const payload = {
      id:decoded.id,
      username:decoded.username,
      emp_id:decoded.emp_id,
      designation:decoded.designation,
      designation_type:decoded.designation_type,
      access_permission:decoded.access_permission,
      new_user:isNewUser
    };

    const newToken = generateToken(payload);
    if(isNewUser === false){
      return {
        success: true,
        message: 'Token is valid and user profile is complete',
        token: newToken
      };
    }
  }
  catch (err) {
    console.error("Token Verification Error:", err.message);
    throw err;
  }
};


// Reset password service
const resetPasswordService = async (username, oldPassword, newPassword) => {
  try {
    // Fetch user details
    const result = await getData(query.resetPassword, [username]);

    if (!result || result.length === 0) {
      throw new Error('User not found');
    }

    // Verify old password
    const user = result[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      throw new Error('Old password is incorrect');
    }

    // Hash new password
    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    const updateResult = await executeSQL(updateQuery.updatePassword,
      [newHashedPassword, username]
    );

    return {
      success: 'Password reset successful',
      user: updateResult[0]
    };

  } catch (err) {
    throw err;
  }
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Forgot password service
const forgotPasswordService = async (email) => {
  try {
    const result = await getData(query.getUserByEmail, [email]);

    if (!result || result.length === 0) {
      throw new Error('No account found with this email address');
    }

    const user = result[0];

    // Generate and store OTP
    const otp = generateOTP();
    await storeOTP(email, otp);

    // Send OTP via email
    const emailResult = await sendOtpEmail(email, otp);

    if (!emailResult.success) {
      throw new Error('Failed to send OTP email');
    }

    return {
      success: true,
      message: 'OTP sent successfully to your email address',
      email: email
    };

  } catch (err) {
    throw err;
  }
};

// Reset password using OTP service
const resetPasswordWithOTPService = async (email, otp, newPassword) => {
  try {
    // Verify OTP
    const isValid = await verifyOTP(email, otp);

    if (!isValid) {
      throw new Error('Invalid or expired OTP');
    }

    // Fetch user details
    const result = await getData(query.getUserWithUsername, [email]);

    if (!result || result.length === 0) {
      throw new Error('User not found');
    }

    // Compare hashed password
    const user = result[0];

    // Hash new password
    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    const updateResult = await executeSQL(updateQuery.updatePassword,
      [newHashedPassword, user.username]
    );

    return {
      success: true,
      message: 'Password reset successful',
      user: updateResult[0]
    };

  } catch (err) {
    throw err;
  }
};

module.exports = { 
  loginUser, 
  resetPasswordService, 
  forgotPasswordService,
  resetPasswordWithOTPService,
  verifyTokenNewUserService
};
