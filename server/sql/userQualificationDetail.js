const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");
const globalConstants = require("../common/globalConstants");


/*
Author     : VARUN HM
Date       : 6 August 2024
Purpose    : SQL Query function to save user qualification details.
parameter  : userEnteredDetails 
return type: sql query
*/
exports.qSaveUserQualificationDetail = function (userEnteredDetails) {

  const uploadsJson = JSON.stringify(userEnteredDetails.uploadsInfo);
  const escapedUploadsJson = uploadsJson.replace(/'/g, "''"); // Escaping single quotes
  
  const sql = `CALL ${globalConstants.connectionString.database}.cSaveUserQualificationDetail ('${userEnteredDetails.qualificationTypeID}', 
  '${userEnteredDetails.userID}', '${validator.escapeHtml(userEnteredDetails.enrollmentNumber)}', '${userEnteredDetails.organizationID}', '${validator.escapeHtml(userEnteredDetails.notes)}',
  '${escapedUploadsJson}', NULL, '${validator.escapeHtml(userEnteredDetails.certificateNumber)}', '${userEnteredDetails.certificateDate}', '${userEnteredDetails.country}',
  '${userEnteredDetails.state}', '${userEnteredDetails.district}','${userEnteredDetails.localBodyType}','${userEnteredDetails.localBodyName}',NULL)`;

    return sql;
  };


/*
Author     : Abhijith JS
Date       : 04 September 2024
Purpose    : SQL Query function to check enrollment number/qalificationType already exists.
parameter  : userEnteredDetails 
return type: sql query
*/
exports.qCheckDuplicateExistsCreate = function(userEnteredDetails) {

  const sql = `CALL cCheckDuplicateQualification('${userEnteredDetails.userID}','${userEnteredDetails.qualificationTypeID}','${userEnteredDetails.enrollmentNumber}', NULL)`;
    return sql;
};


/*
Author     : Abhijith JS
Date       : 04 September 2024
Purpose    : SQL Query function to check enrollment number/qalificationType already exists.
parameter  : userEnteredDetails 
return type: sql query
*/
exports.qCheckDuplicateQualificationUpdate = function(userEnteredDetails) {

  const sql = `CALL cCheckDuplicateQualification('${userEnteredDetails.userID}','${userEnteredDetails.qualificationTypeID}','${userEnteredDetails.enrollmentNumber}',
   '${userEnteredDetails.userQualificationDetailID}')`;
    return sql;

};


/*
Author     : Abhijith JS
Date       : 6 August 2024
Purpose    : SQL Query function to get user qualification details.
parameter  : userQualificationDetailID 
return type: sql query
*/
exports.qGetUserQualificationDetailByID = function (userQualificationDetailID) {
  let sql = `
      SELECT tuqd.*, tld.LookupDetailName as QualificationType
      FROM tuserqualificationdetail tuqd
      JOIN tlookupdetail tld ON tld.LookupDetailID = tuqd.QualificationTypeID
      WHERE tuqd.userQualificationDetailID = '${userQualificationDetailID}';
    `;
      return sql;
  }



/*
Author     : Abhijith JS
Date       : 5 August 2024
Purpose    : SQL Query function to update user qualification details.
parameter  : userEnteredDetails 
return type: sql query
*/
exports.qUpdateUserQualificationDetail = function (userEnteredDetails) {
  const { qualificationTypeID,
    userID, 
    enrollmentNumber,
    organizationID,
    notes,
    uploadsInfo,
    removedFiles,
    certificateNumber,
    certificateDate,
    country,
    state,
    district,
    localBodyType,
    localBodyName,
    userQualificationDetailID,
     } = userEnteredDetails;
  const uploadsJson = JSON.stringify(uploadsInfo);

  const formatValue = (value) =>
    value === undefined || validator.isNullOrEmpty(value) ? null : `'${value}'`;

  const sql = `CALL cSaveUserQualificationDetail(
    ${formatValue(qualificationTypeID) || 'NULL'},
    ${formatValue(userID) || 'NULL'},
    ${formatValue(validator.escapeHtml(enrollmentNumber)) || 'NULL'},
    ${formatValue(organizationID) || 'NULL'},
    ${formatValue(validator.escapeHtml(notes)) || 'NULL'},
    ${formatValue(uploadsJson) || 'NULL'},
    ${formatValue(removedFiles) || 'NULL'},
    ${formatValue(validator.escapeHtml(certificateNumber)) || 'NULL'},
    ${formatValue(certificateDate) || 'NULL'},
    ${formatValue(country) || 'NULL'},
    ${formatValue(state) || 'NULL'},
    ${formatValue(district) || 'NULL'},
    ${formatValue(localBodyType) || 'NULL'},
    ${formatValue(localBodyName) || 'NULL'},
    ${formatValue(userQualificationDetailID) || 'NULL'})`;

  return sql;
};


/*
Author     : Abhijith JS
Date       : 5 August 2024
Purpose    : SQL Query function to delete user qualification details by userQualificationDetailID.
parameter  : userQualificationDetailID 
return type: sql query
*/
exports.qDeleteUserQualificationDetail = function(userQualificationDetailID){

    if (validator.isNullOrEmpty(userQualificationDetailID)) {
      return { error: errorMessages.ERROR_NOUSER_QUALIFCATIONDETAILID };
    }else {
      let sql = `CALL cDeleteUserQualificationDetail(${userQualificationDetailID});`
      return sql;
    }

  }

/*
Author     : VARUN HM
Date       : 6 August 2024
Purpose    : SQL Query function to search user qualification details.
parameter  : userEnteredDetails, page, pageSize
return type: sql query
*/
  exports.qsearchUserQualificationDetail = function (userEnteredDetails, page, pageSize) {
    let conditions = [];
    let limitations;

    if (userEnteredDetails) {
        if (!validator.isNullOrEmpty(userEnteredDetails.userID)) {
          conditions.push(`tuq.UserID = ${userEnteredDetails.userID}`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.firstName)) {
            conditions.push(`tu.FirstName LIKE ''${userEnteredDetails.firstName}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.lastName)) {
            conditions.push(`tu.LastName LIKE ''${userEnteredDetails.lastName}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.emailID)) {
            conditions.push(`tu.Email LIKE ''${userEnteredDetails.emailID}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.phoneNumber)) {
            conditions.push(`tu.PhoneNumber LIKE ''${userEnteredDetails.phoneNumber}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.Country)) {
          conditions.push(`trs.RegionName LIKE ''${userEnteredDetails.Country}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.state)) {
            conditions.push(`trs.RegionName LIKE ''${userEnteredDetails.state}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.district)) {
            conditions.push(`trd.RegionName LIKE ''${userEnteredDetails.district}%''`);
        }

        conditions = conditions.length > 0 ? conditions.join(" AND ") : null

    }

    if (!validator.isNullOrEmpty(page || pageSize)) {
        const offset = (page - 1) * pageSize;
        limitations = ` LIMIT ${pageSize} OFFSET ${offset}`;
    }
    
    conditions = !validator.isNullOrEmpty(conditions) ? `'${conditions}'` : null
    limitations = !validator.isNullOrEmpty(limitations) ? `'${limitations}'` : null


    let sql = `CALL cSearchUserQualificationDetail(${conditions},${limitations});`

    return { sql };
};