const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");
const globalConstants = require("../common/globalConstants");

/*
Author     : Abhijith JS
Date       : 21 May 2024
Purpose    : MySql query function for user signup.
parameter  : userEnteredDetails 
return     : sql query
*/
exports.qSaveUser = function (userEnteredDetails) {
  const sql = `CALL ${globalConstants.connectionString.database}.cSaveUser('${validator.escapeHtml(userEnteredDetails.firstName)}', '${validator.escapeHtml(userEnteredDetails.lastName)}','${userEnteredDetails.phoneNumber}' , '${userEnteredDetails.email}', '${userEnteredDetails.encryptedPassword}', NULL, generate_sfid(),now())`;
  return sql;
};

/*
Author     : Abhijith JS
Date       : 22 May 2024
Purpose    : MySql query function to get user by id.
parameter  : userID 
return     : sql query
*/

exports.qGetUserByID = function (userID) {

  let sql = `CALL ${globalConstants.connectionString.database}.cGetUserByID(${userID})`;
  return sql;
};

/*
Author     : Abhijith JS
Date       : 21 May 2024
Purpose    : MySql query function to search user by input user details.
parameter  : userEnteredDetails 
return     : sql query
*/


exports.qSearchUser = function (userEnteredDetails, page, pageSize) {
  // Handle null or empty values and sanitize inputs
  const firstName = userEnteredDetails.firstName ? `'${userEnteredDetails.firstName}'` : 'NULL';
  const lastName = userEnteredDetails.lastName ? `'${userEnteredDetails.lastName}'` : 'NULL';
  const phoneNumber = userEnteredDetails.phoneNumber ? `'${userEnteredDetails.phoneNumber}'` : 'NULL';
  const email = userEnteredDetails.email ? `'${userEnteredDetails.email}'` : 'NULL';
  const pageValue = page ? `${page}` : 'NULL';
  const pageSizeValue = pageSize ? `${pageSize}` : 'NULL';

  // Concatenate the values into Store procedure Call
  let sql = `CALL ${globalConstants.connectionString.database}.cSearchUser(${firstName}, ${lastName}, ${phoneNumber}, ${email}, ${pageValue}, ${pageSizeValue})`;

  return sql;
};




/*
Author     : Abhijith JS
Date       : 27 September 2024
Purpose    : MySql query function to search user details with keyword.
parameter  : keywordSearchText 
return     : sql query
*/
exports.qKeySearchUser = function (keywordSearchText, userId, page, pageSize) {

  let orConditions = [];
  let andConditions = [];
  let limitations;
  let conditions = "";

  if (keywordSearchText) {
    // List of fields to search
    const searchFields = ["u.FirstName", "u.LastName", "u.Email", "u.PhoneNumber", "CONCAT(u.firstName, '' '', u.lastName)"];

    // Build search conditions for each field
    searchFields.forEach(field => {
      orConditions.push(`${field} LIKE ''%${keywordSearchText}%''`);
    });

  }

          // Combine OR conditions
          if (orConditions.length > 0) {
            conditions += '(' + orConditions.join(" OR ") + ')';
          }

          if (!validator.isNullOrEmpty(userId)) {
            andConditions.push(`u.userID  = ${userId}`);
          }
      
          // Combine AND conditions
          if (andConditions.length > 0) {
            conditions += (conditions ? ' AND ' : '') + andConditions.join(" AND ");
          }


  // Pagination logic
  if (!validator.isNullOrEmpty(page || pageSize)) {
    const offset = (page - 1) * pageSize;
    limitations = `LIMIT ${pageSize} OFFSET ${offset}`;
  }

  // Pass conditions and limitations as parameters to the stored procedure
  conditions = !validator.isNullOrEmpty(conditions) ? `'${conditions}'` : null
  limitations = !validator.isNullOrEmpty(limitations) ? `'${limitations}'` : null

  let sql = `CALL cSearchUserByKey(${conditions}, ${limitations});`;

  return { sql };
};

