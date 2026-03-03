/**
 * ==========================================================
 * File        : emailSender.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Service to send emails using nodemailer
 * ==========================================================
 */
const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// Load environment variables
const {
  SMTP_SERVER,
  SMTP_PORT,
  SMTP_EMAIL,
  SMTP_PASSWORD,
  MAIL_SUBJECT,
  HTML_PATH,
  HTML_FORGOT_PASSWORD
} = process.env;

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_SERVER,
  port: SMTP_PORT,
  secure: false, // TLS
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD
  }
});

/**
 * Send Username & Password Email
 */
async function sendUsernameEmail(to, password, username) {
  try {
    const templatePath = path.resolve(HTML_PATH);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template not found: ${templatePath}`);
    }

    let htmlData = fs.readFileSync(templatePath, "utf-8");
    const htmlContent = htmlData
      .replace(/{username}/g, username) 
      .replace(/{password}/g, password);

    const info = await transporter.sendMail({
      from: SMTP_EMAIL,
      to,
      subject: MAIL_SUBJECT,
      html: htmlContent
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (err) {
    console.error("Error in sendUsernameEmail:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send OTP to mail
 */
async function sendOtpEmail(to, otp) {
  try {
    const templatePath = path.resolve(HTML_FORGOT_PASSWORD);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template not found: ${templatePath}`);
    }

    let htmlData = fs.readFileSync(templatePath, "utf-8");
    const htmlContent = htmlData.replace(/{otp}/g, otp);

    const info = await transporter.sendMail({
      from: SMTP_EMAIL,
      to,
      subject: "Password Reset OTP - HR Management System",
      html: htmlContent
    });

    console.log("OTP Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (err) {
    console.error("Error in sendOtpEmail:", err.message);
    return { success: false, error: err.message };
  }
}



module.exports = { sendUsernameEmail,sendOtpEmail};
