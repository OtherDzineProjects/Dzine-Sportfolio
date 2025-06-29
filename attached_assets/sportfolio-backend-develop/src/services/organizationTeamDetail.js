const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/organizationTeamDetail");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const app = express();
app.use(express.json());





/*
Author     : Abhijith JS
Date       : 05 November 2024
Purpose    : Function for saving organization Team Detail
parameter  : saveOrganizationTeamDetailData
return type: callback
*/
function saveorganizationTeamDetail(saveOrganizationTeamDetailData, callback) {
    
    let checkQuery = queries.qCheckorganizationTeamDetailDuplicate(saveOrganizationTeamDetailData);
    // Check if user already exist for an organization team
    executeQuery(checkQuery, null)
        .then((checkResult) => {
            if (checkResult.length > 0) {
                const errMsg = errorMessages.ERROR_ORGANIZATION_TEAMDETAIL_EXISTS;
                throw new Error(errMsg); // Stop further execution
            }
            // If checks pass, save the new organizationTeamDetail
            let saveQuery = queries.qSaveOrganizationTeamDetail(saveOrganizationTeamDetailData);
            return executeQuery(saveQuery, null);
        })
        .then((result) => {
            // If team not saved, then return error
            if (validator.isNullObject(result) || result.length <= 0) {
                const errMsg = errorMessages.ERROR_SAVINGORGANIZATION_TEAMDETAIL;
                callback(null, errMsg);
            } else {
                const organizationTeamDetailID = result[0].OrganizationTeamDetailID;
                // Returning the organizationTeamDetail's organizationTeamDetailID
                callback(organizationTeamDetailID, null);
            }
        })
        .catch((error) => {
            // If an error occurs during the API call, construct an error message
            const errMsg = `${error.message}`;
            // Call the callback function with no result (null) and the error message
            callback(null, errMsg);
        });
}



/*
Author     : Abhijith JS
Date       : 05 November 2024
Purpose    : Function for updating organization Team Detail
parameter  : updateOrganizationTeamDetailData
return type: callback
*/
function updateOrganizationTeamDetail(updateOrganizationTeamDetailData, callback) {

    // Check if user already exist for an organization team
    let checkQuery = queries.qCheckorganizationTeamDetailDuplicate(updateOrganizationTeamDetailData);
    
    executeQuery(checkQuery, null)
      .then((checkResult) => {
        if (checkResult.length > 0 && !validator.isNullOrEmpty(checkResult[0].OrganizationTeamDetailID)) {

          const errMsg = errorMessages.ERROR_ORGANIZATION_TEAMDETAIL_EXISTS;
          return callback(null, errMsg);
        } else {
          // Execute update organizationTeamDetail details query
          let query = queries.qUpdateOrganizationTeamDetail(updateOrganizationTeamDetailData);
          executeQuery(query, null)
            .then((result) => {
              if (validator.isNullObject(result) || result.length === 0) {
                return callback(null, errorMessages.ERROR_UPDATING_ORGANIZATION_TEAMDETAIL);
              } else {
                // Returns organizationTeamDetailID if the update is successful
                return callback(result[0].OrganizationTeamDetailID, null);
              }
            })
            .catch((error) => {
              // If an error occurs during the query execution
              const errMsg = `${errorMessages.ERROR_UPDATING_ORGANIZATION_TEAMDETAIL}, ${error.message}`;
              callback(null, errMsg);
            });
        }
      })
      .catch((error) => {
        // If an error occurs during the query execution
        const errMsg = `${errorMessages.ERROR_UPDATING_ORGANIZATION_TEAMDETAIL}, ${error.message}`;
        callback(null, errMsg);
      });
}



/*
Author     : Abhijith JS
Date       : 05 November 2024
Purpose    : Function for deleting organization TeamDetail
parameter  : organizationTeamDetailID
return type: callback boolean
*/
function deleteOrganizationTeamDetail(organizationTeamDetailID, callback) {
    // Query executed to delete organization TeamDetail
    let query = queries.qDeleteorganizationTeamDetail(organizationTeamDetailID);
  
    // Execute query to delete organization TeamDetail
    executeQuery(query, null)
      .then((result) => {
        // Check if the delete operation was successful
        if (validator.isNullObject(result) || result.affectedRows === 0) {
          // If no records were deleted,
          callback(false, errorMessages.ERROR_DELETING_ORGANIZATION_TEAMDETAIL);
        } else {
          // If records were deleted
          callback(true, null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${errorMessages.ERROR_DELETING_ORGANIZATION_TEAMDETAIL} , ${error.message}`;
  
        callback(false, errMsg);
      });
  }

  /*
Author     : Varun H M
Date       : 05 November 2024
Purpose    : Function for fetching organizationTeamDetail by organizationTeamDetailID
parameter  : organizationTeamDetailID
return type: callback
*/
function getOrganizationTeamDetailByID(organizationTeamDetailID, callback) {
  let query = queries.qGetOrganizationTeamDetailByID(organizationTeamDetailID);
  //execute query to get organization Team Detail by organizationTeamDetailID
  executeQuery(query, null)
    .then((result) => {
      // Check if organization Team Detail exists
      if (validator.isNullObject(result) || result.length === 0) {
        // If organization Team Detail not found, return an error message
        callback([], null);
      } else {
        // If organization Team Detail found, return the organization Team details datas
        callback(result, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_FETCHING_ORGANIZATION_TEAMDETAIL} , ${error.message}`;
      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}

/*
Author     : Varun H M
Date       : 05 November 2024
Purpose    : Function for searching organization Team Detail
parameter  : searchOrganizationTeamDetailData
return type: callback
*/
function searchOrganizationTeamDetail(searchOrganizationTeamDetailData, page, pageSize, callback) {
  let query = queries.qSearchOrganizationTeamDetail(searchOrganizationTeamDetailData, page, pageSize);

  // Execute query to search organizationTeamDetail
  executeQuery(query, null)
    .then((result) => {
      // Check if no organizationTeamDetail are found
      if (validator.isNullOrEmpty(result) || validator.isNullOrEmpty(result[0])) {
        // No organizationTeamDetail found, call the callback with null data and an appropriate message
        callback(result, null);
      } else {
        // If organizationTeamDetail found, pass it
        callback(result[0], null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_TEAM_DETAILS}, ${error.message}`;

      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}





module.exports = {
    saveorganizationTeamDetail,
    updateOrganizationTeamDetail,
    deleteOrganizationTeamDetail,
    getOrganizationTeamDetailByID,
    searchOrganizationTeamDetail
}