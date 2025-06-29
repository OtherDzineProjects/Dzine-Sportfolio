const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../common/commonFunctionsSql");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const nodemailer = require("nodemailer");
const { createJWTToken } = require("../common/commonFunctions");
const app = express();
app.use(express.json());





/*
Author     : Abhijith JS
Date       : 20 August 2024
Purpose    : Function for getting region data by matching parentID and regiontype.
parameter  : dataPassed
return type: callback
*/
function getLocation(dataPassed, callback) {
    let query = queries.qGetLocation(dataPassed);
    //execute query to get region by regionID
    executeQuery(query, null)
      .then((result) => {
        // Check if region exists
        if (validator.isNullObject(result) || result.length === 0) {
          // If region not found, return an error message
          const errMsg = errorMessages.ERROR_NOREGIONFOUND;
          callback(null, errMsg);
        } else {
          // If user found, return the region details
          callback(result, null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${errorMessages.ERROR_OCCURRED} , ${error.message}`;
        // Call the callback function with no result (null) and the error message
        callback(null, errMsg);
      });
  }

  function getLookupByTypeName(dataPassed, callback) {
    let query = queries.getLookupByTypeName(dataPassed);
    //execute query to get details by lookup type name
    executeQuery(query, null)
      .then((result) => {
        // Check if data exists
        if (validator.isNullObject(result) || result.length === 0) {
          const errMsg = errorMessages.ERROR_NOLOOKUP_DETAILS;
          callback(null, errMsg);
        } else {
          callback(result, null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${errorMessages.ERROR_OCCURRED} , ${error.message}`;
        // Call the callback function with no result (null) and the error message
        callback(null, errMsg);
      });
  }



/*
Author     : ABHIJITH JS
Date       : 18 November 2024
Purpose    : function for updating organization member status
parameter  : updateOrganizationMemberStatusData
return type: callback
*/
function updateOrganizationMemberStatus(updateOrganizationMemberStatusData, callback) {

  // Execute Organization Member Status details update query
  let query = queries.qUpdateOrganizationMemberStatus(updateOrganizationMemberStatusData);
  executeQuery(query, null)
    .then((result) => {

      if (validator.isNullObject(result) || result.length === 0) {
        callback(null, errorMessages.ERROR_UPDATING_ORGANIZATION_MEMBER_STATUS);
      } else {
        // Returns OrganizationMemberID if update successful
        const organizationMemberID = result[0].OrganizationMemberID;
        callback(organizationMemberID, null);
      }
    })
    .catch((error) => {

      //if error occurs during API call
      const errMsg = `${errorMessages.ERROR_UPDATEFAILED}, ${error.message}`;
      callback(null, errMsg);
    });

}



/*
Author     : ABHIJITH JS
Date       : 25 November 2024
Purpose    : Function for checking, to display Apply,Revoke membership button required or not
parameter  : dataPassed
return type: callback
*/
function requireApplyMembershipButton(dataPassed, callback) {
  // Generate query to check if Apply,Revoke Membership button should be shown
  let query = queries.qShowApplyMembershipButton(dataPassed);

  // Execute the query
  executeQuery(query, null)
    .then((result) => {
      // If no relevant data is found, return an error message
      if (validator.isNullObject(result) || result.length === 0) {
        const errMsg = errorMessages.ERROR_ORGANIZATION_MEMBERSTATUS;
        callback(null, errMsg);
      } else {
        // Parse result and return whether to display the button
        const ApplyMembershipButtonData = result; // returning the 
        callback(ApplyMembershipButtonData, null);
      }
    })
    .catch((error) => {
      // If an error occurs during query execution, construct an error message
      const errMsg = `${errorMessages.ERROR_OCCURRED} , ${error.message}`;
      callback(null, errMsg);
    });
}


/*
Author     : Abhijith JS
Date       : 28 November 2024
Purpose    : Function for searching organization List
parameter  : searchOrganizationListData
return type: callback
*/
function searchOrganizationList(searchOrganizationListData, userID, page, pageSize, callback) {
  let query = queries.qSearchOrganizationList(
    searchOrganizationListData,
    userID,
    page,
    pageSize
  );
  //Execute query to search organizations
  executeQuery(query, null)
    .then((result) => {
      // Check if no organizations are found
      if (validator.isNullObject(result) || result.length === 0) {
        // No organizations found, call the callback with null data and an appropriate message
        callback(result, null);
      } else {      
        //if organizations found, pass it
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
Author     : ABHIJITH JS
Date       : 02 December 2024
Purpose    : route for updating notification status
parameter  : updateNotificationStatusData
return type: callback
*/
function updateNotificationStatus(updateNotificationStatusData, callback) {

  // Execute Notification Status details update query
  let query = queries.qUpdateNotificationStatus(updateNotificationStatusData);
  executeQuery(query, null)
    .then((result) => {

      if (validator.isNullObject(result) || result.length === 0) {
        callback(null, errorMessages.ERROR_UPDATING_NOTIFICATION_STATUS);
      } else {
        // Returns NotificationID if update successful
        const notificationID = result[0].NotificationID;
        const isApproved = result[0].IsApproved;
        const data = {notificationID, isApproved};

        callback(data, null);
      }
    })
    .catch((error) => {
      //if error occurs during API call
      const errMsg = `${errorMessages.ERROR_UPDATEFAILED}, ${error.message}`;
      callback(null, errMsg);
    });

}



/*
Author     : Abhijith JS
Date       : 19 December 2024
Purpose    : Function for sending otp via gmail to reset when user forgot password
parameter  : resetData 
return type: callback
*/
function sendPasswordOtp(resetData, callback) {
  let { email, action, userSettingsType } = resetData;

  // Construct the query to check if user exists and get template by action (template name)
  let query = queries.qfetchTemplateData(resetData); // Fetch template details

  executeQuery(query, null)
    .then((result) => {
      if (validator.isNullObject(result) || result.length === 0) {
        const errMsg = errorMessages.ERROR_FETCHING_USERDETAILS;
        // return callback(null, errMsg);
        throw new Error(errMsg);
      }

      const template = result[0];
      if (template.TemplateName === action) {
        // Call stored procedure to generate and store OTP
        const otpQuery = queries.cGenerateAndStoreOtp({ userSettingsType, email });

        executeQuery(otpQuery, null)
          .then((otpResult) => {
            const otp = otpResult[0].OTP; // Fetch the OTP returned by the procedure

            // Replace placeholders in the template (e.g., OTP, Date, etc.)
            const placeholders = {
              OTP: otp,
              Date: new Date().toLocaleDateString(),
            };

            const replacePlaceholders = (templateBody, placeholders) => {
              let updatedBody = templateBody;
              for (const [key, value] of Object.entries(placeholders)) {
                const placeholder = new RegExp(`{{${key}}}`, "g");
                updatedBody = updatedBody.replace(placeholder, value);
              }
              return updatedBody;
            };
            const emailBody = replacePlaceholders(template.Body, placeholders);

            // Send the email
            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: globalConstants.GMAIL_USER,
                pass: globalConstants.GMAIL_PASSWORD,
              },
            });

            const mailOptions = {
              from: template.FromAddress,
              to: email,
              subject: template.Subject,
              html: emailBody,
            };

            transporter.sendMail(mailOptions, (sendError, info) => {
              if (sendError) {
                return callback(sendError, null);
              }
              callback(info, null);
            });
          })
          .catch((error) => {
            const errMsg = `${errorMessages.ERROR_GENERATING_AND_STORING_OTP}, ${error.message}`;
            callback(null, errMsg);
          });
      } else {
        callback(null, errorMessages.INVALID_TEMPLATE_ACTION);
      }
    })
    .catch((error) => {
      const errMsg = `${errorMessages.ERROR_FETCHING_USERDETAILS}, ${error.message}`;
      callback(null, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 23 December 2024
Purpose    : Function for saving new password
parameter  : updateData 
return type: callback
*/
function updatePassword(updateData, callback){
  const query = queries.qUpdatePassword(updateData);

  executeQuery(query, null)
    .then((result) => {
      // Extract the errorMessage from the result set
      const errorMessage = result[0]?.errorMessage;

      if (errorMessage) {
        // Return the error message if provided
        callback(null, errorMessage);
      } else {
        // If no error message, password updated
        const isUpdated = true;
        callback(isUpdated, null);
      }
    })
    .catch((error) => {
      const errMsg = `${errorMessages.ERROR_FETCHING_USERDETAILS} , ${error.message}`;
      callback(null, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 20 December 2024
Purpose    : Function for validating otp recieved via gmail to reset forgotten password
parameter  : validateDetails 
return type: callback
*/
function validateTemporaryPassword(validateDetails, callback) {
  const query = queries.qValidateTemporaryPassword(validateDetails);

  executeQuery(query, null)
    .then((result) => {
      // Extract the errorMessage from the result set
      const errorMessage = result[0]?.errorMessage;

      if (errorMessage) {
        // Return the error message if provided
        callback(null, errorMessage);
      } else {
        // If no error message, OTP is valid

        //User details
        const userData = result[0];
        //creating token by passing object containing user's data
        const token = createJWTToken(userData);

        const response = {
          token: token,
          id: userData.UserID,
          roleID: userData.RoleID,
          isAdmin: userData.IsAdmin,
          firstName: userData.FirstName,
          lastName: userData.LastName,
          email: userData.Email,
          avatar: userData.avatar,
          isPasswordMatch: true
        }

        callback(response, null);
      }
    })
    .catch((error) => {
      const errMsg = `${errorMessages.ERROR_FETCHING_USERDETAILS} , ${error.message}`;
      callback(null, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 24 December 2024
Purpose    : Function for checking access to edit,select,etc buttons
parameter  : dataPassed
return type: callback
*/
function accessCheckServices(dataPassed, callback) {
  // Generate query to check if button should be shown
  let query = queries.qAccessCheck(dataPassed);

  // Execute the query
  executeQuery(query, null)
    .then((result) => {
      // If no relevant data is found, return an error message
      if (validator.isNullObject(result) || result.length === 0) {
        const errMsg = errorMessages.ERROR_NO_ACCESSFOUND;
        callback(null, errMsg);
      } else {
        // Parse result and return whether to display the button
        const accessData = result;
        callback(accessData, null);
      }
    })
    .catch((error) => {
      // If an error occurs during query execution, construct an error message
      const errMsg = `${errorMessages.ERROR_OCCURRED} , ${error.message}`;
      callback(null, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 24 December 2024
Purpose    : To make a member of an organization as Admin/notAdmin
parameter  : roleDataPassed
return type: callback
*/
function roleChangeServices(dataPassed, callback) {
  // Generate query to check if button should be shown
  let query = queries.qRoleChange(dataPassed);

  // Execute the query
  executeQuery(query, null)
    .then((result) => {
      // If no relevant data is found, return an error message
      if (validator.isNullObject(result) || result.length === 0) {
        const errMsg = errorMessages.ERROR_UPDATING_ORGANIZATION_MEMBER;
        callback(null, errMsg);
      } else {
        // Parse result and return whether to display the button
        const accessData = result;
        callback(accessData, null);
      }
    })
    .catch((error) => {
      // If an error occurs during query execution, construct an error message
      const errMsg = `${errorMessages.ERROR_OCCURRED} , ${error.message}`;
      callback(null, errMsg);
    });
}



  module.exports = { getLocation, 
                     getLookupByTypeName, 
                     updateOrganizationMemberStatus, 
                     requireApplyMembershipButton,
                     searchOrganizationList,
                     updateNotificationStatus,
                     sendPasswordOtp,
                     updatePassword,
                     validateTemporaryPassword,
                     accessCheckServices,
                     roleChangeServices,
                    };