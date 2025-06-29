const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/activityDetail");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const app = express();
app.use(express.json());


/*
Author     : Abhijith JS
Date       : 06 November 2024
Purpose    : function for saving activityDetail
parameter  : activityDetailData
return type: callback
*/
function saveActivityDetail(activityDetailData  , callback) {
  
let checkQuery = queries.qCheckActivityDetailExists(activityDetailData);
executeQuery(checkQuery, null)
    .then((checkResult) => {
        if (checkResult.length > 0) {
            const errMsg = errorMessages.ERROR_ACTIVITYDETAIL_EXISTS;
            throw new Error(errMsg); // Stop further execution
        }
    // If both checks pass, save the new activity
    let saveQuery = queries.qSaveActivityDetail(activityDetailData);
    return executeQuery(saveQuery, null)
      .then((result) => {
        if (validator.isNullObject(result) && result.length <= 0) {
          const errMsg = errorMessages.ERROR_SAVINGACTIVITY_DETAIL;
          callback(null, errMsg);
        } else {
          const activityDetailID = result[0].ActivityDetailID;
  
          //Returning the new activityDetail's activityDetailID
          callback(activityDetailID, null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${errorMessages.ERROR_SAVINGACTIVITY_DETAIL}, ${error.message}`;
        // Call the callback function with no result (null) and the error message
        callback(null, errMsg);
      });
    }).catch((error) => {
    // If an error occurs during the API call, construct an error message
    const errMsg = `${errorMessages.ERROR_SAVINGACTIVITY_DETAIL}, ${error.message}`;
    // Call the callback function with no result (null) and the error message
    callback(null, errMsg);
    });
  }

    /*
Author     : Varun H M
Date       : 07 November 2024
Purpose    : Function for fetching activityDetail by activityDetailID
parameter  : activityDetailID
return type: callback
*/
function getActivityDetailByID(activityDetailID, callback) {
  let query = queries.qGetActivityDetailByID(activityDetailID);
  //execute query to get activity Detail by activityDetailID
  executeQuery(query, null)
    .then((result) => {
      // Check if activity Detail exists
      if (validator.isNullObject(result) || result.length === 0) {
        // If activity Detail not found, return an error message
        const errMsg = errorMessages.ERROR_FETCHING_ACTIVITYDETAIL;
        callback([], null);
      } else {
        // If activity Detail found, return the activity details datas
        callback(result, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_FETCHING_ACTIVITYDETAIL} , ${error.message}`;
      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}

/*
Author     : Varun H M
Date       : 07 November 2024
Purpose    : Function for deleting activity Detail
parameter  : activityDetailID
return type: callback boolean
*/
function deleteActivityDetail(activityDetailID, callback) {
  // Query executed to delete activity Detail
  let query = queries.qDeleteActivityDetail(activityDetailID);

  // Execute query to delete activity Detail
  executeQuery(query, null)
    .then((result) => {
      // Check if the delete operation was successful
      if (validator.isNullObject(result) || result.affectedRows === 0) {
        // If no records were deleted,
        callback(false, errorMessages.ERROR_DELETING_ACTIVITYDETAIL);
      } else {
        // If records were deleted
        callback(true, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_DELETING_ACTIVITYDETAIL} , ${error.message}`;

      callback(false, errMsg);
    });
}


/*
Author     : Varun H M
Date       : 07 November 2024
Purpose    : Function for searching activity Detail
parameter  : searchActivityDetailData
return type: callback
*/
function searchActivityDetail(searchActivityDetailData, page, pageSize, callback) {
  let query = queries.qSearchActivityDetail(searchActivityDetailData, page, pageSize);

  // Execute query to search activityDetail
  executeQuery(query, null)
    .then((result) => {
      // Check if no activityDetail are found
      if (validator.isNullOrEmpty(result) || validator.isNullOrEmpty(result[0])) {
        // No activityDetail found, call the callback with null data and an appropriate message
        callback(result, null);
      } else {
        // If activityDetail found, pass it
        callback(result[0], null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_FETCHING_ACTIVITYDETAIL}, ${error.message}`;

      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 07 November 2024
Purpose    : function for updating activityDetail
parameter  : updateActivityDetailData
return type: callback
*/
function updateActivityDetail(updateActivityDetailData, callback) {

  //Check if the data is a duplicate
  let checkQuery = queries.qCheckActivityDetailExists(updateActivityDetailData);
  executeQuery(checkQuery, null)
  .then((checkResult) => {
        if (checkResult.length > 0) {
            const errMsg = errorMessages.ERROR_ACTIVITYDETAIL_EXISTS;
            throw new Error(errMsg); // Stop further execution
        }

      // Execute activityDetail data update query if duplicate does not exists
      let query = queries.qUpdateActivityDetail(updateActivityDetailData);
      return executeQuery(query, null)
        .then((result) => {
          if (validator.isNullObject(result) || result.length === 0) {
            return callback(null, errorMessages.ERROR_UPDATING_ACTIVITYDETAIL);
          }
          // Returns activityDetailID if update successful
          return callback(updateActivityDetailData.activityDetailID, null);
        })
        .catch((error) => {
          // If error occurs during API call
          const errMsg = `${errorMessages.ERROR_UPDATEFAILED}, ${error.message}`;
          return callback(null, errMsg);
        });
  }).catch((error) => {
    // If an error occurs during the API call, construct an error message
    const errMsg = `${errorMessages.ERROR_SAVINGACTIVITY_DETAIL}, ${error.message}`;
    // Call the callback function with no result (null) and the error message
    callback(null, errMsg);
    });
}





  module.exports = {
    saveActivityDetail,
    updateActivityDetail,
    getActivityDetailByID,
    deleteActivityDetail,
    searchActivityDetail
  }