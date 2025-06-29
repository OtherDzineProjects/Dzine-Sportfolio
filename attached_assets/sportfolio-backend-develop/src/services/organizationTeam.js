const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/organizationTeam");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const app = express();
app.use(express.json());



/*
Author     : Abhijith JS
Date       : 30 October 2024
Purpose    : Function for saving new organization team
parameter  : saveorganizationTeam
return type: callback
*/
function saveOrganizationTeam(saveorganizationTeam, callback) {
    
    let checkQuery = queries.qCheckOrganizationTeamDuplicate(saveorganizationTeam);
    // Check if Category,teamName already exists for an organization
    executeQuery(checkQuery, null)
        .then((checkResult) => {
        if (checkResult.length > 0) {
        const errMsg = errorMessages.ERROR_ORGANIZATION_TEAM_EXISTS;
            throw new Error(errMsg); // Stop further execution
        }
    // If checks pass, save the new organizationTeam
    let saveQuery = queries.qSaveOrganizationTeam(saveorganizationTeam);
        return executeQuery(saveQuery, null)
    })
    .then((result) => {
        //if team not saved, then return error
    if (validator.isNullObject(result) && result.length <= 0) {
        const errMsg = errorMessages.ERROR_SAVINGORGANIZATION_TEAM;
        callback(null, errMsg);
    } else {
        const organizationTeamID = result[0].OrganizationTeamID
        //Returning the organizationTeam's organizationTeamID
        callback(organizationTeamID, null);
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
Date       : 30 October 2024
Purpose    : Function for updating organization Team
parameter  : updateOrganizationTeamData
return type: callback
*/
function updateOrganizationTeam(updateOrganizationTeamData, callback) {

    // Check if the Team already exists with the same organizationID and TeamName
    let checkQuery = queries.qCheckOrganizationTeamDuplicate(updateOrganizationTeamData);
    
    executeQuery(checkQuery, null)
      .then((checkResult) => {
        if (checkResult && checkResult.length > 0 && validator.isNullOrEmpty(checkResult[0].OrganizationTeamID)) {
          const errMsg = errorMessages.ERROR_ORGANIZATION_TEAM_EXISTS;
          return callback(null, errMsg);
        } else {
          // Execute update organization Team details query
          let query = queries.qUpdateOrganizationTeam(updateOrganizationTeamData);
          executeQuery(query, null)
            .then((result) => {
              if (validator.isNullObject(result) || result.length === 0) {
                return callback(null, errorMessages.ERROR_UPDATING_ORGANIZATION_TEAM);
              } else {
                // Returns OrganizationTeamID if the update is successful
                return callback(result[0].OrganizationTeamID, null);
              }
            })
            .catch((error) => {
              // If an error occurs during the query execution
              const errMsg = `${errorMessages.ERROR_UPDATING_ORGANIZATION_TEAM}, ${error.message}`;
              callback(null, errMsg);
            });
        }
      })
      .catch((error) => {
        // If an error occurs during the query execution
        const errMsg = `${errorMessages.ERROR_UPDATING_ORGANIZATION_TEAM}, ${error.message}`;
        callback(null, errMsg);
      });
}

  


/*
Author     : Abhijith JS
Date       : 30 October 2024
Purpose    : Function for fetching organizationTeam by organizationTeamID
parameter  : organizationTeamID
return type: callback
*/
function getOrganizationTeamByID(organizationTeamID, callback) {
    let query = queries.qGetOrganizationTeamByID(organizationTeamID);
    //execute query to get organization Team by organizationTeamID
    executeQuery(query, null)
      .then((result) => {
        // Check if organization Team exists
        if (validator.isNullObject(result) || result.length === 0) {
          // If organization Team not found, return an error message
          const errMsg = errorMessages.ERROR_FETCHING_ORGANIZATION_TEAM_DETAILS;
          callback([], null);
        } else {
          // If organization Team found, return the organization Team details
          callback(result, null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${errorMessages.ERROR_FETCHING_ORGANIZATION_TEAM_DETAILS} , ${error.message}`;
        // Call the callback function with no result (null) and the error message
        callback(null, errMsg);
      });
}



/*
Author     : Abhijith JS
Date       : 01 November 2024
Purpose    : Function for searching organization teams
parameter  : searchOrganizationTeamData
return type: callback
*/
function searchorganizationTeam(searchorganizationTeamData, page, pageSize, callback) {
  let query = queries.qsearchorganizationTeam(
    searchorganizationTeamData,
    page,
    pageSize
  );
  //Execute query to search searchorganizationTeams
  executeQuery(query, null)
    .then((result) => {
      // Check if no searchorganizationTeams are found
      if (validator.isNullOrEmpty(result) && validator.isNullOrEmpty(result[0])) {
        // No searchorganizationTeams found, call the callback with null data and an appropriate message
        callback(result, null);
      } else {      
        //if searchorganizationTeams found, pass it
        callback(result[0], null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_FETCHING_ORGANIZATION_TEAM_DETAILS} , ${error.message}`;

      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 21 October 2024
Purpose    : Function for deleting organization Team
parameter  : organizationTeamID
return type: callback boolean
*/
function deleteOrganizationTeam(organizationTeamID, callback) {
  // Query executed to delete organization Team
  let query = queries.qDeleteOrganizationTeam(organizationTeamID);

  // Execute query to delete organization Team
  executeQuery(query, null)
    .then((result) => {
      // Check if the delete operation was successful
      if (validator.isNullObject(result) || result.affectedRows === 0) {
        // If no records were deleted,
        callback(false, errorMessages.ERROR_DELETING_ORGANIZATION_TEAM);
      } else {
        // If records were deleted
        callback(true, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_DELETING_ORGANIZATION_TEAM} , ${error.message}`;

      callback(false, errMsg);
    });
}






  module.exports = {
    saveOrganizationTeam,
    updateOrganizationTeam,
    getOrganizationTeamByID,
    searchorganizationTeam,
    deleteOrganizationTeam,
  }