const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/organizationDepartment");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const app = express();
app.use(express.json());




/*
Author     : Abhijith JS
Date       : 15 October 2024
Purpose    : Function for saving new organization department
parameter  : organizationDepartmentData
return type:  callback
*/
function saveorganizationDepartment(organizationDepartmentData, callback) {
    
    let checkQuery = queries.qCheckOrganizationDepartmentExists(organizationDepartmentData);
    // Check if DepartmentName already exists for an organization
    executeQuery(checkQuery, null)
      .then((checkResult) => {
        if (checkResult.length > 0) {
        const errMsg = errorMessages.ERROR_ORGANIZATION_DEPARTMENT_EXISTS;
          throw new Error(errMsg); // Stop further execution
        }
    // If checks pass, save the new organizationDepartment
    let saveQuery = queries.qSaveOrganizationDepartment(organizationDepartmentData);
       return executeQuery(saveQuery, null)
   })
    .then((result) => {

    if (validator.isNullObject(result) && result.length <= 0) {
        const errMsg = errorMessages.ERROR_SAVINGORGANIZATIONDEPARTMENT;
        callback(null, errMsg);
    } else {
        const organizationDepartmentID = result[0].OrganizationDepartmentID;
        //Returning the organizationDepartment's organizationDepartmentID
        callback(organizationDepartmentID, null);
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
Date       : 16 October 2024
Purpose    : Function for searching organization departments
parameter  : searchOrganizationDepartmentData
return type: callback
*/
function searchorganizationDepartment(searchOrganizationDepartmentData, page, pageSize, callback) {
    let query = queries.qSearchOrganizationDepartment(
      searchOrganizationDepartmentData,
      page,
      pageSize
    );
    //Execute query to search OrganizationDepartments
    executeQuery(query, null)
      .then((result) => {
        // Check if no OrganizationDepartments are found
        if (validator.isNullOrEmpty(result) && validator.isNullOrEmpty(result[0])) {
          // No OrganizationDepartments found, call the callback with null data and an appropriate message
          callback(result, null);
        } else {      
          //if OrganizationDepartments found, pass it
          callback(result[0], null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_DETAILS} , ${error.message}`;
  
        // Call the callback function with no result (null) and the error message
        callback(null, errMsg);
      });
  }


/*
Author     : Abhijith JS
Date       : 17 October 2024
Purpose    : Function for fetching organizationDepartment by organizationDepartmentID
parameter  : organizationDepartmentID
return type:  callback
*/
function getOrganizationDepartmentByID(organizationDepartmentID, callback) {
  let query = queries.qGetOrganizationDepartmentByID(organizationDepartmentID);
  //execute query to get organizationDepartment by organizationDepartmentID
  executeQuery(query, null)
    .then((result) => {
      // Check if organizationDepartment exists
      if (validator.isNullObject(result) || result.length === 0) {
        // If organizationDepartment not found, return an error message
        const errMsg = errorMessages.ERROR_FINDING_ORGANIZATION_DEPARTMENT_BYID;
        callback(null, errMsg);
      } else {
        // If organizationDepartment found, return the organizationDepartment details
        callback(result, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_FETCHING_ORGANIZATIONDETAILS} , ${error.message}`;
      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 21 October 2024
Purpose    : Function for deleting organization department 
parameter  : organizationDepartmentID
return type: callback boolean
*/
function deleteOrganizationDepartment(organizationDepartmentID, callback) {
  // Query executed to delete organization department
  let query = queries.qDeleteOrganizationDepartment(organizationDepartmentID);

  // Execute query to delete organization department
  executeQuery(query, null)
    .then((result) => {
      // Check if the delete operation was successful
      if (validator.isNullObject(result) || result.affectedRows === 0) {
        // If no records were deleted,
        callback(false, errorMessages.ERROR_DELETING_ORGANIZATION_DEPARTMENT);
      } else {
        // If records were deleted
        callback(true, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_DELETING_ORGANIZATION_DEPARTMENT} , ${error.message}`;

      callback(false, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 22 October 2024
Purpose    : Function for updating organization Department
parameter  : updateOrganizationDepartmentData
return type: callback
*/
function updateOrganizationDepartment(updateOrganizationDepartmentData, callback) {

  // Check if the department already exists with the same organizationID and departmentName
  let checkQuery = queries.qCheckOrganizationDepartmentDuplicate(updateOrganizationDepartmentData);
  
  executeQuery(checkQuery, null)
    .then((checkResult) => {
      if (checkResult && checkResult.length > 0 && checkResult[0].count > 0) {
        const errMsg = errorMessages.ERROR_ORGANIZATION_DEPARTMENT_EXISTS;
        return callback(null, errMsg);
      } else {
        // Execute update organization department details query
        let query = queries.qUpdateOrganizationDepartment(updateOrganizationDepartmentData);
        executeQuery(query, null)
          .then((result) => {
            if (validator.isNullObject(result) || result.length === 0) {
              return callback(null, errorMessages.ERROR_UPDATING_ORGANIZATION_DEPARTMENT);
            } else {
              // Returns organizationDepartmentID if the update is successful
              return callback(result[0].OrganizationDepartmentID, null);
            }
          })
          .catch((error) => {
            // If an error occurs during the query execution
            const errMsg = `${errorMessages.ERROR_UPDATING_ORGANIZATION_DEPARTMENT}, ${error.message}`;
            callback(null, errMsg);
          });
      }
    })
    .catch((error) => {
      // If an error occurs during the query execution
      const errMsg = `${errorMessages.ERROR_UPDATING_ORGANIZATION_DEPARTMENT}, ${error.message}`;
      callback(null, errMsg);
    });
}







  module.exports = { 
    saveorganizationDepartment,
    searchorganizationDepartment,
    getOrganizationDepartmentByID,
    deleteOrganizationDepartment,
    updateOrganizationDepartment
};