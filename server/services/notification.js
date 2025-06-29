const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/notification");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const app = express();
app.use(express.json());




/*
Author     : Abhijith JS
Date       : 28 November 2024
Purpose    : Function for saving Notification details
parameter  : notificationDetails
return type: callback
*/
function saveNotificationDetails(notificationDetails, callback) {
    // Query to check if a duplicate notification exists
    const checkQuery = queries.qCheckDuplicateNotification(notificationDetails);
  
    executeQuery(checkQuery, null)
      .then((result) => {
        // If a duplicate is found, return an error
        if (result[0].count > 0) {
          const errMsg = errorMessages.ERROR_NOTIFICATION_EXISTS;
          return callback(null, errMsg);
        } else {
          // Query to save the notification details
          const query = queries.qSaveNotification(notificationDetails);
  
          executeQuery(query, null)
            .then((result) => {
              // Handle cases where the query execution fails
              if (validator.isNullObject(result)) {
                const errMsg = errorMessages.ERROR_SAVING_NOTIFICATION;
                return callback(null, errMsg);
              } else {
                // Extract and return the NotificationID of the new record
                const notificationID = result[0].NotificationID;  
                return callback(notificationID, null);
              }
            })
            .catch((error) => {
              // Handle errors during the query execution
              const errMsg = `${errorMessages.ERROR_SAVING_NOTIFICATION}, ${error.message}`;
              callback(null, errMsg);
            });
        }
      })
      .catch((error) => {
        // Handle errors during the duplicate check
        const errMsg = `${errorMessages.ERROR_FETCHING_DETAILS}, ${error.message}`;
        callback(null, errMsg);
      });
  }
  


  /*
Author     : Abhijith JS
Date       : 28 November 2024
Purpose    : Function for fetching Notification by notificationID
parameter  : getNotificationData
return type: callback
*/
function getNotificationByID(getNotificationData, callback) {
  let query = queries.qGetNotificationByID(getNotificationData);
  
  // Execute query to get notification by getNotificationData
  executeQuery(query, null)
    .then((result) => {
      // Check if notification exists
      if (validator.isNullObject(result) || result.length === 0) {
        // If notification not found, return an error message
        const errMsg = errorMessages.ERROR_FETCHING_NOTIFICATION_DETAILS;
        callback(null, errMsg);
      } else {
        // If notification found, return the notification details
        callback(result, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_FETCHING_NOTIFICATION_DETAILS} , ${error.message}`;
      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 29 November 2024
Purpose    : function for searching Notification by entered keyword
parameter  : keywordSearchText
return type: callback
*/
function keySearchNotification(keywordSearchText, fetchTypes, page, pageSize, callback) {
  // Generate the query for notification search
  let query = queries.qKeySearchNotification(keywordSearchText, fetchTypes, page, pageSize);

  // Execute the query to search notifications
  executeQuery(query, null)
    .then((result) => {
      // Check if no notifications are found
      if (validator.isNullOrEmpty(result) || validator.isNullOrEmpty(result[0])) {
        // No notifications found, call the callback with null data
        callback([], null);
      } else {
        // If notifications are found, pass them to the callback
        callback(result[0], null);
      }
    })
    .catch((error) => {
      // Construct an error message if an error occurs
      const errMsg = `${errorMessages.ERROR_FETCHING_NOTIFICATION_DETAILS} , ${error.message}`;

      // Call the callback function with no result and the error message
      callback(null, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 29 November 2024
Purpose    : Function for updating Notification details
parameter  : notificationDetails
return type: callback
*/
function updateNotificationDetails(notificationDetails, callback) {

  // Query to check if a duplicate notification exists
  const checkQuery = queries.qCheckDuplicateNotification(notificationDetails);

  executeQuery(checkQuery, null)
    .then((result) => {
      // If a duplicate is found, return an error
      if (result[0].count > 0) {
        const errMsg = errorMessages.ERROR_NOTIFICATION_EXISTS;
        return callback(null, errMsg);
      } else {
        // If no duplicates found, update the notification details
        const updateQuery = queries.qUpdateNotification(notificationDetails);

        executeQuery(updateQuery, null)
          .then((result) => {
            // Handle cases where the query execution fails
            if (validator.isNullObject(result)) {
              const errMsg = errorMessages.ERROR_UPDATING_NOTIFICATION;
              return callback(null, errMsg);
            } else {
              // Return the NotificationID of the updated record
              const updatedNotificationID = notificationDetails.notificationID;
              return callback(updatedNotificationID, null);
            }
          })
          .catch((error) => {
            // Handle errors during the query execution
            const errMsg = `${errorMessages.ERROR_UPDATING_NOTIFICATION}, ${error.message}`;
            callback(null, errMsg);
          });
      }
    })
    .catch((error) => {
      // Handle errors during the duplicate check
      const errMsg = `${errorMessages.ERROR_FETCHING_DETAILS}, ${error.message}`;
      callback(null, errMsg);
    });
}




/*
Author     : Abhijith JS
Date       : 03 December 2024
Purpose    : Function for fetching Notification Status count
parameter  : NotificationID
return type: callback
*/
function getNotificationStatusData(userID, callback) {
  // Use the query to get notification status data
  let query = queries.qGetNotificationStatusData(userID);

  // Execute the query
  executeQuery(query, null)
    .then((result) => {
      // Check if notification status data exists
      if (validator.isNullObject(result) || result.length === 0) {
        // If no notification status data is found, return an empty array and error message
        const errMsg = errorMessages.ERROR_FETCHING_NOTIFICATION_STATUS_DETAILS;
        callback([], errMsg);
      } else {
        // If notification status data is found, return the details
        callback(result[0], null);
      }
    })
    .catch((error) => {
      // If an error occurs during the query execution, construct an error message
      const errMsg = `${errorMessages.ERROR_FETCHING_NOTIFICATION_STATUS_DETAILS}, ${error.message}`;
      // Call the callback with no result (null) and the error message
      callback(null, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 05 December 2024
Purpose    : Function for deleting Notification
parameter  : NotificationID
return type: Callback
*/
function deleteNotification(notificationID, callback) {
  // Query executed to delete notification
  let query = queries.qDeleteNotification(notificationID);

  // Execute query to delete notification
  executeQuery(query, null)
    .then((result) => {
      // Check if the delete operation was successful
      if (validator.isNullObject(result) || result.affectedRows === 0) {
        // If no records were deleted
        callback(false, errorMessages.ERROR_DELETING_NOTIFICATION);
      } else {
        // If records were deleted
        callback(true, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_DELETING_NOTIFICATION}, ${error.message}`;

      callback(false, errMsg);
    });
}




  module.exports = {
    saveNotificationDetails,
    getNotificationByID,
    keySearchNotification,
    updateNotificationDetails,
    getNotificationStatusData,
    deleteNotification,
  };