/*
Author     : Abhijith JS
Date       : 22 May 2024
Purpose    : MySql query function to update user details.
parameter  : userEnteredDetails 
return     : sql query
*/
exports.qUpdateUser = function (userEnteredDetails, userID) {
  let sql = `UPDATE tuser SET`;
  let fields = [];

  if (validator.isNullOrEmpty(userEnteredDetails)) {
    return { error: errorMessages.ERROR_MISSINGSEARCHFIELD };
  }
  if (validator.isNullOrEmpty(userID)) {
    return { error: errorMessages.ERROR_NOUSERID };
  }

  if (!validator.isNullOrEmpty(userEnteredDetails.firstName)) {
    fields.push(`FirstName = '${userEnteredDetails.firstName}'`);
  }
  if (!validator.isNullOrEmpty(userEnteredDetails.lastName)) {
    fields.push(`LastName = '${userEnteredDetails.lastName}'`);
  }
  if (!validator.isNullOrEmpty(userEnteredDetails.phoneNumber)) {
    fields.push(`PhoneNumber = '${userEnteredDetails.phoneNumber}'`);
  }
  if (!validator.isNullOrEmpty(userEnteredDetails.email)) {
    fields.push(`Email = '${userEnteredDetails.email}'`);
  }
  if (!validator.isNullOrEmpty(userEnteredDetails.userID)) {
    fields.push(`UpdatedBy = '${userEnteredDetails.userID}'`);
  }
  if (!validator.isNullOrEmpty(userEnteredDetails.userID)) {
    fields.push(`UpdatedDate = now()`);
  }

  // Construct the SQL query
  sql += ` ${fields.join(", ")} WHERE userID = ${userEnteredDetails.userID}`;
  return { sql };
};

/*
Author     : Abhijith JS
Date       : 22 May 2024
Purpose    : MySql query function to delete user by id.
parameter  : userID 
return     : sql query
*/
exports.qDeleteUser = function (dataPassed) {
  if (validator.isNullOrEmpty(dataPassed.userID)) {
    return { error: errorMessages.ERROR_NOUSERID };
  } else if (validator.isNullOrEmpty(dataPassed.actionCode)) {
    return { error: errorMessages.ERROR_ACTIONCODEMISSING };
  } else {
    let sql = `call sportfolio.cDeleteUser('${dataPassed.userID}','${dataPassed.actionCode}');`;
    return sql;
  }
};

//mysql query function to check if email already exists
exports.qCheckEmailExists = function (email) {
  let sql = `CALL sportfolio.GetUserByEmail('${email}')`;
  return sql;
};

//sql to check mail not matching with id
exports.qExcludeCurrentUser = function (userEnteredDetails) {
  let sql = `SELECT FirstName,
    LastName,
    PhoneNumber,
    Email,
    UserID FROM tuser WHERE `;
  sql += `Email= '${userEnteredDetails.Email}' AND UserID != '${userEnteredDetails.userID}'`;
  return sql;
};


/*
Author     : Abhijith JS
Date       : 30 September 2024
Purpose    : for Saving user avatar
parameter  : userEnteredDetails 
return type: sql query
*/
exports.qSaveUserAvatar = function(userEnteredDetails) {
  const { userID, uploadsInfo } = userEnteredDetails;
  const uploadsJson = JSON.stringify(uploadsInfo);
  
  const sql = `CALL cSaveUserAvatar(${userID}, '${uploadsJson}', NULL);`;
  
  return sql;
}

/*
Author     : Abhijith JS
Date       : 30 September 2024
Purpose    : for Updating user avatar
parameter  : userEnteredDetails 
return type: sql query
*/
exports.qUpdateUserAvatar = function (userEnteredDetails) {
  const {userID, uploadsInfo, documentID} = userEnteredDetails;
  const uploadsJson = JSON.stringify(uploadsInfo);

  const formatValue = (value) =>
    value === undefined || validator.isNullOrEmpty(value) ? null : `'${value}'`;

  const sql = `CALL cSaveUserAvatar(
    ${formatValue(userID) || 'NULL'},
    ${formatValue(uploadsJson) || 'NULL'},
    ${formatValue(documentID) || 'NULL'});`;

  return sql;
};
