const { executeSQL } = require("../../database/db_function");
const { writeLog } = require("../../utils/logger");
const response = require("../../utils/resposne_module");
const quries = require('../../database/sql_queries');
const services=require('../../services/coordinatesCalculator');
const updateData=require('../../database/update_queries');

const OFFICE_LAT = parseFloat(process.env.Latitude);
const OFFICE_LONG = parseFloat(process.env.Longitude);


// To handle  stop time
const enterAttendence = async (req, res) => {
    try {
        const empId = req.user.emp_id;
       
        // ... (Input Validation & Distance Check remain the same) ...
        if (!empId) {
            return response.responseUnauthorized(res, {
                success: false,
                message: "Employee ID is required"
            });
    }

    writeLog(`Checking existing attendance for emp_id=${empId}`);

        // Step 1: Check if the employee has already checked in today
        const currentDate = new Date().toISOString().split("T")[0];
       
        // The check should look for an existing record where check_out_time IS NULL
        // (meaning a session is running) OR where check_out_time IS NOT NULL
        // (meaning the session is stopped and cannot be restarted).
        const checkExistingQuery = `
             SELECT check_in_time, check_out_time
             FROM employee_attendance
             WHERE emp_id = $1 AND attendance_date = $2
             LIMIT 1;
        `;

        const existingResult = await executeSQL(checkExistingQuery, [empId, currentDate]);

        if (existingResult.rows.length > 0) {
            const existingRecord = existingResult.rows[0];
           
            if (existingRecord.check_in_time && !existingRecord.check_out_time) {
                // Scenario 1: Already running
                return response.responseSuccess(res, {
                    success: true,
                    message: "Employee already checked in (Running)",
                    status: 'running',
                    timeValue: existingRecord.check_in_time.toISOString(), // Assuming check_in_time is a Date object
                });
            }
           
            if (existingRecord.check_in_time && existingRecord.check_out_time) {
                // Scenario 2: Already stopped for the day - DENY RE-ENTRY
                return response.responseSuccess(res, {
                    success: true,
                    message: "Attendance permanently stopped for today. Cannot restart.",
                    status: 'stopped',
                    timeValue: null // We don't return time on start error
                });
            }
        }

        const values = [empId];
       
        // Need to update the RETURNING clause in `insertAttendence` to get the check_in_time
        const insertAttendence = `
             INSERT INTO employee_attendance
             (emp_id)
             VALUES ($1)
             RETURNING check_in_time; -- RETURNING the actual check-in time
        `;
        const result = await executeSQL(insertAttendence, values);

        return response.responseCreated(res, {
            success: true,
            message: "Attendance started successfully",
            status: 'running', // New status field
            timeValue: result.rows[0].check_in_time.toISOString(), // New timeValue field (ISO start time)
        });

    } catch (err) {
        writeLog("Error in enterAttendence:", err);
        return response.responseException(res, err);
    }
};



const enterfinalAttendence = async (req, res) => {
    try {
        const empId = req.user.emp_id;

        // ... (Input Validation & Distance Check remain the same) ...
if (!empId) {
      return response.responseUnauthorized(res, {
        success: false,
        message: "Employee ID is required"
      });
    }

        // We must check if the user is currently 'running' before stopping
        const checkRunningQuery = `
            SELECT check_in_time FROM employee_attendance
            WHERE emp_id = $1 AND attendance_date = CURRENT_DATE AND check_out_time IS NULL;
        `;
        const runningCheck = await executeSQL(checkRunningQuery, [empId]);

        if (runningCheck.rows.length === 0) {
             return response.responseNotFound(res, {
                success: false,
                message: "No active attendance session found for today"
            });
        }

        const values = [empId];
       
        // The `updateAttendanceDaily` query is correct, but we'll use a local version
        // to simplify the flow and ensure we get the time format we need.
        const finalUpdateQuery = `
            UPDATE employee_attendance
            SET
                check_out_time = NOW()
            WHERE emp_id = $1
                AND attendance_date = CURRENT_DATE
                AND check_out_time IS NULL
            RETURNING hours_spent;
        `;
        const result = await executeSQL(finalUpdateQuery, values);

        if (result.rows.length === 0) {
            // This happens if the user was already checked out (rare, due to the check above)
            return response.responseNotFound(res, {
                success: false,
                message: "Attendance already stopped or not found."
            });
        }

        // --- Time Formatting Logic (Kept the same, but result is assigned to formattedTime) ---
        const interval = result.rows[0].hours_spent;
        let formattedTime;

        if (typeof interval === "object" || typeof interval === "string") {
            // Logic to convert interval (object or string) into HH:MM:SS string
            if (typeof interval === "object") {
                 const totalSeconds =
                     (interval.hours || 0) * 3600 +
                     (interval.minutes || 0) * 60 +
                     (interval.seconds || 0);

                 const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
                 const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
                 const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, "0");

                 formattedTime = `${hours}:${minutes}:${seconds}`;
             } else {
                 formattedTime = interval.split(".")[0];
             }
        } else {
            formattedTime = "00:00:00";
        }
        // ----------------------------------------------------------------------------------


        // Final success response with simplified structure
        return response.responseCreated(res, {
            success: true,
            message: "Attendance stopped successfully",
            status: 'stopped', // New status field
            timeValue: formattedTime, // New timeValue field (Total duration HH:MM:SS)
        });

    } catch (err) {
        writeLog("Error in enterAttendence:", err);
        return response.responseException(res, err);
    }
};

module.exports={
  enterAttendence,
  enterfinalAttendence
}
