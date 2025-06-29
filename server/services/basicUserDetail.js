const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/basicUserDetail");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const app = express();
app.use(express.json());


/*
Author     : Abhijith JS
Date       : 4 july 2024
Purpose    : Function for creating basicUserDetails 
parameter  : userEnteredDetails
return type:  callback
*/
function saveBasicUserDetail(userEnteredDetails, callback) {
  const emailID = userEnteredDetails.emailID;
  const userID = userEnteredDetails.userID;
    let checkquery = queries.qCheckMail(emailID, userID);

  executeQuery(checkquery, null)
    .then((result) => {
      //checking if basicUserDetails already present
      if (result.length > 0 && result[0].EmailID != null) {
        const errMsg = errorMessages.ERROR_USER_EMAIL_EXISTS;
        return callback(null, errMsg);
      } else {
        let query = queries.qSaveBasicUserDetail(userEnteredDetails);
        executeQuery(query, null)
          // Execute the query to add user details to db
          .then((result) => {
            if (validator.isNullObject(result)) {
              const errMsg = errorMessages.ERROR_SAVING_BASIC_USERDETAILS;
              return callback(null, errMsg);
            } else {
              const userBasicDetailID = result[0].UserBasicDetailID;
              //Returning the new basicUserDetails's userBasicDetailID
              return callback(userBasicDetailID, null);
            }
          })
          .catch((error) => {
            // If an error occurs during the API call, construct an error message
            const errMsg = `${errorMessages.ERROR_SAVING_BASIC_USERDETAILS}, ${error.message}`;
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
Author     : Abhijith JS
Date       : 4 july 2024
Purpose    : Function to get basicUserDetails from database by ID.
parameter  :  userBasicDetailID
return type: callback
*/
function getBasicUserDetailByID(userBasicDetailID, callback) {
    let query = queries.qGetBasicUserDetailByID(userBasicDetailID);
    //execute query to get basicUserDetails by userBasicDetailID
    executeQuery(query, null)
      .then((result) => {
        // Check if basicUserDetails exists
        if (validator.isNullObject(result) || result.length === 0) {
          // If basicUserDetails not found, return an error message
          const errMsg = errorMessages.ERROR_FINDINGUSERBYID;
          callback(null, errMsg);
        } else {
          // If basicUserDetails found, return the basicUserDetails
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
Date       : 5 july 2024
Purpose    : To search and get an array of basicUserDetails with details matching the input details.
parameter  : userEnteredDetails 
return type: callback
*/

function searchBasicUserDetail(userEnteredDetails, page, pageSize, callback) {
    let query = queries.qSearchBasicUserDetail(userEnteredDetails, page, pageSize);
    //Execute query to search basicUserDetails
    executeQuery(query, null)
      .then((result) => {
        // Check if no basicUserDetails are found
        if (validator.isNullOrEmpty(result) && validator.isNullOrEmpty(result[0])) {
          // No basicUserDetails found, call the callback with null data and an appropriate message
        let errMsg = `${errorMessages.ERROR_FETCHING_DETAILS}`;
        callback(null, errMsg);
        } else {
          //if basicUserDetails found, pass it
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
Date       : 5 july 2024
Purpose    : Function to update basicUserDetails.
parameter  : userEneteredDetails 
return type: callback
*/
function updateBasicUserDetail(userEnteredDetails, callback) {
    const { userBasicDetailID } = userEnteredDetails;
  
    //checking if basicUserDetails exists
    // getBasicUserDetailByID(userBasicDetailID, (userDetails, error) => {
    //   if (error) {
    //     callback(null, error);
    //   } else if (userDetails.length === 0) {
    //     callback(null, errorMessages.ERROR_NOUSER_FOUND);
    //   }
    
      // Check if basicUserDetails email exists
      let checkQuery = queries.qExcludeCurrentUser(userEnteredDetails);
      executeQuery(checkQuery, null).then((checkResult) => {
        if (!validator.isNullOrEmpty(checkResult) && !validator.isNullOrEmpty(checkResult[0]) && checkResult[0].Email != null ) {
          return callback(null, errorMessages.ERROR_EMAILEXISTS);
        }
        //Execute basicUserDetails update query
        let query = queries.qUpdateBasicUserDetail(userEnteredDetails);
        executeQuery(query, null)
          .then((result) => {
            if (validator.isNullObject(result) || result.length === 0) {
              callback(null, errorMessages.ERROR_UPDATEFAILED);
            } else {
              // Returns userBasicDetailID if update successful
              callback(userBasicDetailID, null);
            }
          })
          .catch((error) => {

            //if error occurs during API call
            const errMsg = `${errorMessages.ERROR_UPDATEFAILED}, ${error.message}`;
            callback(null, errMsg);
          });
       });
    // });
  }


/*
Author     : Abhijith JS
Date       : 5 july 2024
Purpose    : Function to delete a basicUserDetail by matching userBasicDetailID.
parameter  : userBasicDetailID 
return type: callback
*/
function deleteBasicUserDetail (dataPassed, callback) {
  const userBasicDetailID = dataPassed.userBasicDetailID;
  // getBasicUserDetailByID(userBasicDetailID, (userDetails, error) => {
  //   if (error) {
  //     callback(false, error);
  //   } else if (userDetails === null || userDetails.length === 0) {
  //     callback(false, errorMessages.ERROR_NOUSER_FOUND);
  //   } else {
      //query executed to delete basicUserDetail
      let query = queries.qDeleteBasicUserDetail(dataPassed);
      //execute query to delete basicUserDetail
      executeQuery(query, null)
        .then((result) => {
          // Check if the delete operation was successful
          if (validator.isNullObject(result) || result.affectedRows === 0) {
            // If no basicUserDetails were deleted,
            callback(false, errorMessages.ERROR_NOUSER_FOUND);
          } else {
            // If basicUserDetails were deleted
            callback(true, null);
          }
        })
        .catch((error) => {
          // If an error occurs during the API call, construct an error message
          const errMsg = `${errorMessages.ERROR_DELETINGUSER} , ${error.message}`;

          callback(false, errMsg);
        });
    // }
  // });
}







  module.exports = {
    saveBasicUserDetail,
    getBasicUserDetailByID,
    searchBasicUserDetail,
    updateBasicUserDetail,
    deleteBasicUserDetail 

  };