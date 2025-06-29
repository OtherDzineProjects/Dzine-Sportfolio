const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/user");
const systemQueries = require("../sql/systemAccess");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const { createJWTToken } = require("../common/commonFunctions");
const app = express();
app.use(express.json());

/*
Author     : Abhijith JS
Date       : 17 May 2024
Purpose    : Function to save user signup details to database.
parameter  : userEneteredDetails 
return type: callback
*/

function saveUser(userEnteredDetails, callback) {
  let checkquery = systemQueries.qCheckMail(userEnteredDetails);

  executeQuery(checkquery, null)
    .then((result) => {
      //checking if user already present
      if (result.length > 0 && result[0].Email != null) {
        const errMsg = errorMessages.ERROR_USER_EXISTS;
        return callback(null, errMsg);
      } else {
        let query = queries.qSaveUser(userEnteredDetails);
        executeQuery(query, null)
          // Execute the query to add user details to db
          .then((result) => {
            if (validator.isNullObject(result)) {
              const errMsg = errorMessages.ERROR_SAVINGUSER;
              return callback(null, errMsg);
            } else {
              const userID = result[0].UserID;
              //Returning the new user's userID
              return callback(userID, null);
            }
          })
          .catch((error) => {
            // If an error occurs during the API call, construct an error message
            const errMsg = `${errorMessages.ERROR_SAVINGUSER}, ${error.message}`;
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
Date       : 17 May 2024
Purpose    : Function to get user from database by userID.
parameter  : userID 
return type: callback
*/
function getUserById(userID, callback) {
  let query = queries.qGetUserByID(userID);
  //execute query to get user by userid
  executeQuery(query, null)
    .then((result) => {
      // Check if user exists
      if (validator.isNullObject(result) || result.length === 0) {
        // If user not found, return an error message
        const errMsg = errorMessages.ERROR_FINDINGUSERBYID;
        callback(null, errMsg);
      } else {
        // If user found, return the user details
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
Date       : 20 May 2024
Purpose    : To search and get an array of users with details matching the input details.
parameter  : userEnteredDetails 
return type: callback
*/

function searchUser(userEnteredDetails, page, pageSize, callback) {
  let query = queries.qSearchUser(userEnteredDetails, page, pageSize);
  //Execute query to search users
  executeQuery(query, null)
    .then((result) => {
      // Check if no users are found
      if (validator.isNullObject(result) || result.length === 0) {
        // No users found, call the callback with null data and an appropriate message
        callback(result, null);
      } else {
        //if users found, pass it
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
Date       : 27 September 2024
Purpose    : for Searching array of users matching ANY user input details.
parameter  : keywordSearchText 
return type: callback
*/
function keySearchUser(keywordSearchText, userID, page, pageSize, callback) {
  let query = queries.qKeySearchUser(keywordSearchText, userID, page, pageSize);
  //Execute query to search users
  executeQuery(query, null)
    .then((result) => {
      // Check if no users are found
      if (validator.isNullOrEmpty(result) && validator.isNullOrEmpty(result[0])) {
        // No users found, call the callback with null data and an appropriate message
        callback(result, null);
      } else {
        //if users found, pass it
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
Date       : 20 May 2024
Purpose    : Function to update user details.
parameter  : userEneteredDetails 
return type: callback
*/
function updateUser(userEnteredDetails, callback) {
  const { userID } = userEnteredDetails;

  //checking if user exists
  getUserById(userID, (userDetails, error) => {
    if (error) {
      callback(null, error);
    } else if (userDetails.length === 0) {
      callback(null, errorMessages.ERROR_NOUSER_FOUND);
    }
    // Check if User email exists
    let checkQuery = queries.qExcludeCurrentUser(userEnteredDetails);
    executeQuery(checkQuery, null).then((checkResult) => {
      if (!validator.isNullObject(checkResult)) {
        return callback(null, errorMessages.ERROR_EMAILEXISTS);
      }

      //Execute user details update query
      let query = queries.qUpdateUser(userEnteredDetails, userID);
      executeQuery(query, null)
        .then((result) => {
          if (validator.isNullObject(result) || result.length === 0) {
            callback(null, errorMessages.ERROR_UPDATEFAILED);
          } else {
            // Returns userID if update successful
            callback(userID, null);
          }
        })
        .catch((error) => {
          //if error occurs during API call
          const errMsg = `${errorMessages.ERROR_UPDATEFAILED}, ${error.message}`;
          callback(null, errMsg);
        });
    });
  });
}

/*
Author     : Abhijith JS
Date       : 20 May 2024
Purpose    : Function to delete a user by matching userID.
parameter  : userID 
return type: callback
*/
function deleteUser(dataPassed, callback) {
  const userID = dataPassed.userID;
  // const actionCode = dataPassed.actionCode;
  getUserById(userID, (userDetails, error) => {
    if (error) {
      callback(false, error);
    } else if (userDetails === null || userDetails.length === 0) {
      callback(false, errorMessages.ERROR_NOUSER_FOUND);
    } else {
      //query executed to deete user
      let query = queries.qDeleteUser(dataPassed);

      //execute query to delete user
      executeQuery(query, null)
        .then((result) => {
          // Check if the delete operation was successful
          if (validator.isNullObject(result) || result.affectedRows === 0) {
            // If no users were deleted,
            callback(false, errorMessages.ERROR_NOUSER_FOUND);
          } else {
            // If users were deleted
            callback(true, null);
          }
        })
        .catch((error) => {
          // If an error occurs during the API call, construct an error message
          const errMsg = `${errorMessages.ERROR_DELETINGUSER} , ${error.message}`;

          callback(false, errMsg);
        });
    }
  });
}

/*
Author     : Abhijith JS
Date       : 30 September 2024
Purpose    : for Saving user avatar
parameter  : userEnteredDetails 
return type: callback
*/
function saveUserAvatar(userEnteredDetails, callback) {
const userID = userEnteredDetails.userID;
    let query = queries.qSaveUserAvatar(userEnteredDetails);

    executeQuery(query, null)
      // Execute the query to add UserProfilePhoto to db
      .then((result) => {

        if (validator.isNullObject(result)) {
          const errMsg = errorMessages.ERROR_SAVING_AVATAR;
          return callback(null, errMsg);
        }else if (result[0].errMsg) {
          // Handle the case where a document already exists
          const errMsg = result[0].errMsg; // Use the error message returned from the stored procedure
          return callback(null, errMsg);
        }  else {
          const documentID = result[0].DocumentID;
              //Returning the new document's documentID
              return callback(documentID, null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${errorMessages.ERROR_SAVING_AVATAR}, ${error.message}`;
        // Call the callback function with no result (null) and the error message
        callback(null, errMsg);
      });
  }

/*
Author     : Abhijith JS
Date       : 30 September 2024
Purpose    : for Updating user avatar
parameter  : userEnteredDetails 
return type: callback
*/
  function updateUserAvatar(userEnteredDetails, callback) {
 
    //Execute userAvatar details update query
    let query = queries.qUpdateUserAvatar(userEnteredDetails);
    executeQuery(query, null)
      .then((result) => {
        if (validator.isNullObject(result) || result.length === 0) {
          callback(null, errorMessages.ERROR_UPDATEFAILED);
        } else {
          // Returns documentID if update successful
          const documentID = result[0].DocumentID;
          callback(documentID, null);
        }
      })
      .catch((error) => {
        //if error occurs during API call
        const errMsg = `${errorMessages.ERROR_UPDATEFAILED}, ${error.message}`;
        callback(null, errMsg);
      });
}






module.exports = { saveUser, getUserById, searchUser, keySearchUser, updateUser, deleteUser
  , saveUserAvatar, updateUserAvatar,};
