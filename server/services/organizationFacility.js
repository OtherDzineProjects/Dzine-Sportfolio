const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/organizationFacility");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const app = express();
app.use(express.json());





/*
Author     : Abhijith JS
Date       : 14 November 2024
Purpose    : Function for creating organization Facility
parameter  : organizationFacilityData
return type: callback
*/
function saveorganizationFacility(organizationFacilityData, callback) {
    // Check if the organization facility already exists
    let checkQuery = queries.qCheckOrganizationFacilityExists(organizationFacilityData);
    
    executeQuery(checkQuery, null)
      .then((checkResult) => {
        if (checkResult.length > 0) {
          const errMsg = errorMessages.ERROR_ORGANIZATION_FACILITY_EXISTS;
          throw new Error(errMsg); // Stop further execution if facility already exists
        }
        
        // Save the new organization facility if it doesn't exist
        let saveQuery = queries.qSaveOrganizationFacility(organizationFacilityData);
        return executeQuery(saveQuery, null);
      })
      .then((result) => {
        if (!result || result.length <= 0) {
          const errMsg = errorMessages.ERROR_SAVING_ORGANIZATION_FACILITY;
          callback(null, errMsg);
        } else {
          const organizationFacilityID = result[0].OrganizationFacilityID;
          // Return the new facility ID
          callback(organizationFacilityID, null);
        }
      })
      .catch((error) => {
        const errMsg = `${error.message}`;
        callback(null, errMsg);
      });
  }

  
/*
Author     : Abhijith JS
Date       : 14 November 2024
Purpose    : Function for updating organization Facility
parameter  : organizationFacilityData
return type: callback
*/
  function updateOrganizationFacility(updateOrganizationFacilityData, callback) {

    // Check if a facility with the same organizationID and facilityName already exists
    let checkQuery = queries.qCheckOrganizationFacilityExists(updateOrganizationFacilityData);
    
    executeQuery(checkQuery, null)
      .then((checkResult) => {
        if (checkResult && checkResult.length > 0 ) {
          const errMsg = errorMessages.ERROR_ORGANIZATION_FACILITY_EXISTS;
          return callback(null, errMsg);
        } else {
          // Execute update organization facility details query
          let query = queries.qUpdateOrganizationFacility(updateOrganizationFacilityData);
          executeQuery(query, null)
            .then((result) => {
              if (validator.isNullObject(result) || result.length === 0) {
                return callback(null, errorMessages.ERROR_UPDATING_ORGANIZATION_FACILITY);
              } else {
                // Returns organizationFacilityID if the update is successful
                const organizationFacilityID = result[0].OrganizationFacilityID;
                return callback(organizationFacilityID, null);
              }
            })
            .catch((error) => {
              // If an error occurs during the query execution
              const errMsg = `${errorMessages.ERROR_UPDATING_ORGANIZATION_FACILITY}, ${error.message}`;
              callback(null, errMsg);
            });
        }
      })
      .catch((error) => {
        // If an error occurs during the query execution
        const errMsg = `${errorMessages.ERROR_UPDATING_ORGANIZATION_FACILITY}, ${error.message}`;
        callback(null, errMsg);
      });
  }
  

/*
Author     : Abhijith JS
Date       : 15 November 2024
Purpose    : Function for searching organization Facility
parameter  : searchOrganizationFacilityData
return type: callback
*/
  function searchOrganizationFacility(searchOrganizationFacilityData, page, pageSize, callback) {
    let query = queries.qSearchOrganizationFacility(
      searchOrganizationFacilityData,
      page,
      pageSize
    );
  
    // Execute query to search OrganizationFacilities
    executeQuery(query, null)
      .then((result) => {
        // Check if no OrganizationFacilities are found
        if (validator.isNullOrEmpty(result) && validator.isNullOrEmpty(result[0])) {
          // No OrganizationFacilities found, call the callback with null data and an appropriate message
          callback(result, null);
        } else {      
          // If OrganizationFacilities found, pass it
          callback(result[0], null);
        }
      })
      .catch((error) => {
        // If an error occurs during the API call, construct an error message
        const errMsg = `${errorMessages.ERROR_FETCHING_ORGANIZATION_FACILITY}, ${error.message}`;
  
        // Call the callback function with no result (null) and the error message
        callback(null, errMsg);
      });
  }


/*
Author     : Abhijith JS
Date       : 15 November 2024
Purpose    : Function for fetching organization Facility by ID
parameter  : organizationFacilityID
return type: callback
*/
  function getOrganizationFacilityByID(organizationFacilityID, callback) {
    let query = queries.qGetOrganizationFacilityByID(organizationFacilityID);
    
    // Execute query to get organization facility by organizationFacilityID
    executeQuery(query, null)
      .then((result) => {
        // Check if organizationFacility exists
        if (validator.isNullObject(result) || result.length === 0) {
          // If organizationFacility not found, return an error message
          const errMsg = errorMessages.ERROR_FETCHING_ORGANIZATION_FACILITY;
          callback(null, errMsg);
        } else {
          // If organizationFacility found, return the organizationFacility details
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
Date       : 18 November 2024
Purpose    : function for deleting organization facility by ID.
parameter  : deleteOrganizationFacilityData 
return type: callback
*/
function deleteOrganizationFacility(deleteOrganizationFacilityData, callback) {
  let query = queries.qDeleteOrganizationFacility(deleteOrganizationFacilityData);

  executeQuery(query, null)
    .then((result) => {
      // Check if the delete operation was successful
      if (validator.isNullObject(result) || result.affectedRows === 0) {
        // If no records were deleted,
        callback(false, errorMessages.ERROR_DELETING_ORGANIZATION_FACILITY);
      } else {
        // If records were deleted
        callback(true, null);
      }
    })
    .catch((error) => {
      const errMsg = `${errorMessages.ERROR_DELETING_ORGANIZATION_FACILITY}, ${error.message}`;
      callback(null, errMsg); // Error
    });
}






  module.exports = {
    saveorganizationFacility,
    updateOrganizationFacility,
    searchOrganizationFacility,
    getOrganizationFacilityByID,
    deleteOrganizationFacility
  };