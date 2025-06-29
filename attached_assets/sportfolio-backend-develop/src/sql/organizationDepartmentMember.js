const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");
const globalConstants = require("../common/globalConstants");



/*
Author     : Abhijith JS
Date       : 17 October 2024
Purpose    : Sql Function for checking duplicate organization Department Member Data while create
parameter  : organizationDepartmentMemberData
return type: sql
*/
exports.qCheckOrganizationDepartmentMemberExists = function (organizationDepartmentMemberData) {
    const { memberID, organizationDepartmentID } = organizationDepartmentMemberData;
    let sql = `SELECT COUNT(OrganizationDepartmentMemberID) AS count FROM torganizationdepartmentmember WHERE MemberID = '${memberID}' AND OrganizationDepartmentID = '${organizationDepartmentID}'`;
    return sql;
};

  
/*
Author     : Abhijith JS
Date       : 17 October 2024
Purpose    : Sql Function for saving new organization Department Member
parameter  : organizationDepartmentMemberData
return type: sql
*/
exports.qSaveOrganizationDepartmentMember = function (organizationDepartmentMemberData) {
const { organizationDepartmentID, memberID } = organizationDepartmentMemberData;
let sql = `CALL ${globalConstants.connectionString.database}.cSaveOrganizationDepartmentMember('${organizationDepartmentID}', '${memberID}', NULL)`;

return sql;
};


/*
Author     : Abhijith JS
Date       : 18 October 2024
Purpose    : Sql Function for searching organization Department member
parameter  : searchOrganizationDepartmentMemberData
return type: sql
*/
exports.qSearchOrganizationDepartmentMember = function (
    searchOrganizationDepartmentMemberData,
    page,
    pageSize
  ) {
    let andConditions = [];
    let orConditions = [];
    let limitations = '';
    let conditions = '';
  
    // Check if search data is provided and build the conditions dynamically
    if (searchOrganizationDepartmentMemberData) {
      if (!validator.isNullOrEmpty(searchOrganizationDepartmentMemberData.firstName)) {
        orConditions.push(`tu.FirstName LIKE ''${searchOrganizationDepartmentMemberData.firstName}%''`);
      }
      if (!validator.isNullOrEmpty(searchOrganizationDepartmentMemberData.lastName)) {
        orConditions.push(`tu.LastName LIKE ''${searchOrganizationDepartmentMemberData.lastName}%''`);
      }
      if (!validator.isNullOrEmpty(searchOrganizationDepartmentMemberData.localBodyType)) {
        andConditions.push(`tubd.localBodyType = ${searchOrganizationDepartmentMemberData.localBodyType}`);
      }
      if (!validator.isNullOrEmpty(searchOrganizationDepartmentMemberData.localBody)) {
        andConditions.push(`tubd.LocalBodyName LIKE ''${searchOrganizationDepartmentMemberData.localBody}%''`);
      }
      if (!validator.isNullOrEmpty(searchOrganizationDepartmentMemberData.ward)) {
        andConditions.push(`tubd.WardID = ${searchOrganizationDepartmentMemberData.ward}`);
      }
      if (!validator.isNullOrEmpty(searchOrganizationDepartmentMemberData.district)) {
        andConditions.push(`tubd.DistrictID = ${searchOrganizationDepartmentMemberData.district}`);
      }
      if (!validator.isNullOrEmpty(searchOrganizationDepartmentMemberData.state)) {
        andConditions.push(`tubd.StateID = ${searchOrganizationDepartmentMemberData.state}`);
      }
      if (!validator.isNullOrEmpty(searchOrganizationDepartmentMemberData.postOffice)) {
        andConditions.push(`tubd.PostOffice = ''${searchOrganizationDepartmentMemberData.postOffice}''`);
      }
      if (!validator.isNullOrEmpty(searchOrganizationDepartmentMemberData.pinCode)) {
        andConditions.push(`tubd.Pincode = ''${searchOrganizationDepartmentMemberData.pinCode}''`);
      }
      if (!validator.isNullOrEmpty(searchOrganizationDepartmentMemberData.organizationID)) {
        andConditions.push(`tod.OrganizationID = ${searchOrganizationDepartmentMemberData.organizationID}`);
      }
      if (!validator.isNullOrEmpty(searchOrganizationDepartmentMemberData.organizationName)) {
        andConditions.push(`tog.OrganizationName LIKE ''${searchOrganizationDepartmentMemberData.organizationName}%''`);
      }
      if (!validator.isNullOrEmpty(searchOrganizationDepartmentMemberData.memberID)) {
        andConditions.push(`todm.MemberID = ${searchOrganizationDepartmentMemberData.memberID}`);
      }
      if (!validator.isNullOrEmpty(searchOrganizationDepartmentMemberData.organizationDepartmentMemberID)) {
        andConditions.push(`todm.OrganizationDepartmentMemberID = ${searchOrganizationDepartmentMemberData.organizationDepartmentMemberID}`);
      }
  
      // Combine OR and AND conditions
      if (orConditions.length > 0) {
        conditions += '(' + orConditions.join(" OR ") + ')'; // Wrap OR conditions in parentheses
      }
      if (andConditions.length > 0) {
        conditions += (conditions.length > 0 ? ' AND ' : '') + andConditions.join(" AND ");
      }
    }
  
    // Handle pagination if provided
    if (!validator.isNullOrEmpty(page) && !validator.isNullOrEmpty(pageSize)) {
      const offset = (page - 1) * pageSize;
      limitations = `LIMIT ${pageSize} OFFSET ${offset}`;
    }
  
    // Ensure conditions are formatted correctly
    conditions = conditions.length > 0 ? conditions : '1=1'; // Default condition to avoid empty WHERE clause
    
    // Construct the SQL call to the stored procedure
    let sql = `CALL cSearchOrganizationDepartmentMember('${conditions}', '${limitations}');`; // Wrap conditions and limitations in quotes
  
    return { sql };
  };


