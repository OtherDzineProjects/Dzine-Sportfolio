const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/userContactDetail");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const commonFunctions = require("../common/commonFunctions")
const app = express();
app.use(express.json());


/*
Author     : Abhijith JS
Date       : 14 August 2024
Purpose    : function for saving user contact details.
parameter  :  userEnteredDetails
return type: callback 
*/
function saveUserContactDetail(userEnteredDetails, callback) {
  commonFunctions.getEmailFromLookupType(userEnteredDetails.communicationDetails, (lookupDetails, errMsg) => {
    if (errMsg) {
      // If there's an error getting the email, return the error
      return callback(null, errMsg);
    }

    userEnteredDetails.communicationDetails = lookupDetails

    const emailObject = userEnteredDetails.communicationDetails.find(detail => detail.communicationTypeName === 'EmailID');
    const emailID = emailObject ? emailObject.value : null;
    if (!validator.isNullOrEmpty(emailID)) {
      if (!validator.isEmail(emailID)) {
        const errMsg = errorMessages.ERROR_INVALID_EMAIL;
        return callback(null, errMsg);
      }
    }

    let query = queries.qSaveUserContactDetail(userEnteredDetails);
    executeQuery(query, null)
      // Execute the query to add user contact details to db
      .then((result) => {
        if (validator.isNullObject(result)) {
          const errMsg = errorMessages.ERROR_SAVING_BASIC_USERDETAILS;
          return callback(null, errMsg);
        } else {
          const userContactDetailID = result[0].UserContactDetailID;
          //Returning the new userContactDetail's userContactDetailID
          return callback(userContactDetailID, null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${errorMessages.ERROR_SAVING_BASIC_USERDETAILS}, ${error.message}`;
        // Call the callback function with no result (null) and the error message
        callback(null, errMsg);
      });
  })

}


/*
Author     : Abhijith JS
Date       : 14 August 2024
Purpose    : function for fetching user contact details.
parameter  : userContactDetailID
return type: callback 
*/
  function getUserContactDetailByID(userContactDetailID, callback) {
    let query = queries.qGetBasicUserDetailByID(userContactDetailID);
    //execute query to get userContactDetail by userContactDetailID
    executeQuery(query, null)
      .then((result) => {
        // Check if userContactDetail exists
        if (validator.isNullObject(result) || result.length === 0) {
          // If userContactDetail not found, return an error message
          const errMsg = errorMessages.ERROR_FINDINGUSERBYID;
          callback(null, errMsg);
        } else {
          // If userContactDetail found, return the userContactDetails
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


/*
Author     : Abhijith JS
Date       : 22 August 2024
Purpose    : function for searching user contact details.
parameter  : userID
return type: callback 
*/
  function searchUserContactDetail(userID, page, pageSize, callback) {
    let query = queries.qSearchUserContactDetail(userID, page, pageSize);
    //Execute query to search userContactDetails
    executeQuery(query, null)
      .then((result) => {
        // Check if no userContactDetails were found
        if (validator.isNullOrEmpty(result) && validator.isNullOrEmpty(result[0])) {
          // No users found, call the callback with null data and an appropriate message
          callback(result, null);
        } else {
          //if userContactDetails found, pass it
          callback(result[0], null);
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
Date       : 15 August 2024
Purpose    : function for updating user contact details.
parameter  : userEnteredDetails
return type: callback 
*/
function updateUserContactDetail(userEnteredDetails, callback) {
  const { userContactDetailID } = userEnteredDetails;

  commonFunctions.getEmailFromLookupType(userEnteredDetails.communicationDetails, (lookupDetails, errMsg) => {
    if (errMsg) {
      // If there's an error getting the email, return the error
      callback(null, errMsg);
    }

    userEnteredDetails.communicationDetails = lookupDetails

    if (Array.isArray(userEnteredDetails.communicationDetails) && userEnteredDetails.communicationDetails.length > 0) {
    const emailObject = userEnteredDetails.communicationDetails.find(detail => detail.communicationTypeName === 'EmailID');
    const emailID = emailObject ? emailObject.value : null;
    if (emailID && !validator.isEmail(emailID)) {
        const errMsg = errorMessages.ERROR_INVALID_EMAIL;
        return callback(null, errMsg);
      }
    } else {
      // Handle the case where communicationDetails is null or empty
      userEnteredDetails.communicationDetails = [];
    }

    //Execute userContactDetails update query
    let query = queries.qUpdateUserContactDetail(userEnteredDetails);
    executeQuery(query, null)
      .then((result) => {
        if (validator.isNullObject(result) || result.length === 0) {
          callback(null, errorMessages.ERROR_UPDATEFAILED);
        } else {
          // Returns userContactDetailID if update successful
          callback(userContactDetailID, null);
        }
      })
      .catch((error) => {

        //if error occurs during API call
        const errMsg = `${errorMessages.ERROR_UPDATEFAILED}, ${error.message}`;
        callback(null, errMsg);
      })
  })
}


/*
Author     : Abhijith JS
Date       : 22 August 2024
Purpose    : function for deleting user contact details.
parameter  : userContactDetailID
return type: callback 
*/
  function deleteUserContactDetail (userContactDetailID, callback) {
    // const userContactDetailID = dataPassed.userContactDetailID;

        //query executed to delete userContactDetail
        let query = queries.qDeleteUserContactDetail(userContactDetailID);
        //execute query to delete userContactDetail
        executeQuery(query, null)
          .then((result) => {
            // Check if the delete operation was successful
            if (validator.isNullObject(result) || result.affectedRows === 0) {
              // If no userContactDetails were deleted,
              callback(false, errorMessages.ERROR_DELETING_USER_CONTACTDETAILS);
            } else {
              // If userContactDetails were deleted
              callback(true, null);
            }
          })
          .catch((error) => {
            // If an error occurs during the API call, construct an error message
            const errMsg = `${errorMessages.ERROR_NOUSER_CONTACTDETAILS_FOUND} , ${error.message}`;
  
            callback(false, errMsg);
          });
  }


  

  module.exports = {
    saveUserContactDetail,
    getUserContactDetailByID,
    updateUserContactDetail,
    deleteUserContactDetail,
    searchUserContactDetail
  };