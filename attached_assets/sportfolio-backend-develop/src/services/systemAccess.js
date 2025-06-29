const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/systemAccess");
const userServices = require("../services/user");
const { createJWTToken } = require("../common/commonFunctions");
const validator = require('../common/validation');
const errorMessages = require("../common/errorMessages");
const app = express();
app.use(express.json());

/*
Author     : Abhijith JS
Date       : 29 May 2024
Purpose    : function for Login route controller
parameter  : loginCredentials 
return type: callback
*/
function loginUser(loginCredentials, callback) {
  //passing loginCredentials to qLoginUser which returns the sql
  let query = queries.qLoginUser(loginCredentials);

  // Execute the query to check user details from db
  executeQuery(query, null)
    //if user successfully found
    .then((result) => {
      //if the user is not found
      if(validator.isNullObject(result) || result.length ===0 || validator.isNullOrEmpty(result[0].UserID)){
        const errMsg = errorMessages.ERROR_UNABLETOLOGIN;
        callback(null, errMsg);

      }else{
          
        //logged in user details
      const userData = result[0];
        //creating token by passing object containing user's data
        const token = createJWTToken(userData);

        const loginResponse = {
          token: token,
          id: userData.UserID,
          roleID: userData.RoleID,
          isAdmin: userData.IsAdmin,
          firstName: userData.FirstName,
          lastName: userData.LastName,
          email: userData.Email,
          avatar: userData.avatar
        }
        //response given as token
        callback(loginResponse, null);
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
Date       : 28 May 2024
Purpose    : function for signup route controller
parameter  : signUpData 
return type: callback
*/
function signUpUser(signUpData, callback) {

  let query = queries.qCheckMail(signUpData);
  executeQuery(query,null)
  .then((result) => {
    //checking if user already present
    if(result.length>0 && result[0].Email != null){
      const errMsg = errorMessages.ERROR_USER_EXISTS;
      callback(null, errMsg);
       
    }else{
      //calling the saveuser method for signup
      userServices.saveUser(signUpData, callback)

    }
    
  }
  )
  .catch((error) => {
    // Handle any errors that occur during the query execution
    callback(null, error);
  });
  
}

module.exports = { loginUser, signUpUser };
