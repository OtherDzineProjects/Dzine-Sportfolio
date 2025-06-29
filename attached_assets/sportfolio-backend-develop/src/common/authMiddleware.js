const jwt = require("jsonwebtoken");
const multer = require("multer"); // Import the multer module for handling file uploads
const validator = require("../common/validation");
const { extractUserDetails } = require("./commonFunctions");
const errorMessages = require("./errorMessages");
const globalConstants = require("./globalConstants");



/*
Author     : Abhijith JS
Date       : 6 June 2024
Purpose    : Function to athorize user, middleware-token verification.
parameter  : request,response
return type: userID int
*/
exports.authentication = function (request, response, next) {
  const token = request.headers[globalConstants.tokenKeyName];

  try {
  // Check if the token is provided
  if (validator.isNullOrEmpty(token)) {
    return response.status(401).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_TOKEN_NOTPROVIDED,
    });
  }

  // Extract the token from the Bearer string
  const bearerToken = token.split(globalConstants.bearerTokenSplitParam)[1];

  // Check if the token is properly formatted
  if (validator.isNullOrEmpty(bearerToken)) {
    return response.status(401).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_TOKEN_FORMATINVALID,
    });
  }

  
    // Extract userID and roleID
    const { userID, roleID } = extractUserDetails(bearerToken);
    if(validator.isNullOrEmpty(userID)){
      
      return response.status(401).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_NOUSERID,
      });
    }
    // Attach the userID
    request.headers.userID = userID;
    // Attach the userID
    request.headers.roleID = roleID;

    // Proceed to the next middleware
    next();
  } catch (err) {
    return response
      .status(401).json({ 
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_TOKEN_AUTHENTICATIONFAILED 
      });
  }
};
// Error handling middleware
exports.errorHandler = function (err, request, response, next) {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    return response.status(500).json({ 
      success: false,
      data: null,
      errMsg: err.message 
    });
  } else if (err) {
    // Handle other errors
    return response.status(500).json({ 
      success: false,
      data: null,
      errMsg: "An unexpected error occurred" 
    });
  }
  next();
}
