const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");
const globalConstants = require("../common/globalConstants");




/*
Author     : Abhijith JS
Date       : 15 October 2024
Purpose    : Sql Function for saving new organization department
parameter  : organizationDepartmentData
return type:  sql
*/
exports.qSaveOrganizationDepartment = function (organizationDepartmentData) {
    const { departmentName, organizationID, userID, parentDepartmentId } = organizationDepartmentData;
    let sql = `CALL ${globalConstants.connectionString.database}.cSaveOrganizationDepartment('${organizationID}', '${departmentName}', '${userID}', '${parentDepartmentId }', NULL)`;

    return sql;
  };

/*
Author     : Abhijith JS
Date       : 16 October 2024
Purpose    : Sql Function for checking duplicate organization department while create
parameter  : organizationDepartmentData
return type:  sql
*/
  exports.qCheckOrganizationDepartmentExists = function (organizationDepartmentData) {
    const { departmentName, organizationID } = organizationDepartmentData;
    let sql = `SELECT OrganizationDepartmentID FROM torganizationdepartment WHERE DepartmentName = '${departmentName}' AND OrganizationID = '${organizationID}'`;

    return sql;
  };

  /*
Author     : Abhijith JS
Date       : 16 October 2024
Purpose    : Sql Function for searching organization departments
parameter  : searchOrganizationDepartmentData
return type:  sql
*/
exports.qSearchOrganizationDepartment = function (searchOrganizationDepartmentData, page, pageSize) {
  
  let andConditions = []; // For AND conditions
  let oRConditions = []; // For OR conditions
  let limitations = ''; // Initialize limitations as an empty string
  let conditions = "";

  if (searchOrganizationDepartmentData) {
    // Add OR conditions for organizationName and departmentName
    if (!validator.isNullOrEmpty(searchOrganizationDepartmentData.organizationName)) {
      oRConditions.push(`o.OrganizationName LIKE ''${searchOrganizationDepartmentData.organizationName}%''`); 
    }
    if (!validator.isNullOrEmpty(searchOrganizationDepartmentData.departmentName)) {
      oRConditions.push(`od.DepartmentName LIKE ''${searchOrganizationDepartmentData.departmentName}%''`); 
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
    CALL ${globalConstants.connectionString.database}.cSearchOrganizationDepartment(
      ${conditions}, 
      ${limitations}
    );
  `;

  return { sql };
};


/*
Author     : Abhijith JS
Date       : 17 October 2024
Purpose    : Sql Function for getting organization department by ID
parameter  : organizationDepartmentID
return type: sql
*/
exports.qGetOrganizationDepartmentByID = function (organizationDepartmentID) {
  let sql = `CALL ${globalConstants.connectionString.database}.cGetOrganizationDepartmentByID(${organizationDepartmentID});`;

  return sql;
};


/*
Author     : Abhijith JS
Date       : 21 October 2024
Purpose    : Sql Function for deleting organization department
parameter  : organizationDepartmentID
return type:  sql
*/
exports.qDeleteOrganizationDepartment = function (organizationDepartmentID) {
  let sql = `call ${globalConstants.connectionString.database}.cDeleteOrganizationDepartment(${organizationDepartmentID});`;

  return sql;
};



/*
Author     : Abhijith JS
Date       : 22 October 2024
Purpose    : Sql Function for checking duplicate organization department while update
parameter  : updateOrganizationDepartmentData
return type:  sql
*/
exports.qCheckOrganizationDepartmentDuplicate = function (updateOrganizationDepartmentData) {
  let sql = `CALL ${globalConstants.connectionString.database}.cCheckOrganizationDepartmentDuplicate('${updateOrganizationDepartmentData.organizationID}'
                , '${updateOrganizationDepartmentData.departmentName}', '${updateOrganizationDepartmentData.organizationDepartmentID}')`;
  
  return sql;
};



/*
Author     : Abhijith JS
Date       : 22 October 2024
Purpose    : Sql Function for updating organization department
parameter  : organizationDepartmentData
return type: sql
*/
exports.qUpdateOrganizationDepartment = function (organizationDepartmentData) {
  const {
    organizationDepartmentID,
    organizationID,
    departmentName,
    userID,
    parentDepartmentId
  } = organizationDepartmentData;

  const formatValue = (value) => 
    value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

  const sql = `CALL ${globalConstants.connectionString.database}.cSaveOrganizationDepartment(${formatValue(organizationID)}, ${formatValue(departmentName)}
                  , ${formatValue(userID)}, ${formatValue(parentDepartmentId)} ,${formatValue(organizationDepartmentID)})`;
  return sql;
};

