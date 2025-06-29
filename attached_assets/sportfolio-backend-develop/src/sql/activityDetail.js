const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");
const globalConstants = require('../common/globalConstants');
const { escapeSqlString } = require("../common/commonFunctions");





/*
Author     : Abhijith JS
Date       : 07 November 2024
Purpose    : sql function for saving activityDetail
parameter  : activityDetailData
return type: sql 
*/
exports.qSaveActivityDetail = function (activityDetailData) {

    let { activityID, name, parentID, description, userID } = activityDetailData;
    const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

    return `CALL cSaveActivityDetail(${formatValue(activityID)},${formatValue(name)},${formatValue(parentID)}
    ,${formatValue(description != undefined ? escapeSqlString(description) : description )}, ${formatValue(userID)}, NULL)`;
  };


/*
Author     : Abhijith JS
Date       : 07 November 2024
Purpose    : sql function for checking activityDetail already exists
parameter  : activityDetailData
return type: sql 
*/
exports.qCheckActivityDetailExists = function(activityDetailData){

    let { activityID, name, activityDetailID } = activityDetailData;
    activityDetailID = activityDetailID != undefined ? activityDetailID : 0;

    const sql = `CALL ${globalConstants.connectionString.database}.cCheckActivityDetailExists('${activityID}','${name}', ${activityDetailID})`

    return sql;
}



/*
Author     : Abhijith JS
Date       : 07 November 2024
Purpose    : sql function for updating ActivityDetail Data
parameter  : updateActivityDetailData
return type: sql query
*/
exports.qUpdateActivityDetail = function (updateActivityDetailData) {
    let { activityID, name, parentID, description, userID, activityDetailID } = updateActivityDetailData;
    const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

    const sql =  `CALL cSaveActivityDetail(${formatValue(activityID)},${formatValue(name)},${formatValue(parentID)}
    ,${formatValue(description != undefined ? escapeSqlString(description) : description )}, ${formatValue(userID)}, ${formatValue(activityDetailID)})`;
  
    return sql;
  };



/*
Author     : Varun H M
Date       : 07 November 2024
Purpose    : Sql Function for fetching activity detail by activityDetailID
parameter  : activityDetailID
return type: sql
*/
exports.qGetActivityDetailByID = function (activityDetailID) {
  let sql = `CALL ${globalConstants.connectionString.database}.cGetActivityDetailByID(${activityDetailID});`;

  return sql;
};

/*
Author     : Varun H M
Date       : 07 November 2024
Purpose    : Sql Function for deleting activity Detail
parameter  : activityDetailID
return type:  sql
*/
exports.qDeleteActivityDetail = function (activityDetailID) {
  let sql = `call ${globalConstants.connectionString.database}.cDeleteActivityDetail(${activityDetailID});`;

  return sql;
};


/*
Author     : Varun H M
Date       : 07 November 2024
Purpose    : Sql Function for searching activity detail
parameter  : searchActivityDetailData
return type: sql
*/
exports.qSearchActivityDetail = function (searchActivityDetailData, page, pageSize) {

  let andConditions = []; // For AND conditions
  let orConditions = []; // For OR conditions
  let limitations = ''; // Initialize limitations as an empty string
  let conditions = "";

  if (searchActivityDetailData) {
    if (!validator.isNullOrEmpty(searchActivityDetailData.name)) {
      orConditions.push(`tad.Name LIKE ''${searchActivityDetailData.name}%''`);
    }

    if (!validator.isNullOrEmpty(searchActivityDetailData.activityDetailID)) {
      orConditions.push(`tad.ActivityDetailID = ${searchActivityDetailData.activityDetailID}`);
    }

    if (!validator.isNullOrEmpty(searchActivityDetailData.activityID)) {
      orConditions.push(`tad.activityID = ${searchActivityDetailData.activityID}`);
    }



    // Combine OR conditions
    if (orConditions.length > 0) {
      conditions += '(' + orConditions.join(" OR ") + ')';
    }

    // Combine AND conditions
    if (andConditions.length > 0) {
      conditions += (conditions ? ' AND ' : '') + andConditions.join(" AND ");
    }
  }

  // Handle pagination
  if (page && pageSize) {
    const offset = (page - 1) * pageSize;
    limitations = `LIMIT ${pageSize} OFFSET ${offset}`;
  }

  conditions = !validator.isNullOrEmpty(conditions) ? `'${conditions}'` : null;
  limitations = !validator.isNullOrEmpty(limitations) ? `'${limitations}'` : null;

  let sql = `
      CALL ${globalConstants.connectionString.database}.cSearchActivityDetail(${conditions}, ${limitations});`;

  return { sql };
};