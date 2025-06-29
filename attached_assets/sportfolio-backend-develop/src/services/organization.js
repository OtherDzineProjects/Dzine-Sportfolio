const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/organization");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const app = express();
app.use(express.json());

/*
Author     : Abhijith JS
Date       : 5 June 2024
Purpose    : Function for searching organization 
parameter  : searchOrganizationData
return type:  callback
*/
function searchOrganization(searchOrganizationData, userID, page, pageSize, callback) {
  let query = queries.qSearchOrganization(
    searchOrganizationData,
    userID,
    page,
    pageSize
  );
  //Execute query to search organizations
  executeQuery(query, null)
    .then((result) => {
      // Check if no organizations are found
      if (validator.isNullObject(result) || result.length === 0) {
        // No organizations found, call the callback with null data and an appropriate message
        callback(result, null);
      } else {      
        //if organizations found, pass it
        callback(result[0], null);
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
Author     : Abhijith JS
Date       : 5 June 2024
Purpose    : Function for getting organization by organizationID
parameter  : organizationID
return type:  callback
*/
function getOrganizationByID(organizationID, callback) {
  let query = queries.qGetOrganizationByID(organizationID);
  //execute query to get organization by organizationID
  executeQuery(query, null)
    .then((result) => {
      // Check if organization exists
      if (validator.isNullObject(result) || result.length === 0) {
        // If organization not found, return an error message
        const errMsg = errorMessages.ERROR_FINDINGORGANIZATION_BYID;
        callback(null, errMsg);
      } else {
        // If organization found, return the organization details
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
Date       : 6 June 2024
Purpose    : Function for saving new organization 
parameter  : organizationData
return type:  callback
*/
function saveOrganization(organizationData, callback) {
  const { organizationName, organizationEmail } = organizationData;

  // Check if organization name or email exists
  let checkQuery = queries.qCheckOrganizationNameAndEmail(
    organizationName,
    organizationEmail
  );
  executeQuery(checkQuery, null)
    .then((checkResult) => {
      if (checkResult.length > 0) {
        let nameExists = false;
        let emailExists = false;

        // Check each record to see if the organization name or email exists
        for (let record of checkResult) {
          if (record.OrganizationName === organizationName) {
            nameExists = true;
          }
          if (record.OrganizationEmail === organizationEmail) {
            emailExists = true;
          }
        }

        let errMsg = globalConstants.emptyString;
        if (nameExists) {
          errMsg = errorMessages.ERROR_ORGANIZATION_NAME_EXISTS;
        }
        if (emailExists) {
          if (errMsg) {
            errMsg +=
              globalConstants.andBetweenSpace +
              errorMessages.ERROR_ORGANIZATION_EMAIL_EXISTS;
          } else {
            errMsg = errorMessages.ERROR_ORGANIZATION_EMAIL_EXISTS;
          }
        }
        // callback(null, errMsg);
        throw new Error(errMsg); // Stop further execution
      }

      // If both checks pass, save the new organization
      let saveQuery = queries.qSaveOrganization(organizationData);
      return executeQuery(saveQuery, null);
    })

    .then((result) => {
      if (validator.isNullObject(result) && result.length <= 0) {
        const errMsg = errorMessages.ERROR_SAVINGORGANIZATION;
        callback(null, errMsg);
      } else {
        const organizationID = result[0].OrganizationID;

        //Returning the new organization's organizationID
        callback(organizationID, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_SAVINGORGANIZATION}, ${error.message}`;
      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}

/*
Author     : Abhijith JS
Date       : 6 June 2024
Purpose    : Function for updating organization 
parameter  : organizationData
return type:  callback
*/
function updateOrganization(updateOrganizationData, callback) {
  const { organizationID } = updateOrganizationData;

  // Check if organization exists
  getOrganizationByID(organizationID, (organizationDetails, error) => {
    if (error) {
      return callback(null, error);
    }

    if (
      validator.isNullOrEmpty(organizationDetails) ||
      organizationDetails.length === 0
    ) {
      return callback(null, errorMessages.ERROR_NO_ORGANIZATIONFOUND);
    }

    // Check if organization email exists
    let checkQuery = queries.qExcludeCurrentOrganization(
      updateOrganizationData
    );
    executeQuery(checkQuery, null).then((checkResult) => {
      if (!validator.isNullObject(checkResult)) {
        return callback(null, errorMessages.ERROR_EMAILEXISTS);
      }

      // Execute organization details update query
      let query = queries.qUpdateOrganization(updateOrganizationData);
      executeQuery(query, null)
        .then((result) => {
          if (validator.isNullObject(result) || result.length === 0) {
            return callback(null, errorMessages.ERROR_UPDATEFAILED);
          }

          // Returns organizationID if update successful
          return callback(organizationID, null);
        })
        .catch((error) => {
          // If error occurs during API call
          const errMsg = `${errorMessages.ERROR_UPDATEFAILED}, ${error.message}`;
          return callback(null, errMsg);
        });
    });
  });
}

/*
Author     : Abhijith JS
Date       : 5 June 2024
Purpose    : Function for deleting organization 
parameter  : organizationData
return type:  callback boolean
*/
function deleteOrganization(organizationID, callback) {
  getOrganizationByID(organizationID, (userDetails, error) => {
    if (error) {
      callback(false, error);
    } else if (userDetails === null || userDetails.length === 0) {
      callback(false, errorMessages.ERROR_NO_ORGANIZATIONFOUND);
    } else {
      //query executed to delete organization
      let query = queries.qDeleteOrganization(organizationID);

      //execute query to delete organization
      executeQuery(query, null)
        .then((result) => {
          // Check if the delete operation was successful
          if (validator.isNullObject(result) || result.affectedRows === 0) {
            // If no organizations were deleted,
            callback(false, errorMessages.ERROR_NO_ORGANIZATIONFOUND);
          } else {
            // If organizations were deleted
            callback(true, null);
          }
        })
        .catch((error) => {
          // If an error occurs during the API call, construct an error message
          const errMsg = `${errorMessages.ERROR_DELETING_ORGANIZATION} , ${error.message}`;

          callback(false, errMsg);
        });
    }
  });
}


/*
Author     : Abhijith JS
Date       : 28 October 2024
Purpose    : for Saving organization avatar
parameter  : organizationEnteredDetails
return type: callback
*/
function saveOrganizationAvatar(organizationEnteredDetails, callback) {

  let query = queries.qSaveOrganizationAvatar(organizationEnteredDetails);

  executeQuery(query, null)
    // Execute the query to add OrganizationProfilePhoto to the database
    .then((result) => {

      if (validator.isNullObject(result)) {
        const errMsg = errorMessages.ERROR_SAVING_AVATAR;
        return callback(null, errMsg);
      } else if (result[0].errMsg) {
        // Handle the case where a document already exists
        const errMsg = result[0].errMsg; // Use the error message returned from the stored procedure
        return callback(null, errMsg);
      } else {
        const documentID = result[0].DocumentID;
        // Returning the new document's documentID
        return callback(documentID, null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_SAVING_AVATAR}, ${error.message}`;
      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}


/*
Author     : Abhijith JS
Date       : 28 October 2024
Purpose    : Function for updating organization Avatar/profile photo 
parameter  : organizationEnteredDetails 
return type: callback
*/
function updateOrganizationAvatar(organizationEnteredDetails, callback) {
 
  // Execute organization avatar details update query
  let query = queries.qUpdateOrganizationAvatar(organizationEnteredDetails);
  executeQuery(query, null)
    .then((result) => {
      if (validator.isNullObject(result) || result.length === 0) {
        callback(null, errorMessages.ERROR_UPDATEFAILED);
      } else {
        // Returns documentID if update successful
        const documentID = result[0].DocumentID;
        callback(documentID, null);
      }
    })
    .catch((error) => {
      // If error occurs during API call
      const errMsg = `${errorMessages.ERROR_UPDATEFAILED}, ${error.message}`;
      callback(null, errMsg);
    });
}

/*
Author     : Abhijith JS
Date       : 20 November 2024
Purpose    : Function for Searching array of Organizations matching ANY user input details.
parameter  : keywordSearchText 
return type: callback
*/
function keySearchOrganization(keywordSearchText, fetchTypes, page, pageSize, callback) {
  // Generate the query for organization search
  let query = queries.qKeySearchOrganization(keywordSearchText, fetchTypes, page, pageSize);

  // Execute the query to search organizations
  executeQuery(query, null)
    .then((result) => {
      // Check if no organizations are found
      if (validator.isNullOrEmpty(result) || validator.isNullOrEmpty(result[0])) {
        // No organizations found, call the callback with null data
        callback([], null);
      } else {
        // If organizations are found, pass them to the callback
        callback(result[0], null);
      }
    })
    .catch((error) => {
      // Construct an error message if an error occurs
      const errMsg = `${errorMessages.ERROR_FETCHING_DETAILS} , ${error.message}`;

      // Call the callback function with no result and the error message
      callback(null, errMsg);
    });
}





module.exports = {
  searchOrganization,
  getOrganizationByID,
  saveOrganization,
  updateOrganization,
  deleteOrganization,
  saveOrganizationAvatar,
  updateOrganizationAvatar,
  keySearchOrganization,

};
