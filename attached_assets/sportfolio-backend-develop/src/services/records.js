const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/records");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const { configureCloudinaryStorage } = require('../common/commonFunctions');
const app = express();
app.use(express.json());



function getCredentials(recordsData, callback) {
  
  let query = queries.qGetCredentialSetting();
  executeQuery(query,null)
  .then((result) => {
    // Check if exists
    if (validator.isNullObject(result) || result.length === 0) {
      // If not found, return an error message
      const errMsg = errorMessages.ERROR_OCCURRED;
      callback(null, errMsg);
    } else {
      const credentials = result;
      // const storeData = configureCloudinaryStorage(recordsData, credentials);
      callback(credentials, null);
    }
  })
  .catch((error) => {
    // If an error occurs during the API call, construct an error message
    const errMsg = `${errorMessages.ERROR_OCCURRED} , ${error.message}`;
    // Call the callback function with no result (null) and the error message
    callback(null, errMsg);
  });
 
      

}

module.exports = { getCredentials }