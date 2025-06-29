const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/organizationActivity");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const app = express();
app.use(express.json());

/*
Author     : VARUN H M
Date       : 29 August 2024
Purpose    : Function for searching organization activity
parameter  : searchOrganizationData
return type:  callback
*/
function searchOrganizationActivity(searchOrganizationData, page, pageSize, callback) {
  let query = queries.qSearchOrganization(
    searchOrganizationData,
    page,
    pageSize
  );
  //Execute query to search organization activity
  executeQuery(query, null)
    .then((result) => {
      // Check if no organization activity are found
      if (validator.isNullObject(result) || result.length === 0) {
        // No organization activity found, call the callback with null data and an appropriate message
        callback(result, null);
      } else {      
        //if organization activities found, pass it
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
Author     : VARUN H M
Date       : 29 August 2024
Purpose    : Function for getting organization activity by organizationActivityID
parameter  : organizationID
return type:  callback
*/
function getOrganizationActivityByID(organizationActivityID, callback) {
  let query = queries.qGetOrganizationByActivityID(organizationActivityID);
  //execute query to get organization activity by organizationActivityID
  executeQuery(query, null)
    .then((result) => {
      // Check if organization activity exists
      if (validator.isNullObject(result) || result.length === 0) {
        // If organization activity not found, return an error message
        const errMsg = errorMessages.ERROR_FINDINGORGANIZATION_ACTIVITYBYID;
        callback(null, errMsg);
      } else {
        // If organization activity found, return the organization activity details
        callback(result, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_FETCHING_ORGANIZATIONACTIVITYDETAILS} , ${error.message}`;
      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}

/*
Author     : VARUN H M
Date       : 29 August 2024
Purpose    : Function for saving new organization activity and delete if old one exists
parameter  : organizationData
return type:  callback
*/
function saveOrganizationActivity(organizationActivityDatas, organizationID, callback) {

        // Query to delete organization activity
        let query = queries.qSaveOrganizationActivity(organizationActivityDatas, organizationID);
        // Execute query to delete organization activity
        executeQuery(query, null)
          .then((result) => {
            // Check if the delete operation was successful
            if (validator.isNullObject(result) || result.affectedRows === 0) {
              // If no organization activities were deleted
              callback(false, errorMessages.ERROR_NO_ORGANIZATIONACTIVITYFOUND);
            } else {
              // If organization activities were deleted
              callback(result[0], null);
            }
          })
          .catch((error) => {
            // Construct an error message if an error occurs during the API call
            const errMsg = `${errorMessages.ERROR_DELETING_ORGANIZATION_ACTIVITY}, ${error.message}`;
            callback(false, errMsg);
          });

}


/*
Author     : Abhijith JS
Date       : 25 October 2024
Purpose    : function for deleting OrganizationActivity
parameter  : organizationID
return type: callback
*/
function deleteOrganizationActivity(organizationID, callback) {
 
      // Query to delete organization activity
      let query = queries.qDeleteOrganizationActivity(organizationID);

      // Execute query to delete organization activity
      executeQuery(query, null)
        .then((result) => {
          // Check if the delete operation was successful
          if (validator.isNullObject(result) || result.affectedRows === 0) {
            // If no organization activities were deleted
            callback(false, errorMessages.ERROR_NO_ORGANIZATIONACTIVITYFOUND);
          } else {
            // If organization activities were deleted
            callback(true, null);
          }
        })
        .catch((error) => {
          // Construct an error message if an error occurs during the API call
          const errMsg = `${errorMessages.ERROR_DELETING_ORGANIZATION_ACTIVITY}, ${error.message}`;
          callback(false, errMsg);
        });
}



module.exports = {
  searchOrganizationActivity,
  getOrganizationActivityByID,
  saveOrganizationActivity,
  deleteOrganizationActivity,
};
