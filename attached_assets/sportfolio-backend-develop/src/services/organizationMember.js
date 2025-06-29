const express = require("express");
const { executeQuery } = require("../common/dbConnect");
const queries = require("../sql/organizationMember");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const globalConstants = require("../common/globalConstants");
const app = express();
app.use(express.json());

/*
Author     : Varun H M
Date       : 10 October 2024
Purpose    : Function for saving new organization member
parameter  : organizationData
return type:  callback
*/
function saveOrganizationMember(organizationMemberData, callback) {
    const { organizationID, memberID } = organizationMemberData;
  
    // Check if organization or member exists and checking duplicate
    let checkQuery = queries.qCheckOrganizationIdAndMemberExists(organizationID, memberID);

    executeQuery(checkQuery, null)
      .then((checkResult) => {
        if (checkResult.length > 0) {
          let organizationExists = false;
          let memberExists = false;
          let organizationMemberExists = true;
  
          // Check each record to see if the name or email exists
          for (let record of checkResult) {
            if (record.organizationID == organizationID) {
              organizationExists = true;
            }
            if (record.memberID == memberID) {
              memberExists = true;
            }
            if (validator.isNullOrEmpty(record.organizationMemberID)) {
              organizationMemberExists = false;
            }
          }
  
          let errMsg = globalConstants.emptyString;
          if (organizationExists) {
            errMsg = errorMessages.ERROR_ORGANIZATION_ID_NOT_EXISTS;
          }
          if (memberExists) {
              errMsg = errorMessages.ERROR_MEMBER_ID_NOT_EXISTS;
          }
          //if member already exists, then return error
          if(!organizationMemberExists){
            errMsg = errorMessages.ERROR_ORGANIZATION_MEMBER_EXISTS
          }
          // callback(null, errMsg);
          throw new Error(errMsg); // Stop further execution
        }
  
        // If both checks pass, save the new organization
        let saveQuery = queries.qSaveOrganizationMember(organizationMemberData);
        return executeQuery(saveQuery, null);
      })
  
      .then((result) => {
        if (validator.isNullObject(result) && result.length <= 0) {
          const errMsg = errorMessages.ERROR_SAVINGORGANIZATIONMEMBER;
          callback(null, errMsg);
        } else {
          const organizationMemberID = result[0].OrganizationMemberID;
  
          //Returning the new user's userID
          callback(organizationMemberID, null);
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
Date       : 10 October 2024
Purpose    : Function for updating organization member
parameter  : organizationMemberData
return type:  callback
*/
function updateOrganizationMember(updateOrganizationData, callback) {
  const {organizationID, memberID, organizationMemberID } = updateOrganizationData;
  let checkQuery = queries.qCheckOrganizationIdAndMemberExistsUpdate(organizationID, memberID, organizationMemberID);
  executeQuery(checkQuery, null).then((checkResult) => {
    if (checkResult.length > 0 ) {
                  let organizationExists = false;
            let memberExists = false;
            let organizationMemberExists = false;
    
            // Check each record to see if the name or email exists
            for (let record of checkResult) {
              if (record.organizationID === organizationID) {
                organizationExists = true;
              }
              if (record.memberID === memberID) {
                memberExists = true;
              }
              if (record.organizationMemberID === +organizationMemberID) {
                organizationMemberExists = true;
              }
            }
    
            let errMsg = globalConstants.emptyString;
            if (organizationExists) {
              errMsg = errorMessages.ERROR_ORGANIZATION_ID_NOT_EXISTS;
            }
            if (memberExists) {
                errMsg = errorMessages.ERROR_MEMBER_ID_NOT_EXISTS;
            }
            if (organizationMemberExists) {
              errMsg = errorMessages.ERROR_ORGANIZATION_MEMBER_EXISTS;
            }
      return callback(null, errMsg);
    }

    
    // Execute user details update query
    let query = queries.qUpdateOrganizationMember(updateOrganizationData);
    executeQuery(query, null)
      .then((result) => {
        if (validator.isNullObject(result) || result.length === 0) {
          callback(null, errorMessages.ERROR_UPDATEFAILED);
        } else {
          // Returns userID if update successful
          callback(organizationMemberID, null);
        }
      })
      .catch((error) => {

        //if error occurs during API call
        const errMsg = `${errorMessages.ERROR_UPDATEFAILED}, ${error.message}`;
        callback(null, errMsg);
      });
   });
}


/*
Author     : Varun H M
Date       : 10 October 2024
Purpose    : Function for getting organization member by organizationMemberID
parameter  : organizationMemberID
return type:  callback
*/
function getOrganizationMemberByID(organizationMemberID, callback) {
  let query = queries.qGetOrganizationMemberByID(organizationMemberID);
  //execute query to get user by userid
  executeQuery(query, null)
    .then((result) => {
      // Check if user exists
      if (validator.isNullObject(result) || result.length === 0) {
        // If user not found, return an error message
        const errMsg = errorMessages.ERROR_FINDING_ORGANIZATION_MEMBER_BYID;
        callback(null, errMsg);
      } else {
        // If user found, return the user details
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
Author     : Varun H M
Date       : 10 October 2024
Purpose    : Function for searching organization member
parameter  : searchOrganizationMemberData
return type:  callback
*/
function searchOrganizationMember(searchOrganizationData, userID, page, pageSize, callback) {
  let query = queries.qSearchOrganizationMember(
    searchOrganizationData,
    userID,
    page,
    pageSize
  );
  //Execute query to search users
  executeQuery(query, null)
    .then((result) => {
      // Check if no users are found
      if (validator.isNullOrEmpty(result) && validator.isNullOrEmpty(result[0])) {
        // No users found, call the callback with null data and an appropriate message
        callback(result, null);
      } else {      
        //if users found, pass it
        callback(result[0], null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_FETCHING_ORGANIZATION_MEMBER_DETAILS} , ${error.message}`;

      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}


/*
Author     : Varun H M
Date       : 10 October 2024
Purpose    : Function for deleting organization member
parameter  : organizationMemberData
return type:  callback boolean
*/
function deleteOrganizationMember(organizationMemberID, callback) {
      //query executed to deete user
      let query = queries.qDeleteOrganizationMember(organizationMemberID);

      //execute query to delete user
      executeQuery(query, null)
        .then((result) => {
          // Check if the delete operation was successful
          if (validator.isNullObject(result) || result.affectedRows === 0) {
            // If no users were deleted,
            callback(false, errorMessages.ERROR_DELETING_ORGANIZATION_MEMBER);
          } else {
            // If users were deleted
            callback(true, null);
          }
        })
        .catch((error) => {
          // If an error occurs during the API call, construct an error message
          const errMsg = `${errorMessages.ERROR_DELETING_ORGANIZATION_MEMBER} , ${error.message}`;

          callback(false, errMsg);
        });
}



/*
Author     : Abhijith JS
Date       : 08 November 2024
Purpose    : Function for fetching OrganizationMembersStatus count
parameter  : organizationID
return type: callback
*/
function getOrganizationMembersStatusData(organizationID, userID, callback) {
  let query = queries.qgetOrganizationMembersStatusData(organizationID, userID);
  //execute query to get user by userid
  executeQuery(query, null)
    .then((result) => {
      // Check if OrganizationMembersStatusData exists
      if (validator.isNullObject(result) || result.length === 0) {
        // If OrganizationMembersStatusData not found, 
        callback([], errMsg);
      } else {
        // If OrganizationMembersStatusData found, return the OrganizationMembersStatus details
        callback(result[0], null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_FETCHING_ORGANIZATION_MEMBERS_STATUS_DETAILS} , ${error.message}`;
      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}

/*
Author     : Varun H M
Date       : 13 November 2024
Purpose    : Sql Function for fetching members details that are not added in organization member by organizationId
parameter  : searchMemberData, page, pageSize
return type: callback
*/
function searchMemberForOrganizationMember(searchMemberData, page, pageSize, callback) {
  let query = queries.qsearchMemberForOrganizationMember(searchMemberData, page, pageSize,);
  //execute query to get user by userid
  executeQuery(query, null)
    .then((result) => {
      // Check if searchMemberForOrganizationMember exists
      if (validator.isNullObject(result) || result.length === 0) {
        // If searchMemberForOrganizationMember not found, 
        callback([], errMsg);
      } else {
        // If searchMemberForOrganizationMember found, return the OrganizationMembersStatus details
        callback(result[0], null);
      }
    })
    .catch((error) => {
      // If an error occurs during the API call, construct an error message
      const errMsg = `${errorMessages.ERROR_NOUSER} , ${error.message}`;
      // Call the callback function with no result (null) and the error message
      callback(null, errMsg);
    });
}

  /*
Author     : Varun H M
Date       : 27 December 2024
Purpose    : Function for updating organization member ownership
parameter  : organizationMemberOwnershipData
return type:  callback
*/
function updateOrganizationMemberOwnership(organizationMemberOwnershipData, callback) {
    
    // Execute user details update query
    let query = queries.qUpdateOrganizationMemberOwnership(organizationMemberOwnershipData);
    executeQuery(query, null)
      .then((result) => {
        if (validator.isNullObject(result) || result.length === 0) {
          callback(null, errorMessages.ERROR_UPDATE_ORGANIZATION_MEMBER_OWNERSHIP);
        } else {
          // Returns userID if update successful
          callback("Success", null);
        }
      })
      .catch((error) => {
        //if error occurs during API call
        const errMsg = `${errorMessages.ERROR_UPDATE_ORGANIZATION_MEMBER_OWNERSHIP}, ${error.message}`;
        callback(null, errorMessages.ERROR_UPDATE_ORGANIZATION_MEMBER_OWNERSHIP);
      });

}



module.exports = {
    saveOrganizationMember,
    updateOrganizationMember,
    getOrganizationMemberByID,
    searchOrganizationMember,
    deleteOrganizationMember,
    getOrganizationMembersStatusData,
    searchMemberForOrganizationMember,
    updateOrganizationMemberOwnership

};
