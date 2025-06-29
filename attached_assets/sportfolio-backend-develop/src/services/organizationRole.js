const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/organizationRole");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const app = express();
app.use(express.json());





/*
Author     : Abhijith JS
Date       : 26 November 2024
Purpose    : Function for saving new organization Role
parameter  : saveOrganizationRole
return type: callback
*/
function saveOrganizationRole(saveOrganizationRole, callback) {
    // Check if the RoleName already exists for the organization
    const checkQuery = queries.qCheckOrganizationRoleDuplicate(saveOrganizationRole);
    executeQuery(checkQuery, null)
      .then((checkResult) => {
        if (checkResult.length > 0) {
          const errMsg = errorMessages.ERROR_ORGANIZATION_ROLE_EXISTS;
          throw new Error(errMsg); // Stop further execution
        }
        // If checks pass, save the new organizationRole
        const saveQuery = queries.qSaveOrganizationRole(saveOrganizationRole);
        return executeQuery(saveQuery, null);
      })
      .then((result) => {
        // If role not saved, return error
        if (validator.isNullObject(result) || result.length <= 0) {
          const errMsg = errorMessages.ERROR_SAVING_ORGANIZATION_ROLE;
          callback(null, errMsg);
        } else {
          const organizationRoleID = result[0].OrganizationRoleID;
          // Returning the organization's organizationRoleID
          callback(organizationRoleID, null);
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
Date       : 26 November 2024
Purpose    : Function for updating new organization Role
parameter  : updateOrganizationRoleData
return type: callback
*/
function updateOrganizationRole(updateOrganizationRoleData, callback) {
  
    // Check if the Role already exists with the same organizationID and roleName
    let checkQuery = queries.qCheckOrganizationRoleDuplicate(updateOrganizationRoleData);
    
    executeQuery(checkQuery, null)
      .then((checkResult) => {
        if (checkResult.length > 0) {
          const errMsg = errorMessages.ERROR_ORGANIZATION_ROLE_EXISTS;
          throw new Error(errMsg); // Stop further execution
        } else {
          // Execute update organization role details query
          let query = queries.qUpdateOrganizationRole(updateOrganizationRoleData);
          executeQuery(query, null)
            .then((result) => {
              if (validator.isNullObject(result) || result.length === 0) {
                return callback(null, errorMessages.ERROR_UPDATING_ORGANIZATION_ROLE);
              } else {
                // Successfully updated organization role
                return callback(result[0].OrganizationRoleID, null);
              }
            })
            .catch((error) => {
              // Log the error and pass the error message
              const errMsg = `${errorMessages.ERROR_UPDATING_ORGANIZATION_ROLE}, ${error.message}`;
              console.error(errMsg);
              callback(null, errMsg);
            });
        }
      })
      .catch((error) => {
        // Log the error and pass the error message
        const errMsg = `${errorMessages.ERROR_UPDATING_ORGANIZATION_ROLE}, ${error.message}`;
        console.error(errMsg);
        callback(null, errMsg);
      });
  
}
  
  

/*
Author     : Abhijith JS
Date       : 27 November 2024
Purpose    : Function for fetching organization role by id
parameter  : organizationRoleID
return type: callback
*/
function getOrganizationRoleByID(organizationRoleID, callback) {
  let query = queries.qGetOrganizationRoleByID(organizationRoleID);

  // Execute query to get organizationRole by organizationRoleID
  executeQuery(query, null)
    .then((result) => {
      // Check if organizationRole exists
      if (validator.isNullObject(result) || result.length === 0) {
        // If organizationRole not found, return an error message
        // const errMsg = errorMessages.ERROR_FETCHING_ORGANIZATION_ROLE_DETAILS;
        callback([], null);
      } else {
        // If organizationRole found, return the organizationRole details
        callback(result, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the query execution, construct an error message
      const errMsg = `${errorMessages.ERROR_FETCHING_ORGANIZATION_ROLE_DETAILS}, ${error.message}`;
      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 27 November 2024
Purpose    : Function for searching organizationRole
parameter  : searchOrganizationRoleData
return type: callback
*/
function searchOrganizationRole(searchOrganizationRoleData, page, pageSize, callback) {
  let query = queries.qSearchOrganizationRole(
    searchOrganizationRoleData,
    page,
    pageSize
  );

  // Execute query to search organization roles
  executeQuery(query, null)
    .then((result) => {
      // Check if no organization roles are found
      if (validator.isNullOrEmpty(result) || validator.isNullOrEmpty(result[0])) {
        // No organization roles found, call the callback with null data
        callback(result, null);
      } else {
        // If organization roles are found, pass them to the callback
        callback(result[0], null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_FETCHING_ORGANIZATION_ROLE_DETAILS} , ${error.message}`;

      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 27 November 2024
Purpose    : Function for deleting organizationRole
parameter  : organizationRoleID
return type: callback
*/
function deleteOrganizationRole(organizationRoleID, callback) {
  // Query executed to delete the organization Role
  let query = queries.qDeleteOrganizationRole(organizationRoleID);

  // Execute query to delete organization Role
  executeQuery(query, null)
    .then((result) => {
      // Check if the delete operation was successful
      if (!result || result.affectedRows === 0) {
        // If no records were deleted, call the callback with failure
        callback(false, errorMessages.ERROR_DELETING_ORGANIZATION_ROLE);
      } else {
        // If records were deleted, call the callback with success
        callback(true, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_DELETING_ORGANIZATION_ROLE}, ${error.message}`;
      callback(false, errMsg);
    });
}






  module.exports = { 
    saveOrganizationRole,
    updateOrganizationRole,
    getOrganizationRoleByID,
    searchOrganizationRole,
    deleteOrganizationRole,
}