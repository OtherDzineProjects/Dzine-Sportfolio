const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/organizationDepartmentMember");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const app = express();
app.use(express.json());



/*
Author     : Abhijith JS
Date       : 17 October 2024
Purpose    : Function for saving new organization department Member
parameter  : organizationDepartmentMemberData
return type:  callback
*/
function saveorganizationDepartmentMember(organizationDepartmentMemberData, callback) {
    
    let checkQuery = queries.qCheckOrganizationDepartmentMemberExists(organizationDepartmentMemberData);
    // Check if MemberID already exists for a department in the organization
    executeQuery(checkQuery, null)
      .then((checkResult) => {
        if (checkResult[0].count > 0) {
          const errMsg = errorMessages.ERROR_ORGANIZATION_DEPARTMENT_MEMBER_EXISTS;
          throw new Error(errMsg); // Stop further execution
        }
        // If checks pass, save the new organization Department Member
        let saveQuery = queries.qSaveOrganizationDepartmentMember(organizationDepartmentMemberData);
        return executeQuery(saveQuery, null);
      })
      .then((result) => {
        if (validator.isNullObject(result) || result.length <= 0) {
          const errMsg = errorMessages.ERROR_SAVING_ORGANIZATIONDEPARTMENTMEMBER;
          callback(null, errMsg);
        } else {
          const organizationDepartmentMemberID = result[0].OrganizationDepartmentMemberID;
          //Returning the organization Department Member's ID
          callback(organizationDepartmentMemberID, null);
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
Date       : 18 October 2024
Purpose    : Function for searching organization department members
parameter  : searchOrganizationDepartmentMemberData
return type:  callback
*/
function searchOrganizationDepartmentMember(
  searchOrganizationDepartmentMemberData,
  page,
  pageSize,
  callback
) {
  // Construct the query for searching organization department members
  let query = queries.qSearchOrganizationDepartmentMember(
    searchOrganizationDepartmentMemberData,
    page,
    pageSize
  );

  // Execute the query to search organization department members
  executeQuery(query, null)
    .then((result) => {
      // Check if no organization department members are found
      if (
        validator.isNullOrEmpty(result) || 
        validator.isNullOrEmpty(result[0])
      ) {
        // No members found, call the callback with null data
        callback(result, null);
      } else {
        // If members are found, pass them in the callback
        callback(result[0], null);
      }
    })
    .catch((error) => {
      // If an error occurs, construct an error message specific to department members
      const errMsg = `${errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_MEMBER_DETAILS} , ${error.message}`;

      // Call the callback function with null result and the error message
      callback(null, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 18 October 2024
Purpose    : Function for getting organizationDepartmentmembers by organizationDepartmentMemberID
parameter  : organizationDepartmentMemberID
return type:  callback
*/
function getOrganizationDepartmentMemberByID(organizationDepartmentMemberID, callback) {
  let query = queries.qGetOrganizationDepartmentMemberByID(organizationDepartmentMemberID);
  // Execute query to get organization department member by organizationDepartmentMemberID
  executeQuery(query, null)
    .then((result) => {
      // Check if organization department member exists
      if (validator.isNullObject(result) || result.length === 0) {
        // If organization department member not found, return an error message
        const errMsg = errorMessages.ERROR_FINDING_ORGANIZATION_DEPARTMENT_MEMBER_BYID;
        callback(null, errMsg);
      } else {
        // If organization department member found, return the organization department member details
        callback(result, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_MEMBER_DETAILS}, ${error.message}`;
      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}



/*
Author     : Abhijith JS
Date       : 21 October 2024
Purpose    : Function for deleting organization department member
parameter  : organizationDepartmentMemberID
return type: callback boolean
*/
function deleteOrganizationDepartmentMember(organizationDepartmentMemberID, callback) {
  // Query executed to delete organization department member
  let query = queries.qDeleteOrganizationDepartmentMember(organizationDepartmentMemberID);

  // Execute query to delete organization department member
  executeQuery(query, null)
    .then((result) => {
      // Check if the delete operation was successful
      if (validator.isNullObject(result) || result.affectedRows === 0) {
        // If no records were deleted,
        callback(false, errorMessages.ERROR_DELETING_ORGANIZATION_DEPARTMENT_MEMBER);
      } else {
        // If records were deleted
        callback(true, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_DELETING_ORGANIZATION_DEPARTMENT_MEMBER} , ${error.message}`;

      callback(false, errMsg);
    });
}




/*
Author     : Abhijith JS
Date       : 21 October 2024
Purpose    : Function for updating organization DepartmentMember
parameter  : updateOrganizationDepartmentMemberData
return type: callback
*/
function updateOrganizationDepartmentMember(updateOrganizationDepartmentMemberData, callback) {
  const { organizationDepartmentID, memberID, organizationDepartmentMemberID } = updateOrganizationDepartmentMemberData;
  let checkQuery = queries.qCheckOrganizationDepartmentMemberDuplicate(organizationDepartmentID, memberID, organizationDepartmentMemberID);
  
  executeQuery(checkQuery, null)
  .then((checkResult) => {

    if (checkResult && checkResult.length > 0 && checkResult[0].count > 0) {
      const errMsg = errorMessages.ERROR_ORGANIZATION_DEPARTMENT_MEMBER_EXISTS
      return callback(null, errMsg);
    } else {
        // Execute update organization department member details query
        let query = queries.qUpdateOrganizationDepartmentMember(updateOrganizationDepartmentMemberData);
        executeQuery(query, null)
          .then((result) => {
            if (validator.isNullObject(result) || result.length === 0) {
              return callback(null, errorMessages.ERROR_UPDATEFAILED);
            } else {
              // Returns organizationDepartmentMemberID if update successful
              return callback(organizationDepartmentMemberID, null);
            }
          })
          .catch((error) => {
            // If an error occurs during the API call
            const errMsg = `${errorMessages.ERROR_UPDATEFAILED}, ${error.message}`;
            callback(null, errMsg);
          });
        }
  })
  .catch((error) => {
    // If an error occurs during the API call
    const errMsg = `${errorMessages.ERROR_UPDATEFAILED}, ${error.message}`;
    callback(null, errMsg);
  });
}






module.exports = { 
    saveorganizationDepartmentMember,
    searchOrganizationDepartmentMember,
    getOrganizationDepartmentMemberByID,
    deleteOrganizationDepartmentMember,
    updateOrganizationDepartmentMember,
};