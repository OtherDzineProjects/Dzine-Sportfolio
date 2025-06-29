const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/organizationDepartmentTeam");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const app = express();
app.use(express.json());





/*
Author     : Abhijith JS
Date       : 01 November 2024
Purpose    : Function for saving organization Department Team
parameter  : organizationDepartmentTeamData
return type: callback
*/
function saveOrganizationDepartmentTeam(organizationDepartmentTeamData, callback) {
    
    let checkQuery = queries.qCheckOrganizationDepartmentTeamDuplicate(organizationDepartmentTeamData);
    // Check if Category and teamName already exist for an organization
    executeQuery(checkQuery, null)
        .then((checkResult) => {
            if (checkResult.length > 0) {
                const errMsg = errorMessages.ERROR_ORGANIZATION_DEPARTMENT_TEAM_EXISTS;
                throw new Error(errMsg); // Stop further execution
            }
            // If checks pass, save the new organizationDepartmentTeam
            let saveQuery = queries.qSaveOrganizationDepartmentTeam(organizationDepartmentTeamData);
            return executeQuery(saveQuery, null);
        })
        .then((result) => {
            // If team not saved, then return error
            if (validator.isNullObject(result) || result.length <= 0) {
                const errMsg = errorMessages.ERROR_SAVINGORGANIZATION_DEPARTMENT_TEAM;
                callback(null, errMsg);
            } else {
                const organizationDepartmentTeamID = result[0].OrganizationDepartmentTeamID;
                // Returning the organizationDepartmentTeam's organizationDepartmentTeamID
                callback(organizationDepartmentTeamID, null);
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
Author     : Varun H M
Date       : 04 November 2024
Purpose    : Function for fetching organizationDepartmentTeam by organizationDepartmentTeamID
parameter  : organizationDepartmentTeamID
return type: callback
*/
function getOrganizationDepartmentTeamByID(organizationDepartmentTeamID, callback) {
    let query = queries.qGetOrganizationDepartmentTeamByID(organizationDepartmentTeamID);
    //execute query to get organization department Team by organizationDepartmentTeamID
    executeQuery(query, null)
      .then((result) => {
        // Check if organization department Team exists
        if (validator.isNullObject(result) || result.length === 0) {
          // If organization department Team not found, return an error message
          const errMsg = errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_TEAM_DETAILS;
          callback(null, errMsg);
        } else {
          // If organization department Team found, return the organization department Team details
          callback(result, null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_TEAM_DETAILS} , ${error.message}`;
        // Call the callback function with no result (null) and the error message
        callback(null, errMsg);
      });
}

/*
Author     : Varun H M
Date       : 04 November 2024
Purpose    : Function for deleting organization department Team
parameter  : organizationDepartmentTeamID
return type: callback boolean
*/
function deleteOrganizationDepartmentTeam(organizationDepartmentTeamID, callback) {
    // Query executed to delete organization department Team
    let query = queries.qDeleteOrganizationDepartmentTeam(organizationDepartmentTeamID);
  
    // Execute query to delete organization department Team
    executeQuery(query, null)
      .then((result) => {
        // Check if the delete operation was successful
        if (validator.isNullObject(result) || result.affectedRows === 0) {
          // If no records were deleted,
          callback(false, errorMessages.ERROR_DELETING_ORGANIZATION_DEPARTMENT_TEAM);
        } else {
          // If records were deleted
          callback(true, null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${errorMessages.ERROR_DELETING_ORGANIZATION_DEPARTMENT_TEAM} , ${error.message}`;
  
        callback(false, errMsg);
      });
  }




/*
Author     : Abhijith JS
Date       : 04 November 2024
Purpose    : Function for updating organization Department Team
parameter  : updateOrganizationDepartmentTeamData
return type: callback
*/
function updateOrganizationDepartmentTeam(updateOrganizationDepartmentTeamData, callback) {

    // Check if the Department Team already exists with the same organizationID and teamName
    let checkQuery = queries.qCheckOrganizationDepartmentTeamDuplicate(updateOrganizationDepartmentTeamData);
    
    executeQuery(checkQuery, null)
      .then((checkResult) => {
        if (checkResult && checkResult.length > 0 && validator.isNullOrEmpty(checkResult[0].OrganizationDepartmentTeamID)) {
          const errMsg = errorMessages.ERROR_ORGANIZATION_DEPARTMENT_TEAM_EXISTS;
          return callback(null, errMsg);
        } else {
          // Execute update organization Department Team details query
          let query = queries.qUpdateOrganizationDepartmentTeam(updateOrganizationDepartmentTeamData);
          executeQuery(query, null)
            .then((result) => {
              if (validator.isNullObject(result) || result.length === 0) {
                return callback(null, errorMessages.ERROR_UPDATING_ORGANIZATION_DEPARTMENT_TEAM);
              } else {
                // Returns OrganizationDepartmentTeamID if the update is successful
                return callback(result[0].OrganizationDepartmentTeamID, null);
              }
            })
            .catch((error) => {
              // If an error occurs during the query execution
              const errMsg = `${errorMessages.ERROR_UPDATING_ORGANIZATION_DEPARTMENT_TEAM}, ${error.message}`;
              callback(null, errMsg);
            });
        }
      })
      .catch((error) => {
        // If an error occurs during the query execution
        const errMsg = `${errorMessages.ERROR_UPDATING_ORGANIZATION_DEPARTMENT_TEAM}, ${error.message}`;
        callback(null, errMsg);
      });
}



/*
Author     : Abhijith JS
Date       : 04 November 2024
Purpose    : Function for searching organization Department Team
parameter  : searchOrganizationDepartmentTeamData
return type: callback
*/
function searchOrganizationDepartmentTeam(searchOrganizationDepartmentTeamData, page, pageSize, callback) {
  let query = queries.qSearchOrganizationDepartmentTeam(
    searchOrganizationDepartmentTeamData,
    page,
    pageSize
  );
  
  // Execute query to search organizationDepartmentTeams
  executeQuery(query, null)
    .then((result) => {
      // Check if no organizationDepartmentTeams are found
      if (validator.isNullOrEmpty(result) || validator.isNullOrEmpty(result[0])) {
        // No organizationDepartmentTeams found, call the callback with null data and an appropriate message
        callback(result, null);
      } else {
        // If organizationDepartmentTeams found, pass it
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
    saveOrganizationDepartmentTeam,
    getOrganizationDepartmentTeamByID,
    deleteOrganizationDepartmentTeam,    
    updateOrganizationDepartmentTeam,
    searchOrganizationDepartmentTeam,
  }