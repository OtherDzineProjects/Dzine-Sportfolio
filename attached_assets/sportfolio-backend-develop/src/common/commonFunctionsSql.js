const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");
const globalConstants = require("../common/globalConstants");
const commonFunctions = require("../common/commonFunctions");



/*
Author     : Abhijith JS
Date       : 20 August 2024
Purpose    : sql query for getting region data by matching parentID and regiontype.
parameter  : dataPassed
return type: sql
*/
exports.qGetLocation = function(dataPassed){
    const { parentID, regionType } = dataPassed;
    
    if(validator.isNullOrEmpty(parentID) && validator.isNullOrEmpty(regionType)){
        return response.status(404).json({
            success:false,
            data:null,
            errMsg:errorMessages.ERROR_NOREGIONID
    })
    }

    let sql;

    if(!validator.isNullOrEmpty(parentID)){
        sql = `SELECT tr.ParentRegionID,tr.RegionID as id,tr.RegionName as name,ty.RegionTypeName
                    FROM tregion tr
                    JOIN tregiontype ty ON tr.RegionTypeID = ty.RegionTypeID
                    WHERE tr.ParentRegionID = '${parentID}'
                    AND tr.RegionTypeID = '${regionType}';`
    } else{
        sql = `SELECT tr.RegionID as id, tr.RegionName as name, ty.RegionTypeName
                FROM tregion tr
                INNER JOIN tregiontype ty ON tr.RegionTypeID = ty.RegionTypeID
                WHERE tr.ParentRegionID IS NULL OR tr.ParentRegionID = 0 AND tr.RegionTypeID = '${regionType}';`
    }

return sql;
}

exports.getLookupByTypeName = function(dataPassed){

    const { lookupTypeName, userID, lookupType, searchCriteria }= dataPassed;

    let sql = `CALL ${globalConstants.connectionString.database}.cGetLookupDetails('${lookupType}','${lookupTypeName}','${userID}','${searchCriteria}');`;

return sql;
}

exports.qCheckCommunicationType = function (communicationType) {
    let sql = `SELECT LookupDetailID,LookupDetailName FROM tlookupdetail WHERE LookupDetailID = ${communicationType}`;
    return sql;
};


/*
Author     : ABHIJITH JS
Date       : 18 November 2024
Purpose    : Sql function for updating organization member status
parameter  : updateOrganizationMemberStatusData
return type: call to mysql store procedure
*/
exports.qUpdateOrganizationMemberStatus = function (organizationMemberData) {
    const {
      organizationMemberID,
      statusID,
      status,
      notes,
      userID
    } = organizationMemberData;
  
    const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

  
    const sql = `CALL sportfolio.cUpdateOrganizationMemberStatus( 
                  ${formatValue(organizationMemberID)}
                , ${formatValue(statusID)}
                , ${formatValue(status)}
                , ${formatValue(notes != undefined ? commonFunctions.escapeSqlString(notes) : notes )}
                , ${formatValue(userID)})`;

    return sql;
  };



/*
Author     : ABHIJITH JS
Date       : 25 November 2024
Purpose    : Sql function for checking, to display Apply,Revoke membership button required or not
parameter  : dataPassed
return type: sql
*/
exports.qShowApplyMembershipButton = function(dataPassed){

    let sql = `CALL ${globalConstants.connectionString.database}.cShowApplyMembershipButton(${dataPassed.organizationID}, ${dataPassed.userID})`;

    return sql;

}



