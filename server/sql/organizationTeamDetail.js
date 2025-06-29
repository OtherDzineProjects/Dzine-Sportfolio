const globalConstants = require("../common/globalConstants");
const validator = require("../common/validation");
const { escapeSqlString } = require("../common/commonFunctions");



/*
Author     : Abhijith JS
Date       : 05 November 2024
Purpose    : Sql Function for validating organization Team Details
parameter  : saveOrganizationTeamDetailData
return type: sql
*/
exports.qCheckorganizationTeamDetailDuplicate = function (saveOrganizationTeamDetailData) {
    let { organizationTeamID, userID, activityDetailID, organizationTeamDetailID } = saveOrganizationTeamDetailData;
    organizationTeamDetailID = organizationTeamDetailID != undefined ? organizationTeamDetailID : 0;

    let sql = `CALL ${globalConstants.connectionString.database}.cCheckorganizationTeamDetailDuplicate('${organizationTeamID}','${userID}', '${activityDetailID}'
    , '${organizationTeamDetailID}')`;

    return sql;
};



/*
Author     : Abhijith JS
Date       : 05 November 2024
Purpose    : Sql Function for saving organization Team Details
parameter  : saveOrganizationTeamDetailData
return type: sql
*/
exports.qSaveOrganizationTeamDetail = function (saveOrganizationTeamDetailData) {
    let { organizationTeamID, userID, activityDetailID } = saveOrganizationTeamDetailData;
    let sql = `CALL ${globalConstants.connectionString.database}.cSaveOrganizationTeamDetail('${organizationTeamID}','${userID}', '${activityDetailID}', NULL)`;

    return sql;
};



/*
Author     : Abhijith JS
Date       : 05 November 2024
Purpose    : Sql Function for updating organization team detail
parameter  : updateOrganizationTeamDetailData
return type: sql
*/
exports.qUpdateOrganizationTeamDetail = function (updateOrganizationTeamDetailData) {
    const { organizationTeamID, userID, activityDetailID, organizationTeamDetailID } = updateOrganizationTeamDetailData;

    const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `${value}`;

    let sql = `CALL ${globalConstants.connectionString.database}.cSaveOrganizationTeamDetail(
      ${formatValue(organizationTeamID)}
    , ${formatValue(userID)}
    , ${formatValue(activityDetailID)}
    , ${formatValue(organizationTeamDetailID)})`;
    
    return sql;
};



/*
Author     : Abhijith JS
Date       : 05 November 2024
Purpose    : Sql Function for deleting Organization TeamDetail
parameter  : organizationTeamDetailID
return type:  sql
*/
exports.qDeleteorganizationTeamDetail = function (organizationTeamDetailID) {
    let sql = `call ${globalConstants.connectionString.database}.cDeleteorganizationTeamDetail(${organizationTeamDetailID});`;
  
    return sql;
  };

/*
Author     : Varun H M
Date       : 05 November 2024
Purpose    : Sql Function for fetching organization team detail by organizationTeamDetailID
parameter  : organizationTeamDetailID
return type: sql
*/
exports.qGetOrganizationTeamDetailByID = function (organizationTeamDetailID) {
  let sql = `CALL ${globalConstants.connectionString.database}.cGetOrganizationTeamDetailByID(${organizationTeamDetailID});`;

  return sql;
};


/*
Author     : Varun H M
Date       : 05 November 2024
Purpose    : Sql Function for deleting organization Team detail
parameter  : organizationTeamDetailID
return type:  sql
*/
exports.qDeleteOrganizationTeamDetail = function (organizationTeamDetailID) {
  let sql = `call ${globalConstants.connectionString.database}.cDeleteOrganizationTeamDetail(${organizationTeamDetailID});`;

  return sql;
};


/*
Author     : Varun H M
Date       : 05 November 2024
Purpose    : Sql Function for searching organization team detail
parameter  : searchOrganizationTeamDetailData
return type: sql
*/
exports.qSearchOrganizationTeamDetail = function (searchOrganizationTeamDetailData, page, pageSize) {

  let andConditions = []; // For AND conditions
  let orConditions = []; // For OR conditions
  let limitations = ''; // Initialize limitations as an empty string
  let conditions = "";

  if (searchOrganizationTeamDetailData) {
    // Add OR conditions for organizationName and departmentName
    if (!validator.isNullOrEmpty(searchOrganizationTeamDetailData.activityName)) {
      orConditions.push(`tad.Name LIKE ''${searchOrganizationTeamDetailData.activityName}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationTeamDetailData.teamName)) {
      orConditions.push(`tot.TeamName LIKE ''${searchOrganizationTeamDetailData.teamName}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationTeamDetailData.organizationTeamDetailID)) {
      orConditions.push(`totd.OrganizationTeamDetailID = ${searchOrganizationTeamDetailData.organizationTeamDetailID}`);
    }

    if (!validator.isNullOrEmpty(searchOrganizationTeamDetailData.firstName)) {
      orConditions.push(`tu.FirstName = ''${searchOrganizationTeamDetailData.firstName}''`);
    }

    if (!validator.isNullOrEmpty(searchOrganizationTeamDetailData.lastName)) {
      orConditions.push(`tu.LastName = ''${searchOrganizationTeamDetailData.lastName}''`);
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
      CALL ${globalConstants.connectionString.database}.cSearchOrganizationTeamDetail(${conditions}, ${limitations});`;

  return { sql };
};