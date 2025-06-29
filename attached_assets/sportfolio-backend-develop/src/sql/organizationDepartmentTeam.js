const globalConstants = require("../common/globalConstants");
const validator = require("../common/validation");
const { escapeSqlString } = require("../common/commonFunctions");



/*
Author     : Abhijith JS
Date       : 01 November 2024
Purpose    : Sql Function for saving organization Department Team
parameter  : organizationDepartmentTeamData
return type: sql
*/
exports.qCheckOrganizationDepartmentTeamDuplicate = function (organizationDepartmentTeamData) {
    let { organizationID, teamName, teamCategoryID, organizationDepartmentTeamID } = organizationDepartmentTeamData;
    organizationDepartmentTeamID = organizationDepartmentTeamID != undefined ? organizationDepartmentTeamID : 0;

    let sql = `CALL ${globalConstants.connectionString.database}.cCheckOrganizationDepartmentTeamDuplicate('${organizationID}','${teamName}', '${teamCategoryID}'
    , '${organizationDepartmentTeamID}')`;

    return sql;
};



/*
Author     : Abhijith JS
Date       : 01 November 2024
Purpose    : Sql Function for saving organization Department Team
parameter  : organizationDepartmentTeamData
return type: sql
*/
exports.qSaveOrganizationDepartmentTeam = function (organizationDepartmentTeamData) {
    const { organizationID, activityID, teamName, teamCategoryID, description, userID } = organizationDepartmentTeamData;
    let sql = `CALL ${globalConstants.connectionString.database}.cSaveOrganizationDepartmentTeam('${organizationID}', '${activityID}', '${teamName}'
            , '${teamCategoryID}', '${description != undefined ? escapeSqlString(description) : description }', '${userID}', NULL)`;

    return sql;
};

/*
Author     : Varun H M
Date       : 04 November 2024
Purpose    : Sql Function for fetching organization department team by organizationDepartmentTeamID
parameter  : organizationDepartmentTeamID
return type: sql
*/
exports.qGetOrganizationDepartmentTeamByID = function (organizationDepartmentTeamID) {
    let sql = `CALL ${globalConstants.connectionString.database}.cGetOrganizationDepartmentTeamByID(${organizationDepartmentTeamID});`;
  
    return sql;
  };


/*
Author     : Varun H M
Date       : 04 November 2024
Purpose    : Sql Function for deleting organization department Team
parameter  : organizationDepartmentTeamID
return type:  sql
*/
exports.qDeleteOrganizationDepartmentTeam = function (organizationDepartmentTeamID) {
    let sql = `call ${globalConstants.connectionString.database}.cDeleteOrganizationDepartmentTeam(${organizationDepartmentTeamID});`;
  
    return sql;
  };
  

/*
Author     : Abhijith JS
Date       : 04 November 2024
Purpose    : Sql Function for updating organization Department team
parameter  : organizationDepartmentTeamData
return type: sql
*/
exports.qUpdateOrganizationDepartmentTeam = function (organizationDepartmentTeamData) {
    const { organizationID, activityID, teamName, teamCategoryID, description, userID, organizationDepartmentTeamID } = organizationDepartmentTeamData;

    const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

    let sql = `CALL ${globalConstants.connectionString.database}.cSaveOrganizationDepartmentTeam(
      ${formatValue(organizationID)}
    , ${formatValue(activityID)}
    , ${formatValue(teamName)}
    , ${formatValue(teamCategoryID)}
    , ${formatValue(description != undefined ? escapeSqlString(description) : description )}
    , ${formatValue(userID)}
    , ${formatValue(organizationDepartmentTeamID)})`;
    
    return sql;
};




/*
Author     : Abhijith JS
Date       : 04 November 2024
Purpose    : Sql Function for searching organization Department team
parameter  : searchOrganizationDepartmentTeamData
return type: sql
*/
exports.qSearchOrganizationDepartmentTeam = function (searchOrganizationDepartmentTeamData, page, pageSize) {

    let andConditions = []; // For AND conditions
    let orConditions = []; // For OR conditions
    let limitations = ''; // Initialize limitations as an empty string
    let conditions = "";
  
    if (searchOrganizationDepartmentTeamData) {
      // Add OR conditions for organizationName and departmentName
      if (!validator.isNullOrEmpty(searchOrganizationDepartmentTeamData.organizationName)) {
        orConditions.push(`o.OrganizationName LIKE ''${searchOrganizationDepartmentTeamData.organizationName}%''`); 
      }
      if (!validator.isNullOrEmpty(searchOrganizationDepartmentTeamData.teamName)) {
        orConditions.push(`odt.TeamName LIKE ''${searchOrganizationDepartmentTeamData.teamName}%''`); 
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
      CALL ${globalConstants.connectionString.database}.cSearchOrganizationDepartmentTeam(${conditions}, ${limitations});`;
  
    return { sql };
  };
  