/*
Author     : Abhijith JS
Date       : 5 June 2024
Purpose    : Sql Function for searching organization 
parameter  : searchOrganizationListData
return type:  sql
*/
exports.qSearchOrganizationList = function (
  searchOrganizationData,
  userID,
  page,
  pageSize
) {
  let andConditions = []; // For AND conditions
  let orConditions = []; // For OR conditions
  let limitations = ''; // Initialize limitations as an empty string
  let conditions = "";
  let statusType = "";

  if (searchOrganizationData) {
    if (!validator.isNullOrEmpty(searchOrganizationData.organizationName)) {
      orConditions.push(`tog.OrganizationName LIKE ''${searchOrganizationData.organizationName}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.organizationEmail)) {
      orConditions.push(`tog.OrganizationEmail LIKE ''${searchOrganizationData.organizationEmail}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.organizationID)) {
      orConditions.push(`tog.OrganizationID LIKE ''${searchOrganizationData.organizationID}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.organizationTypeID)) {
      orConditions.push(`tog.OrganizationTypeID = ${searchOrganizationData.organizationTypeID}`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.registrationNumber)) {
      orConditions.push(`tog.RegistrationNumber LIKE ''${searchOrganizationData.registrationNumber}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.registrationValidFrom)) {
      orConditions.push(`tog.RegistrationValidFrom = ''${searchOrganizationData.registrationValidFrom}''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.registrationValidTo)) {
      orConditions.push(`tog.RegistrationValidTo = ''${searchOrganizationData.registrationValidTo}''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.inchargeName)) {
      orConditions.push(`tog.InchargeName LIKE ''${searchOrganizationData.inchargeName}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.inchargePhone)) {
      orConditions.push(`tog.InchargePhone LIKE ''${searchOrganizationData.inchargePhone}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.inchargeEmail)) {
      orConditions.push(`tog.InchargeEmail LIKE ''${searchOrganizationData.inchargeEmail}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.website)) {
      orConditions.push(`tog.Website LIKE ''${searchOrganizationData.website}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.phoneNumber)) {
      orConditions.push(`tog.PhoneNumber LIKE ''${searchOrganizationData.phoneNumber}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.country)) {
      orConditions.push(`tog.CountryID = ''${searchOrganizationData.country}''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.city)) {
      orConditions.push(`tog.CityID = ''${searchOrganizationData.city}''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.district)) {
      orConditions.push(`tog.DistrictID = ''${searchOrganizationData.district}''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.state)) {
      orConditions.push(`tog.StateID = ''${searchOrganizationData.state}''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.localBodyType)) {
      orConditions.push(`tog.LocalBodyType LIKE ''${searchOrganizationData.localBodyType}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.localBodyName)) {
      orConditions.push(`tog.LocalBodyName LIKE ''${searchOrganizationData.localBodyName}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.wardName)) {
      orConditions.push(`tog.WardName LIKE ''${searchOrganizationData.wardName}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.postOffice)) {
      orConditions.push(`tog.PostOffice LIKE ''${searchOrganizationData.postOffice}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.pincode)) {
      orConditions.push(`tog.Pincode LIKE ''${searchOrganizationData.pinCode}%''`);
    }

    if (!validator.isNullOrEmpty(searchOrganizationData.type)) {
      statusType =  searchOrganizationData.type.toUpperCase()
    }

  }

  // Combine OR conditions
  if (orConditions.length > 0) {
    conditions += '(' + orConditions.join(" OR ") + ')';
  }

  // Combine AND conditions
  if (andConditions.length > 0) {
    conditions += (conditions ? ' AND ' : '') + andConditions.join(" AND ");
  }

  // Handle pagination
  if (page && pageSize) {
    const offset = (page - 1) * pageSize;
    limitations = `LIMIT ${pageSize} OFFSET ${offset}`;
  }

  conditions = !validator.isNullOrEmpty(conditions) ? `'${conditions}'` : null;
  limitations = !validator.isNullOrEmpty(limitations) ? `'${limitations}'` : null;
  statusType = !validator.isNullOrEmpty(statusType) ? `'${statusType}'` : null;

  let sql = ` CALL ${globalConstants.connectionString.database}.cSearchOrganizationList(${conditions}, ${limitations}, ${statusType});`;

  return { sql };
};



/*
Author     : ABHIJITH JS
Date       : 02 December 2024
Purpose    : route for updating notification status
parameter  : updateNotificationStatusData
return type: call to mysql store procedure
*/
exports.qUpdateNotificationStatus = function (updateNotificationStatusData) {
  const {
    notificationID,
    statusID,
    status,
    notes,
    userID
  } = updateNotificationStatusData;

  const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

  const sql = `CALL sportfolio.cUpdateNotificationStatus( 
                ${formatValue(notificationID)}
              , ${formatValue(statusID)}
              , ${formatValue(status)}
              , ${formatValue(notes != undefined ? commonFunctions.escapeSqlString(notes) : notes )}
              , ${formatValue(userID)})`;

  return sql;
};



/*
Author     : Abhijith JS
Date       : 19 December 2024
Purpose    : Sql function for checking if user with the email exists and to fetch template for Forgot Password
parameter  : resetData 
return type: sql
*/
exports.qfetchTemplateData = function (resetData) {

  let sql = `CALL ${globalConstants.connectionString.database}.cfetchTemplateForgotPassword('${resetData.action}', '${resetData.email}')`;
  return sql;
};



/*
Author     : Abhijith JS
Date       : 19 December 2024
Purpose    : Sql function for generating and storing the otp
parameter  : resetData 
return type: sql
*/
exports.cGenerateAndStoreOtp = function({ userSettingsType, email }){

  let sql = `CALL ${globalConstants.connectionString.database}.cGenerateAndStoreOtp('${userSettingsType}', '${email}')`;
  return sql;

}



/*
Author     : Abhijith JS
Date       : 23 December 2024
Purpose    : Function for saving new password
parameter  : updateData 
return type: callback
*/
exports.qUpdatePassword = function(updateData){

  const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

  let sql =  `CALL ${globalConstants.connectionString.database}.cUpdateUserPassword(
                    '${updateData.userID}', '${updateData.encryptedNewPassword}', ${formatValue(updateData.encryptedExistingPassword)});`;

return sql;

}



/*
Author     : Abhijith JS
Date       : 23 December 2024
Purpose    : Function for validating via mail recieved otp 
parameter  : validateDetails 
return type: sql
*/
exports.qValidateTemporaryPassword = function(validateDetails){

  let sql =  `CALL ${globalConstants.connectionString.database}.cValidateTemporaryPassword('${validateDetails.email}', '${validateDetails.otp}');`;

return sql;

}



/*
Author     : Abhijith JS
Date       : 24 December 2024
Purpose    : Function for checking access to edit,select,etc buttons
parameter  : dataPassed
return type: sql
*/
exports.qAccessCheck = function(dataPassed){

  let sql =  `CALL ${globalConstants.connectionString.database}.cAccessCheck('${dataPassed.editType}', '${dataPassed.organizationID}', '${dataPassed.userID}');`;

return sql;

}


/*
Author     : Abhijith JS
Date       : 30 December 2024
Purpose    : To make a member of an organization as Admin/notAdmin
parameter  : roleDataPassed
return type: sql
*/
exports.qRoleChange = function(dataPassed){

 const { organizationID, isAdmin, userID, currentUserID } = dataPassed;

  let sql =  `CALL ${globalConstants.connectionString.database}.cUpdateOrganizationUserRole('${userID}', '${isAdmin}', '${organizationID}', '${currentUserID}');
`;

return sql;

}