const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/organizationUserRole");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const app = express();
app.use(express.json());






/*
Author     : Abhijith JS
Date       : 27 November 2024
Purpose    : Function for saving new organization User Role
parameter  : saveOrganizationUserRole
return type: callback
*/
function saveOrganizationUserRole(saveOrganizationUserRole, callback) {
    // Check if the User already has this Role in the organization
    const checkQuery = queries.qCheckOrganizationUserRoleDuplicate(saveOrganizationUserRole);
    executeQuery(checkQuery, null)
      .then((checkResult) => {
        if (checkResult.length > 0 || !validator.isNullOrEmpty(checkResult)) {
          const errMsg = errorMessages.ERROR_ORGANIZATION_USER_ROLE_EXISTS;
          throw new Error(errMsg); // Stop further execution if duplicate exists
        }
        // If checks pass, save the new organizationUserRole
        const saveQuery = queries.qSaveOrganizationUserRole(saveOrganizationUserRole);
        return executeQuery(saveQuery, null);
      })
      .then((result) => {
        // If user role is not saved, return an error
        if (validator.isNullObject(result) || result.length <= 0) {
          const errMsg = errorMessages.ERROR_SAVING_ORGANIZATION_USER_ROLE;
          callback(null, errMsg);
        } else {
          const organizationUserRoleID = result[0].OrganizationUserRoleID;
          // Returning the organization's organizationUserRoleID
          callback(organizationUserRoleID, null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${error.message}`;
        // Call the callback function with no result (null) and the error message
        callback(null, errMsg);
      });
}








module.exports = { 
    saveOrganizationUserRole,
}