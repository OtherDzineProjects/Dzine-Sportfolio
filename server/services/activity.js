const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/activity");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const app = express();
app.use(express.json());


/*
Author     : Abhijith JS
Date       : 29 August 2024
Purpose    : function for saving activity
parameter  : activityData
return type: callback
*/
function saveActivity(activityData  , callback) {
  
    // If both checks pass, save the new activity
    let saveQuery = queries.qSaveActivity(activityData);
    executeQuery(saveQuery, null)
      .then((result) => {
        if (validator.isNullObject(result) && result.length <= 0) {
          const errMsg = errorMessages.ERROR_SAVINGACTIVITY;
          callback(null, errMsg);
        } else {
          const activityID = result[0].ActivityID;
  
          //Returning the new activity's activityID
          callback(activityID, null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${errorMessages.ERROR_FETCHING_DETAILS}, ${error.message}`;
        // Call the callback function with no result (null) and the error message
        callback(null, errMsg);
      });
  }

/*
Author     : Abhijith JS
Date       : 29 August 2024
Purpose    : function for fetching activity
parameter  : activityID
return type: callback
*/
  function getActivityByID(activityID, callback) {
    let query = queries.qGetActivityByID(activityID);
    //execute query to get activity by activityID
    executeQuery(query, null)
      .then((result) => {
        // Check if activity exists
        if (validator.isNullObject(result) || result.length === 0) {
          // If activity not found, return an error message
          const errMsg = errorMessages.ERROR_NOACTIVITY_FOUND;
          callback([], null);
        } else {
          // If activity found, return the activity details
          callback(result, null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${errorMessages.ERROR_FETCHING_ACTIVITYDETAILS} , ${error.message}`;
        // Call the callback function with no result (null) and the error message
        callback(null, errMsg);
      });
  }


  /*
Author     : Abhijith JS
Date       : 29 August 2024
Purpose    : function for updating activity
parameter  : updateActivityData
return type: callback
*/
  function updateActivity(updateActivityData, callback) {
    const { activityID } = updateActivityData;
  
    // Check if activity exists
    getActivityByID(activityID, (activityDetails, error) => {
      if (error) {
        return callback(null, error);
      }
  
      if (
        validator.isNullOrEmpty(activityDetails) ||
        activityDetails.length === 0
      ) {
        return callback(null, errorMessages.ERROR_NOACTIVITY_FOUND);
      }
  
        // Execute activity details update query
        let query = queries.qUpdateActivity(updateActivityData);
        executeQuery(query, null)
          .then((result) => {
            if (validator.isNullObject(result) || result.length === 0) {
              return callback(null, errorMessages.ERROR_UPDATEFAILED);
            }
            // Returns activityID if update successful
            return callback(activityID, null);
          })
          .catch((error) => {
            // If error occurs during API call
            const errMsg = `${errorMessages.ERROR_UPDATEFAILED}, ${error.message}`;
            return callback(null, errMsg);
          });
    });
  }


  /*
Author     : Abhijith JS
Date       : 30 August 2024
Purpose    : function for searching activity
parameter  : searchActivityData
return type: callback
*/
  function searchActivity(searchActivityData, page, pageSize, callback) {
    let query = queries.qSearchActivity(
      searchActivityData,
      page,
      pageSize
    );
    //Execute query to search activities
    executeQuery(query, null)
      .then((result) => {
        // Check if no activities were found
        if (validator.isNullObject(result) || result.length === 0) {
          // No users found, call the callback with null data and an appropriate message
          callback(result, null);
        } else {      
          //if activity found, pass it
          callback(result, null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${errorMessages.ERROR_FETCHING_DETAILS} , ${error.message}`;
  
        // Call the callback function with no result (null) and the error message
        callback(null, errMsg);
      });
  }
  

/*
Author     : Abhijith JS
Date       : 30 August 2024
Purpose    : function for deleting activity
parameter  : activityID
return type: callback
*/
  function deleteActivity(activityID, callback) {
    getActivityByID(activityID, (activityDetails, error) => {
      if (error) {
        callback(false, error);
      } else if (activityDetails === null || activityDetails.length === 0) {
        callback(false, errorMessages.ERROR_NOACTIVITY_FOUND);
      } else {
        //query executed to delete activity
        let query = queries.qDeleteActivity(activityID);
  
        //execute query to delete activity
        executeQuery(query, null)
          .then((result) => {
            // Check if the delete operation was successful
            if (validator.isNullObject(result) || result.affectedRows === 0) {
              // If no activities were deleted,
              callback(false, errorMessages.ERROR_NOACTIVITY_FOUND);
            } else {
              // If activities were deleted
              callback(true, null);
            }
          })
          .catch((error) => {
            // If an error occurs during the API call, construct an error message
            const errMsg = `${errorMessages.ERROR_DELETING_ACTIVITY} , ${error.message}`;
  
            callback(false, errMsg);
          });
      }
    });
  }




  module.exports = {
    saveActivity,
    updateActivity,
    getActivityByID,
    searchActivity,
    deleteActivity,
  };
  