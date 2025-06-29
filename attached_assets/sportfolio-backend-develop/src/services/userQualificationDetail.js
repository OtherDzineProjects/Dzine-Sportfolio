const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/userQualificationDetail");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const app = express();
app.use(express.json());



/*
Author     : VARUN HM
Date       : 6 August 2024
Purpose    : Route to save user qualification details.
parameter  : userEnteredDetails
return type: callback
*/
function saveUserQualificationDetail(userEnteredDetails, callback) {
    let checkquery = queries.qCheckDuplicateExistsCreate(userEnteredDetails);

  executeQuery(checkquery, null)
    .then((result) => {
      // Check if the count is greater than 0, indicating a duplicate exists
      if (result[0].count > 0) {
        const errMsg = errorMessages.ERROR_DUPLICATE_QUALIFICATION;
        return callback(null, errMsg);
      } else {
        let query = queries.qSaveUserQualificationDetail(userEnteredDetails);
        executeQuery(query, null)
          // Execute the query to add user qualifiation details to db
          .then((result) => {
            if (validator.isNullObject(result)) {
              const errMsg = errorMessages.ERROR_SAVING_BASIC_QUALIFICATIONDETAILS;
              return callback(null, errMsg);
            } else {
              const userQualificationDetailID = result[0].UserQualificationDetailID;
              //Returning the new userQualification's userQualificationDetailID
              return callback(userQualificationDetailID, null);
            }
          })
          .catch((error) => {
            // If an error occurs during the API call, construct an error message
            const errMsg = `${errorMessages.ERROR_SAVING_BASIC_QUALIFICATIONDETAILS}, ${error.message}`;
            // Call the callback function with no result (null) and the error message
            callback(null, errMsg);
          });
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
Author     : VARUN HM
Date       : 6 August 2024
Purpose    : Route to search user qualification details.
parameter  : userEnteredDetails, page, pageSize
return type: callback
*/
function searchUserQualificationDetail(userEnteredDetails, page, pageSize, callback) {
  let query = queries.qsearchUserQualificationDetail(userEnteredDetails, page, pageSize);
  // Execute query to search userQualification
  executeQuery(query, null)
    .then((result) => {
      // Check if no userQualifications are found
      if (validator.isNullOrEmpty(result) && validator.isNullOrEmpty(result[0])) {
        // No userQualifications found, call the callback with null data and an appropriate message
        let errMsg = `${errorMessages.ERROR_FETCHING_DETAILS}`;
        callback(null, errMsg);
      } else {
        //if userQualifications found, pass it
        callback(result[0], null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      let errMsg = `${errorMessages.ERROR_FETCHING_DETAILS} , ${error.message}`;

      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 6 August 2024
Purpose    : Function for getting user qualification details by input userQualificationDetailID.
parameter  : userQualificationDetailID
return type: callback
*/
function getUserQualificationDetailByID(userQualificationDetailID, callback) {
  let query = queries.qGetUserQualificationDetailByID(userQualificationDetailID);
  //execute query to get userQualification by userQualificationDetailID
  executeQuery(query, null)
    .then((result) => {
      // Check if userQualification exists
      if (validator.isNullObject(result) || result.length === 0) {
        // If userQualification not found, return an error message
        const errMsg = errorMessages.ERROR_NOUSERQUALIFICATIONS_FOUND;
        callback(null, errMsg);
      } else {
        callback(result, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_NOUSERQUALIFICATION_FOUND} , ${error.message}`;
      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}

/*
Author     : Abhijith JS
Date       : 6 August 2024
Purpose    : Function for updating user qualification details.
parameter  : userEnteredDetails 
return type: callback 
*/
function updateUserQualificationDetail(userEnteredDetails, callback) {
 
    let checkquery = queries.qCheckDuplicateQualificationUpdate(userEnteredDetails);

  executeQuery(checkquery, null)
    .then((result) => {
      // Check if the count is greater than 0, indicating a duplicate exists
      if (result.length > 0 && result[0].count > 0) {
        const errMsg = errorMessages.ERROR_DUPLICATE_QUALIFICATION;
        return callback(null, errMsg);
      } else {
      //Execute userQualification details update query
      let query = queries.qUpdateUserQualificationDetail(userEnteredDetails);
      executeQuery(query, null)
        .then((result) => {
          if (validator.isNullObject(result) || result.length === 0) {
            callback(null, errorMessages.ERROR_UPDATEFAILED);
          } else {
            // Returns userQualificationDetailID if update successful
            const userQualificationDetailID = result[0].UserQualificationDetailID;
            callback(userQualificationDetailID, null);
          }
        })
        .catch((error) => {
          //if error occurs during API call
          const errMsg = `${errorMessages.ERROR_UPDATEFAILED}, ${error.message}`;
          callback(null, errMsg);
        });
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
Date       : 6 August 2024
Purpose    : Function to delete a userqualification by matching userQualificationDetailID.
parameter  : userQualificationDetailID 
return type: callback
*/
function deleteUserQualificationDetail (userQualificationDetailID, callback){
  
  //query executed to delete userQualification
  let query = queries.qDeleteUserQualificationDetail(userQualificationDetailID);
  //execute query to delete userQualification
  executeQuery(query, null)
    .then((result) => {
      // Check if the delete operation was successful
      if (validator.isNullObject(result) || result.affectedRows === 0) {
        // If no userQualification was deleted,
        callback(false, errorMessages.ERROR_NOUSERQUALIFICATIONS_FOUND);
      } else {
        // If userQualification was deleted
        callback(true, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_DELETINGQUALIFICATION} , ${error.message}`;

      callback(false, errMsg);
    });
}




module.exports = {
    saveUserQualificationDetail,
    searchUserQualificationDetail,
    deleteUserQualificationDetail, 
    getUserQualificationDetailByID,
    updateUserQualificationDetail,

  };