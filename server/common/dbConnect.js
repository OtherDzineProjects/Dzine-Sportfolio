const mysql = require("mysql2/promise");
var globalConstants = require("./globalConstants");
var connectionString = globalConstants.connectionString;

// Create and export the connection pool
const pool = mysql.createPool(connectionString);

/*
Author     : Abhijith JS
Date       : 16 May 2024
Purpose    : Function to execute SQL queries using the connection pool.
parameter  : sql, values
return type: Promise
*/
function executeQuery(sql, values) {
  let connection;

  return pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(sql, values);
    })
    .then(([results, fields]) => {

      connection.release();
      if(isStoredProcedure(sql) && results.length>0){
          return results[0]
      }else{
        return results;
      }
      // return results;
    })
    .catch((err) => {
      if (connection) connection.release();
      throw err;
    });
}

function isStoredProcedure(sql) {
  // Define a regular expression pattern to match stored procedure calls
  const pattern = /^\s*CALL\s+/i;
  // Test the SQL string against the pattern
  return pattern.test(sql);
}


module.exports = { executeQuery };
