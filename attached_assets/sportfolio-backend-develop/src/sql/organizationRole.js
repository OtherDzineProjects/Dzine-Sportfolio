const globalConstants = require("../common/globalConstants");
const validator = require("../common/validation");
const { escapeSqlString } = require("../common/commonFunctions");



/*
Author     : Abhijith JS
Date       : 26 November 2024
Purpose    : Sql Function for checking duplicate organization role while create/update
parameter  : organizationRoleData
return type: sql
*/
exports.qCheckOrganizationRoleDuplicate = function (organizationRoleData) {
    let { organizationID, roleName, organizationRoleID } = organizationRoleData;
    organizationRoleID = organizationRoleID !== undefined ? organizationRoleID : 0;
  
    let sql = `CALL ${globalConstants.connectionString.database}.cCheckOrganizationRoleDuplicate('${organizationID}', '${roleName}', '${organizationRoleID}')`;
  
    return sql;
  };
  


/*
Author     : Abhijith JS
Date       : 26 November 2024
Purpose    : Sql Function for saving organization role
parameter  : organizationRoleData
return type: sql
*/
exports.qSaveOrganizationRole = function (organizationRoleData) {
    const { organizationID, roleName, isAdmin, heirarchy, notes, userID } = organizationRoleData;
  
    let sql = `CALL ${globalConstants.connectionString.database}.cSaveOrganizationRole(
      '${organizationID}',
      '${roleName}',
      '${isAdmin}',
      '${heirarchy}',
      '${notes != undefined ? escapeSqlString(notes) : notes}',
      '${userID}',
      NULL
    )`;
  
    return sql;
  };
  


/*
Author     : Abhijith JS
Date       : 26 November 2024
Purpose    : Sql Function for updating organization role
parameter  : updateOrganizationRoleData
return type: sql
*/
exports.qUpdateOrganizationRole = function (updateOrganizationRoleData) {
    const { organizationID, roleName, organizationRoleID, isAdmin, heirarchy, notes, userID } = updateOrganizationRoleData;

    // Helper function to format values for SQL (handling NULLs and empty strings)
    const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

    let sql = `CALL ${globalConstants.connectionString.database}.cSaveOrganizationRole(
        ${formatValue(organizationID)}
        , ${formatValue(roleName)}
        , ${formatValue(isAdmin)}
        , ${formatValue(heirarchy)}
        , ${formatValue(notes != undefined ? escapeSqlString(notes) : notes )}
        , ${formatValue(userID)}
        , ${formatValue(organizationRoleID)}
)`;

    return sql;
};



/*
Author     : Abhijith JS
Date       : 27 November 2024
Purpose    : Sql Function for fetching organization role by id
parameter  : organizationRoleID
return type: sql
*/
exports.qGetOrganizationRoleByID = function (organizationRoleID) {
  let sql = `CALL ${globalConstants.connectionString.database}.cGetOrganizationRoleByID(${organizationRoleID});`;

  return sql;
};



/*
Author     : Abhijith JS
Date       : 27 November 2024
Purpose    : Sql Function for searching organizationRole
parameter  : searchOrganizationRoleData
return type: sql
*/
exports.qSearchOrganizationRole = function (searchOrganizationRoleData, page, pageSize) {
  let andConditions = []; // For AND conditions
  let orConditions = []; // For OR conditions
  let limitations = ''; // Initialize limitations as an empty string
  let conditions = "";

  if (searchOrganizationRoleData) {
    // Add OR conditions for organizationName and roleName
    if (!validator.isNullOrEmpty(searchOrganizationRoleData.organizationName)) {
      orConditions.push(`o.OrganizationName LIKE ''${searchOrganizationRoleData.organizationName}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationRoleData.roleName)) {
      orConditions.push(`orl.RoleName LIKE ''${searchOrganizationRoleData.roleName}%''`);
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
    CALL ${globalConstants.connectionString.database}.cSearchOrganizationRole(${conditions}, ${limitations});`;

  return { sql };
};



/*
Author     : Abhijith JS
Date       : 27 November 2024
Purpose    : Sql Function for deleting organizationRole
parameter  : organizationRoleID
return type: sql
*/
exports.qDeleteOrganizationRole = function (organizationRoleID) {
  // Constructing the SQL query to call the stored procedure cDeleteOrganizationRole
  let sql = `CALL ${globalConstants.connectionString.database}.cDeleteOrganizationRole(${organizationRoleID});`;

  // Return the constructed SQL query
  return sql;
};
