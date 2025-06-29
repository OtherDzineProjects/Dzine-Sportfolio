const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");
const globalConstants = require("../common/globalConstants");
const { escapeSqlString } = require("../common/commonFunctions");



/*
Author     : Abhijith JS
Date       : 28 November 2024
Purpose    : sql function for validating for duplicate Notification details
parameter  : notificationDetails
return type: sql
*/
exports.qCheckDuplicateNotification = function (notificationDetails) {

  let notificationID = notificationDetails.notificationID;
  let subject = notificationDetails.subject;

  notificationID = notificationID != undefined ? notificationID : 0;
  const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

    const sql = `CALL ${globalConstants.connectionString.database}.cCheckDuplicateNotification(
    ${formatValue(subject != undefined ? escapeSqlString(subject) : subject)}, '${notificationID}')`;

  return sql;
};


/*
Author     : Abhijith JS
Date       : 28 November 2024
Purpose    : sql function for saving Notification details
parameter  : notificationDetails
return type: sql
*/
exports.qSaveNotification = function (notificationData) {
    let {
        notificationType,
        subject,
        body,
        date,
        country,
        state,
        district,
        uploadsInfo, // This now holds the uploaded image path
        address,
        organizationID,
        notificationCreated,
        userID,
        notifyOrganizationIDs ,
        notifyAll,
      } = notificationData;

    const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;
    notifyAll = notifyAll !== undefined ? notifyAll : 0;

    const uploadsJson = JSON.stringify(uploadsInfo);

    let sql = `CALL ${globalConstants.connectionString.database}.cSaveNotification(
          ${formatValue(notificationType)}
        , ${formatValue(subject != undefined ? escapeSqlString(subject) : subject)}
        , ${formatValue(body != undefined ? escapeSqlString(body) : body)}
        , ${formatValue(date)}
        , ${formatValue(uploadsJson != undefined ? escapeSqlString(uploadsJson) : uploadsJson )}
        , NULL
        , ${formatValue(country)}
        , ${formatValue(state)}
        , ${formatValue(district)}
        , ${formatValue(address != undefined ? escapeSqlString(address) : address)}
        , ${formatValue(notificationCreated)}
        , ${formatValue(organizationID)}
        , ${formatValue(userID)}
        , ${formatValue(notifyOrganizationIDs)}
        ,'${notifyAll}'
        , NULL
    )`;

    return sql;
};



/*
Author     : Abhijith JS
Date       : 28 November 2024
Purpose    : sql function for fetching Notification by notificationID
parameter  : getNotificationData
return type: sql
*/
exports.qGetNotificationByID = function (getNotificationData) {

  let sql =  `CALL ${globalConstants.connectionString.database}.cGetNotificationByID(${getNotificationData.notificationID}, ${getNotificationData.userID})`;

  return sql;

}



/*
Author     : Abhijith JS
Date       : 29 November 2024
Purpose    : sql function for searching Notification by entered keyword
parameter  : keywordSearchText
return type: sql
*/
exports.qKeySearchNotification = function (keywordSearchText, fetchTypes, page, pageSize) {
  let conditions = "";
  let orConditions = [];
  let andConditions = [];

  let limitations;

  if (keywordSearchText) {
    // List of fields to search for notifications
    const searchFields = ["tvn.District","tvn.State","tn.NotificationID","tog.OrganizationName"];

    // Build search conditions for each field
    searchFields.forEach((field) => {
      orConditions.push(`${field} LIKE ''%${keywordSearchText}%''`);
    });
  }

  // Combine OR conditions
  if (orConditions.length > 0) {
    conditions += '(' + orConditions.join(" OR ") + ')';
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
  conditions = !validator.isNullOrEmpty(conditions) ? `'${conditions}'` : null;
  limitations = !validator.isNullOrEmpty(limitations) ? `'${limitations}'` : null;

  const formatValue = (value) =>
    value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

  // Use the stored procedure for searching notifications
  let sql = `CALL cSearchNotification(${conditions}, ${limitations}, ${formatValue(fetchTypes.type)},NULL,${fetchTypes.userID});`;

  return { sql };
};



/*
Author     : Abhijith JS
Date       : 29 November 2024
Purpose    : sql function for updating Notification by notificationID
parameter  : notificationData
return type: sql
*/
exports.qUpdateNotification = function (notificationData) {
  let {
    notificationID,       // New field to identify existing notifications for updates
    notificationType,
    subject,
    body,
    date,
    country,
    state,
    district,
    uploadsInfo,             // This now holds the uploaded image path
    removedFiles,
    address,
    organizationID,
    notificationCreated,
    userID,
    notifyOrganizationIDs,
    notifyAll,
  } = notificationData;

  const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

  // Default value for notifyAll if not provided
  notifyAll = notifyAll !== undefined ? notifyAll : 0;
  const uploadsJson = JSON.stringify(uploadsInfo);

  // If notificationID exists, we are updating an existing notification, otherwise it's an insert
  let sql = `CALL ${globalConstants.connectionString.database}.cSaveNotification(
        ${formatValue(notificationType)}
      , ${formatValue(subject != undefined ? escapeSqlString(subject) : subject)}
      , ${formatValue(body != undefined ? escapeSqlString(body) : body)}
      , ${formatValue(date)}
      , ${formatValue(uploadsJson != undefined ? escapeSqlString(uploadsJson) : uploadsJson )}
      , ${formatValue(removedFiles)}
      , ${formatValue(country)}
      , ${formatValue(state)}
      , ${formatValue(district)}
      , ${formatValue(address != undefined ? escapeSqlString(address) : address)}
      , ${formatValue(notificationCreated)}
      , ${formatValue(organizationID)}
      , ${formatValue(userID)}
      , ${formatValue(notifyOrganizationIDs)}
      ,'${notifyAll}'
      , ${formatValue(notificationID)}
    )`;

    return sql;
};



/*
Author     : Abhijith JS
Date       : 03 December 2024
Purpose    : Sql function for fetching Notification Status count
parameter  : NotificationID
return type: sql
*/
exports.qGetNotificationStatusData = function (userID) {
  // Construct the SQL to call a stored procedure for notification status data
  let sql = `CALL cGetNotificationStatusCount(${userID});`;

  return sql;
};



/*
Author     : Abhijith JS
Date       : 05 December 2024
Purpose    : Sql function for deleting Notification
parameter  : NotificationID
return type: sql
*/
exports.qDeleteNotification = function (notificationID) {
  let sql = `call ${globalConstants.connectionString.database}.cDeleteNotification(${notificationID});`;

  return sql;
};