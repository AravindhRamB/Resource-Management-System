// ##############################################################################################
// File Name           : db_function.js
// Description         : Provides utility functions for common database operations.
// Author              : Aravindh Ram
// Created Date        : 06-AUG-2025
// Last Modified Date  : 
//
// This module contains reusable helper functions for querying, formatting, validating,
// and managing PostgreSQL data interactions across the HRMS backend.
//
// Usage:
//     const { fetchAllRows, insertRecord } = require('../database/db_function');
// ##############################################################################################


const { getConnection, releaseConnection , pool} = require('./pg_conn');

// Convert query result to dictionary 
const toDictionary = (result) => {
  return result.rows.length > 0 ? result.rows : [{}];
};

async function getClient(){
  return await pool.connect();
}


// Fetch data with SQL
const getData = async (sql, params = []) => {
  let client;
  try {
    client = await getConnection();
    const result = await client.query(sql, params);
    return toDictionary(result);
  } catch (err) {
    console.error('getData Error:', err);
    // Tag as database error
    err.name = 'DatabaseError';
    throw err;
  } finally {
    releaseConnection(client);
  }
};

// Execute SQL (insert/update/delete)
const executeSQL = async (sql, params = []) => {
  let client;
  try {
    client = await getConnection();
    const result = await client.query(sql, params);
    return result; 
  } catch (err) {
    console.error("executeSQL Error:", err);
    // Tag as database error
    err.name = 'DatabaseError';
    throw err; 
  } finally {
    releaseConnection(client);
  }
};


// Execute two SQLs like `execute_two_sql`
const executeTwoSQL = async (sql1, sql2) => {
  let client;
  try {
    client = await getConnection();
    await client.query('BEGIN');
    await client.query(sql1);
    const res2 = await client.query(sql2);
    await client.query('COMMIT');
    return { success: true, message: res2.command };
  } catch (err) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackErr) {
        console.error('Rollback error:', rollbackErr);
      }
    }
    console.error('executeTwoSQL Error:', err);
    // Tag as database error
    err.name = 'DatabaseError';
    throw err;
  } finally {
    releaseConnection(client);
  }
};

// For bulk insert/update like `execute_many_sql`
const executeManySQL = async (sql, valuesArray) => {
  let client;
  try {
    client = await getConnection();
    const result = await client.query(sql, valuesArray);
    return { success: true, rowsAffected: result.rowCount };
  } catch (err) {
    console.error('executeManySQL Error:', err);
    // Tag as database error
    err.name = 'DatabaseError';
    throw err;
  } finally {
    releaseConnection(client);
  }
};

module.exports = {
  getData,
  getClient,
  executeSQL,
  executeTwoSQL,
  executeManySQL
};
