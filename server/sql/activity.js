const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");


/*
Author     : Abhijith JS
Date       : 29 August 2024
Purpose    : sql function for saving activity
parameter  : activityData
return type: sql query
*/
exports.qSaveActivity = function (activityData) {
    const {
        activityName,
        activityDescription,
        parentID,
        userID,
      } = activityData;
    return `CALL cSaveActivity('${activityName}','${activityDescription}','${parentID}','${userID}',NULL)`;
  };


/*
Author     : Abhijith JS
Date       : 29 August 2024
Purpose    : sql function for fetching activity
parameter  : activityID
return type: sql query
*/
  exports.qGetActivityByID = function (activityID) {
    let sql = `SELECT ActivityName,ActivityDescription,ParentID FROM tactivity WHERE ActivityID = ${activityID}`;
    return sql;
  };


/*
Author     : Abhijith JS
Date       : 29 August 2024
Purpose    : sql function for updating activity
parameter  : activityData
return type: sql query
*/
  exports.qUpdateActivity = function (updateActivityData) {
    const {
      activityName,
      activityDescription,
      parentID,
      userID,
      activityID
    } = updateActivityData;
  
    const formatValue = (value) =>
      value === undefined || validator.isNullOrEmpty(value) || value === ""
        ? "NULL"
        : `'${value}'`;
  
    const sql = `CALL cSaveActivity(
      ${formatValue(activityName)}, 
      ${formatValue(activityDescription)}, 
      ${parentID || "NULL"}, 
      ${userID || "NULL"}, 
      ${activityID || "NULL"}
    )`;
  
    return sql;
  };


/*
Author     : Abhijith JS
Date       : 30 August 2024
Purpose    : sql function for searching activity
parameter  : searchActivityData
return type: sql query
*/
exports.qSearchActivity = function (searchActivityData, page, pageSize) {
  // Initialize parameters
  const activityID = searchActivityData.activityID ? searchActivityData.activityID : null;
  const activityName = searchActivityData.activityName ? searchActivityData.activityName : null;
  const activityDescription = searchActivityData.activityDescription ? searchActivityData.activityDescription : null;
  const parentID = searchActivityData.parentID ? searchActivityData.parentID : null;

  // Prepare the SQL query to directly call the stored procedure with the parameters
  const sql = `CALL cSearchActivity(${activityID ? `'${activityID}'` : 'NULL'}, 
                                     ${activityName ? `'${activityName}'` : 'NULL'}, 
                                     ${activityDescription ? `'${activityDescription}'` : 'NULL'}, 
                                     ${parentID ? `'${parentID}'` : 'NULL'}, 
                                     ${page || 1}, 
                                     ${pageSize || 10}
                                    )`;

  return sql;
}


/*
Author     : Abhijith JS
Date       : 30 August 2024
Purpose    : sql function for deleting activity by activityID
parameter  : activityID
return type: sql query
*/
  exports.qDeleteActivity = function (activityID) {
    let sql = `DELETE FROM tactivity WHERE `;
  
    if (validator.isNullOrEmpty(activityID)) {
      return { error: errorMessages.ERROR_NOACTIVITY_ID };
    } else {
      sql += `ActivityID =${activityID}`;
      return sql;
    }
  };
  
  