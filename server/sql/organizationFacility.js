const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");
const globalConstants = require("../common/globalConstants");
const { escapeSqlString } = require("../common/commonFunctions");





/*
Author     : Abhijith JS
Date       : 14 November 2024
Purpose    : Sql Function for checking duplicate organization Facility while create
parameter  : organizationFacilityData
return type: sql
*/
exports.qCheckOrganizationFacilityExists = function (organizationFacilityData) {
    let { organizationID, facilityName, userID, organizationFacilityID } = organizationFacilityData;
    organizationFacilityID = organizationFacilityID != undefined ? organizationFacilityID : 0;

    let sql = `CALL ${globalConstants.connectionString.database}.cCheckOrganizationFacilityExists(
    '${organizationID}'
    , '${facilityName}'
    , '${userID}'
    , '${organizationFacilityID}')`;
  
    return sql;
};
  

/*
Author     : Abhijith JS
Date       : 14 November 2024
Purpose    : Sql Function for saving organization Facility
parameter  : organizationFacilityData
return type: sql
*/
exports.qSaveOrganizationFacility = function (organizationFacilityData) {
    const { facilityName, organizationID, description, notes, userID } = organizationFacilityData;

    const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

    let sql = `CALL ${globalConstants.connectionString.database}.cSaveOrganizationFacility(
                    ${organizationID}
                    ,  ${facilityName}
                    ,  ${formatValue(description != undefined ? escapeSqlString(description) : description )}
                    ,  ${formatValue(notes != undefined ? escapeSqlString(notes) : notes )}
                    ,  ${userID}
                    , NULL
                    )`;

    return sql;
};
  
  
/*
Author     : Abhijith JS
Date       : 14 November 2024
Purpose    : Sql Function for updating organization Facility
parameter  : organizationFacilityData
return type: sql
*/
exports.qUpdateOrganizationFacility = function (organizationFacilityData) {
    const {
      organizationFacilityID,
      organizationID,
      facilityName,
      description,
      notes,
      userID,
    } = organizationFacilityData;
  
    const formatValue = (value) => 
      value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;
  
    const sql = `CALL ${globalConstants.connectionString.database}.cSaveOrganizationFacility(
                  ${formatValue(organizationID)}, 
                  ${formatValue(facilityName)}, 
                  ${formatValue(description)}, 
                  ${formatValue(notes)}, 
                  ${formatValue(userID)}, 
                  ${formatValue(organizationFacilityID)}
                )`;

    return sql;
  };  


/*
Author     : Abhijith JS
Date       : 15 November 2024
Purpose    : Sql Function for searching organization Facility
parameter  : searchOrganizationFacilityData
return type: sql
*/
  exports.qSearchOrganizationFacility = function (searchOrganizationFacilityData, page, pageSize) {
  
    let andConditions = []; // For AND conditions
    let orConditions = []; // For OR conditions
    let limitations = ''; // Initialize limitations as an empty string
    let conditions = "";
  
    if (searchOrganizationFacilityData) {
      // Add OR conditions for organizationName and facilityName
      if (!validator.isNullOrEmpty(searchOrganizationFacilityData.organizationName)) {
        orConditions.push(`o.OrganizationName LIKE ''${searchOrganizationFacilityData.organizationName}%''`); 
      }
      if (!validator.isNullOrEmpty(searchOrganizationFacilityData.facilityName)) {
        orConditions.push(`ofac.FacilityName LIKE ''${searchOrganizationFacilityData.facilityName}%''`); 
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
  
    let sql = `CALL ${globalConstants.connectionString.database}.cSearchOrganizationFacility( ${conditions}, ${limitations});`;
  
    return { sql };
  };  


/*
Author     : Abhijith JS
Date       : 15 November 2024
Purpose    : Sql Function for searching organization Facility
parameter  : organizationFacilityID
return type: sql
*/
exports.qGetOrganizationFacilityByID = function (organizationFacilityID) {
  let sql = `CALL ${globalConstants.connectionString.database}.cGetOrganizationFacilityByID(${organizationFacilityID});`;

  return sql;
};


/*
Author     : Abhijith JS
Date       : 18 November 2024
Purpose    : Sql Function for deleting organization Facility
parameter  : organizationFacilityID
return type: sql
*/
exports.qDeleteOrganizationFacility = function (deleteOrganizationFacilityData) {
  
  const { organizationFacilityID, notes } = deleteOrganizationFacilityData;
  const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

  let sql = `CALL ${globalConstants.connectionString.database}.cDeleteOrganizationFacility(
                  ${formatValue(organizationFacilityID)}, ${formatValue(notes != undefined ? escapeSqlString(notes) : notes )});`;

  return sql;
};
