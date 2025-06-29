const globalConstants = require("../common/globalConstants");
const validator = require("../common/validation");
const { escapeSqlString } = require("../common/commonFunctions");




/*
Author     : Abhijith JS
Date       : 30 October 2024
Purpose    : Sql Function for checking duplicate organization team while create/update
parameter  : organizationTeamData
return type: sql
*/
exports.qCheckOrganizationTeamDuplicate = function (OrganizationTeamData) {
    let { organizationID, teamName, teamCategoryID, organizationTeamID } = OrganizationTeamData;
    organizationTeamID = organizationTeamID != undefined ? organizationTeamID : 0;

    let sql = `CALL ${globalConstants.connectionString.database}.cCheckOrganizationTeamDuplicate('${organizationID}','${teamName}', '${teamCategoryID}', '${organizationTeamID}')`;

    
    return sql;
  };



/*
Author     : Abhijith JS
Date       : 30 October 2024
Purpose    : Sql Function for saving organization team
parameter  : organizationTeamData
return type: sql
*/
exports.qSaveOrganizationTeam = function (organizationTeamData) {
const { organizationID, activityID, teamName, teamCategoryID, description, userID } = organizationTeamData;
let sql = `CALL ${globalConstants.connectionString.database}.cSaveOrganizationTeam('${organizationID}', '${activityID}', '${teamName}', '${teamCategoryID}'
, '${description != undefined ? escapeSqlString(description) : description }', '${userID}', NULL)`;

return sql;
};



/*
Author     : Abhijith JS
Date       : 30 October 2024
Purpose    : Sql Function for updating organization team
parameter  : updateOrganizationTeamData
return type: sql
*/
exports.qUpdateOrganizationTeam = function (updateOrganizationTeamData) {
    const { organizationID, activityID, teamName, teamCategoryID, description, userID, organizationTeamID } = updateOrganizationTeamData;

    const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

    let sql = `CALL ${globalConstants.connectionString.database}.cSaveOrganizationTeam(
    ${formatValue(organizationID)}
    , ${formatValue(activityID)}
    , ${formatValue(teamName)}
    , ${formatValue(teamCategoryID)}
    , ${formatValue(description != undefined ? escapeSqlString(description) : description )}
    , ${formatValue(userID)}
    , ${formatValue(organizationTeamID)})`;
    
    return sql;
};



/*
Author     : Abhijith JS
Date       : 30 October 2024
Purpose    : Sql Function for fetching organization team by organizationTeamID
parameter  : organizationTeamID
return type: sql
*/
exports.qGetOrganizationTeamByID = function (organizationTeamID) {
    let sql = `CALL ${globalConstants.connectionString.database}.cGetOrganizationTeamByID(${organizationTeamID});`;
  
    return sql;
  };
  


/*
Author     : Abhijith JS
Date       : 01 November 2024
Purpose    : Sql Function for searching organization teams
parameter  : searchOrganizationTeamData
return type: sql
*/
exports.qsearchorganizationTeam = function (searchOrganizationTeamData, page, pageSize) {
  
  let andConditions = []; // For AND conditions
  let oRConditions = []; // For OR conditions
  let limitations = ''; // Initialize limitations as an empty string
  let conditions = "";

  if (searchOrganizationTeamData) {
    // Add OR conditions for organizationName and teamName
    if (!validator.isNullOrEmpty(searchOrganizationTeamData.organizationName)) {
      oRConditions.push(`o.OrganizationName LIKE ''${searchOrganizationTeamData.organizationName}%''`); 
    }
    if (!validator.isNullOrEmpty(searchOrganizationTeamData.teamName)) {
      oRConditions.push(`ot.TeamName LIKE ''${searchOrganizationTeamData.teamName}%''`); 
    }

    // Combine OR conditions
    if (oRConditions.length > 0) {
      conditions += '(' + oRConditions.join(" OR ") + ')';
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
    CALL ${globalConstants.connectionString.database}.cSearchOrganizationTeam(${conditions}, ${limitations} );`;

  return { sql };
};


/*
Author     : Abhijith JS
Date       : 01 November 2024
Purpose    : Sql Function for deleting organization Team
parameter  : organizationDepartmentID
return type:  sql
*/
exports.qDeleteOrganizationTeam = function (organizationTeamID) {
  let sql = `call ${globalConstants.connectionString.database}.cDeleteOrganizationTeam(${organizationTeamID});`;

  return sql;
};
