/**
 * ==========================================================
 * File        : userModel.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : User model for database interactions
 * ==========================================================
 */
const { pool } = require('../database/pg_conn');

// Fetch user by username
const getUserByUsername = async (username) => {
  const query = 'SELECT * FROM users_details WHERE username = $1';
  const values = [username];
  const { rows } = await pool.query(query, values);
  return rows[0]; // return user object or undefined
};

module.exports = { getUserByUsername };