/*
Author     : Abhijith JS
Date       : 18 October 2024
Purpose    : Sql Function for getting organization departmentMember by ID
parameter  : organizationDepartmentMemberID
return type: sql
*/
  exports.qGetOrganizationDepartmentMemberByID = function (organizationDepartmentMemberID) {
    let sql = `CALL ${globalConstants.connectionString.database}.cGetOrganizationDepartmentMemberByID(${organizationDepartmentMemberID});`;
  
    return sql;
  };
  


/*
Author     : Abhijith JS
Date       : 21 October 2024
Purpose    : Sql Function for deleting organization department Member
parameter  : organizationMemberID
return type:  sql
*/
exports.qDeleteOrganizationDepartmentMember = function (organizationDepartmentMemberID) {
  let sql = `call ${globalConstants.connectionString.database}.cDeleteOrganizationDepartmentMember(${organizationDepartmentMemberID});`;

  return sql;
};



/*
Author     : Abhijith JS
Date       : 21 October 2024
Purpose    : Sql Function for updating organization department member
parameter  : organizationDepartmentMemberData
return type: sql
*/
exports.qUpdateOrganizationDepartmentMember = function (organizationDepartmentMemberData) {
  const {
    organizationDepartmentID,
    memberID,
    organizationDepartmentMemberID,
  } = organizationDepartmentMemberData;

  const formatValue = (value) => 
    value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

  const sql = `CALL sportfolio.cSaveOrganizationDepartmentMember(${formatValue(organizationDepartmentID)}, ${formatValue(memberID)}, ${formatValue(organizationDepartmentMemberID)})`;
  return sql;
};


/*
Author     : Abhijith JS
Date       : 21 October 2024
Purpose    : Sql Function for checking duplicate organization department member while update
parameter  : organizationDepartmentID, memberID, organizationDepartmentMemberID
return type: sql
*/
exports.qCheckOrganizationDepartmentMemberDuplicate = function (organizationDepartmentID, memberID, organizationDepartmentMemberID) {
  let sql = `CALL sportfolio.cCheckOrganizationDepartmentMemberDuplicate('${organizationDepartmentID}', '${memberID}', '${organizationDepartmentMemberID}')`;

  return sql;
};
