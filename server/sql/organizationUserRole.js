const globalConstants = require("../common/globalConstants");
const validator = require("../common/validation");
const { escapeSqlString } = require("../common/commonFunctions");



/*
Author     : Abhijith JS
Date       : 27 November 2024
Purpose    : Sql Function for checking duplicate organization User role while create/update
parameter  : organizationUserRoleData
return type: sql
*/
exports.qCheckOrganizationUserRoleDuplicate = function (organizationUserRoleData) {
    let { userID, organizationRoleID, organizationUserRoleID } = organizationUserRoleData;
    organizationUserRoleID = organizationUserRoleID !== undefined ? organizationUserRoleID : 0;

    // Construct SQL query to check if the user already has the role in the organization
    let sql = `CALL ${globalConstants.connectionString.database}.cCheckOrganizationUserRoleDuplicate('${userID}', '${organizationRoleID}', '${organizationUserRoleID}')`;

    return sql;
};



/*
Author     : Abhijith JS
Date       : 27 November 2024
Purpose    : Sql Function for saving organization User role
parameter  : organizationUserRoleData
return type: sql
*/
exports.qSaveOrganizationUserRole = function (organizationUserRoleData) {
    const { userID, organizationRoleID, notes } = organizationUserRoleData;
  
    let sql = `CALL ${globalConstants.connectionString.database}.cSaveOrganizationUserRole(
      '${userID}',
      '${organizationRoleID}',
      '${notes != undefined ? escapeSqlString(notes) : notes}',
      NULL
    )`;
  
    return sql;
};



