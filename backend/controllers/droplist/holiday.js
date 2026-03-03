/**
 * ==========================================================
 * File        : holiday.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee holiday fetching
 * ==========================================================
 */
const query = require('../../database/select_queries');
const { getData } = require('../../database/db_function');
const response = require('../../utils/resposne_module');
const { writeLog } = require("../../utils/logger");

// Fetch holiday list
async function getHoliday(req, res) {
    try {
        const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

        const result = await getData(query.holidayList, [year]);
        writeLog(`Holiday list fetched for year: ${year}`);

        if (!result || result.length === 0) {
            return response.responseNotFound(res, { message: `No holidays found for year ${year}` });
        }

        // Parse the JSON safely (in case it's stored as a string in DB)
        let holidayData = result[0].holiday_list;
        if (typeof holidayData === 'string') {
            try {
                holidayData = JSON.parse(holidayData);
            } catch (err) {
                writeLog(`Error parsing holiday JSON for year ${year}: ${err.message}`);
                return response.responseException(res, { message: 'Invalid holiday data format in database.' });
            }
        }

        // Ensure the structure is consistent and send it
        const formattedData = holidayData.map(item => ({
            date: item.date,
            day: item.day,
            holiday: item.holiday
        }));

        writeLog("Holiday list sent successfully");
        return response.responseSuccess(res, formattedData);
    } catch (error) {
        writeLog('Error fetching holidays:', error);
        return response.responseException(res, { message: error.message });
    }
}

module.exports = {
    getHoliday
};
