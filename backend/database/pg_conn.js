// ##############################################################################################
// File Name           : pg_conn.js
// Description         : Manages PostgreSQL database connection pooling using configuration from YAML.
// Author              : Aravindh Ram
// Created Date        : 06-AUG-2025
// Last Modified Date  : 
//
// This module initializes and exports a PostgreSQL connection pool using the `pg` library.
// Database credentials and pooling configurations are read from a YAML config file.
//
// Usage:
//     const pool = require('../database/pg_conn');
//     const client = await pool.connect();
// ##############################################################################################

const { Pool } = require('pg');
const { writeLog } = require('../utils/logger');
require('dotenv').config(); // Load from .env

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: parseInt(process.env.MAX_SIZE || '10', 10),
  min: parseInt(process.env.MIN_SIZE || '2', 10),
  idleTimeoutMillis: parseInt(process.env.MAX_INACTIVE_CONNECTION_LIFETIME || '300', 10) * 1000,
  maxUses: parseInt(process.env.MAX_QUERIES || '1000', 10)
});

// Get a connection and set schema (search_path)
const getConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const schema = process.env.DB_SCHEMA || 'public';
    await client.query(`SET search_path TO ${schema}`);
    writeLog(`Database connection established and schema set to "${schema}"`);
    return client;
  } catch (err) {
    writeLog(`ERROR while connecting to database: ${err.message}`, "error");
    if (client) {
      releaseConnection(client);
    }
    // Tag as database connection error
    const dbErr = new Error('Database connection failed');
    dbErr.name = 'DatabaseError';
    dbErr.code = 'DB_CONNECTION_ERROR';
    dbErr.originalError = err;
    throw dbErr;
  }
};

// Release a connection
const releaseConnection = (client) => {
  if (client) {
    writeLog(`Releasing database connection`);
    client.release();
  }
};

writeLog(`PostgreSQL connection pool initialized`);

module.exports = {
  getConnection,
  releaseConnection,
  pool
};
