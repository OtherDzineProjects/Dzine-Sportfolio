const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/regionMasters");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const app = express();
app.use(express.json());


/*
Author     : Abhijith JS
Date       : 6 August 2024
Purpose    : function for fetching region
parameter  : regionID 
return type: ID
*/
function getRegionMasters(regionID, callback) {
    let query = queries.qGetRegionMasters(regionID);
    //execute query to get region by regionID
    executeQuery(query, null)
      .then((result) => {
        // Check if region exists
        if (validator.isNullObject(result) || result.length === 0) {
          // If region not found, return an error message
          const errMsg = errorMessages.ERROR_FINDINGUSERBYID;
          callback(null, errMsg);
        } else {
          // If region found, return the region details
          callback(result, null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${errorMessages.ERROR_FETCHING_USERDETAILS} , ${error.message}`;
        // Call the callback function with no result (null) and the error message
        callback(null, errMsg);
      });
  }



  module.exports = { getRegionMasters };