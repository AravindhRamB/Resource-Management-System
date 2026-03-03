/**
 * ==========================================================
 * File        : createUser.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee creation
 * ==========================================================
 */
const bcrypt = require('bcrypt');
const execute_sql = require('../../database/db_function');
const queries = require('../../database/sql_queries');
const response = require('../../utils/resposne_module');
const pass = require('../../controllers/supportCode/passwordCreate');
const { sendUsernameEmail } = require('../../services/emailSender'); 
const generatePassword = require('../../utils/passwordUtils');

// Create new user
async function createUser(req, res) {
    try {
        const { emp_id, username, designation, email, employeeType } = req.body;

        if (!emp_id || !username || !email) {
            return response.responseParamMissing(res);
        }

        // Generate random password
        const password = generatePassword();

        // Hash password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert into DB
        const result = await execute_sql.executeSQL(
            queries.insertUserDetails,
            [emp_id, username, hashedPassword, designation, employeeType] 
        );

        console.log("Insert Query:", queries.insertUserDetails, 
            { emp_id, username, password, designation,employeeType, new_user: true });

        // Send mail with username & password
        const mailStatus = await sendUsernameEmail(email, password, username);

        if (!mailStatus.success) {
            console.error("Mail sending failed:", mailStatus.error);
        }

        // Send created response
        return response.responseCreated(res, {
            success: "User created successfully",
            mailSent: mailStatus.success
        });

    } catch (err) {
        console.error('Error creating user:', err);
        return response.responseException(res, { error: 'Internal Server Error' });
    }
}

module.exports = {
    createUser
};
