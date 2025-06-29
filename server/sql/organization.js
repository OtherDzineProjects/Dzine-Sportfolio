const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");
const { escapeSqlString } = require("../common/commonFunctions");
const globalConstants = require("../common/globalConstants");

/*
Author     : Abhijith JS
Date       : 5 June 2024
Purpose    : Sql Function for searching organization 
parameter  : searchOrganizationData
return type:  sql
*/
exports.qSearchOrganization = function (
  searchOrganizationData,
  userID,
  page,
  pageSize
) {
  let andConditions = []; // For AND conditions
  let orConditions = []; // For OR conditions
  let limitations = ''; // Initialize limitations as an empty string
  let conditions = "";
  let statusType = "";

  if (searchOrganizationData) {
    if (!validator.isNullOrEmpty(searchOrganizationData.organizationName)) {
      orConditions.push(`tog.OrganizationName LIKE ''${searchOrganizationData.organizationName}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.organizationEmail)) {
      orConditions.push(`tog.OrganizationEmail LIKE ''${searchOrganizationData.organizationEmail}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.organizationTypeID)) {
      orConditions.push(`tog.OrganizationTypeID = ${searchOrganizationData.organizationTypeID}`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.registrationNumber)) {
      orConditions.push(`tog.RegistrationNumber LIKE ''${searchOrganizationData.registrationNumber}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.registrationValidFrom)) {
      orConditions.push(`tog.RegistrationValidFrom = ''${searchOrganizationData.registrationValidFrom}''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.registrationValidTo)) {
      orConditions.push(`tog.RegistrationValidTo = ''${searchOrganizationData.registrationValidTo}''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.inchargeName)) {
      orConditions.push(`tog.InchargeName LIKE ''${searchOrganizationData.inchargeName}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.inchargePhone)) {
      orConditions.push(`tog.InchargePhone LIKE ''${searchOrganizationData.inchargePhone}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.inchargeEmail)) {
      orConditions.push(`tog.InchargeEmail LIKE ''${searchOrganizationData.inchargeEmail}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.website)) {
      orConditions.push(`tog.Website LIKE ''${searchOrganizationData.website}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.phoneNumber)) {
      orConditions.push(`tog.PhoneNumber LIKE ''${searchOrganizationData.phoneNumber}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.country)) {
      orConditions.push(`tog.CountryID = ''${searchOrganizationData.country}''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.city)) {
      orConditions.push(`tog.CityID = ''${searchOrganizationData.city}''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.district)) {
      orConditions.push(`tog.DistrictID = ''${searchOrganizationData.district}''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.state)) {
      orConditions.push(`tog.StateID = ''${searchOrganizationData.state}''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.localBodyType)) {
      orConditions.push(`tog.LocalBodyType LIKE ''${searchOrganizationData.localBodyType}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.localBodyName)) {
      orConditions.push(`tog.LocalBodyName LIKE ''${searchOrganizationData.localBodyName}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.wardName)) {
      orConditions.push(`tog.WardName LIKE ''${searchOrganizationData.wardName}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.postOffice)) {
      orConditions.push(`tog.PostOffice LIKE ''${searchOrganizationData.postOffice}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.pincode)) {
      orConditions.push(`tog.Pincode LIKE ''${searchOrganizationData.pinCode}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationData.userID)) {
      orConditions.push(`tog.UserID = ${searchOrganizationData.userID}`);
    }

    if (!validator.isNullOrEmpty(searchOrganizationData.type)) {
      statusType =  searchOrganizationData.type.toUpperCase()
    }

  }

  if (!validator.isNullOrEmpty(userID)) {
    statusType =="M" || statusType =="O" ? andConditions.push(`togm.MemberID = ${userID}`) : andConditions.push(`tog.CreatedBy  = ${userID}`);
  }

  // Combine OR conditions
  if (orConditions.length > 0) {
    conditions += '(' + orConditions.join(" OR ") + ')';
  }

  // Combine AND conditions(for advanced search to be working when type is not passed, andConditionswon't be added to conditions)
  if (!validator.isNullOrEmpty(searchOrganizationData.type)) {
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
  statusType = !validator.isNullOrEmpty(statusType) ? `'${statusType}'` : null;


  let sql = ` CALL ${globalConstants.connectionString.database}.cSearchOrganization(${conditions}, ${limitations}, ${statusType});`;

  return { sql };
};

/*
Author     : Abhijith JS
Date       : 5 June 2024
Purpose    : Sql Function for getting organization byID
parameter  : organizationID
return type:  sql
*/
exports.qGetOrganizationByID = function (organizationID) {
  let sql = `SELECT 
      o.OrganizationID AS id,
      o.OrganizationName AS organizationName,
      o.OrganizationEmail AS organizationEmail,
      o.Website AS website,
      o.OrganizationTypeID AS organizationTypeID,
      ot.LookupDetailName AS organizationType,
      o.RegistrationNumber AS registrationNumber,
      o.RegistrationValidFrom AS registrationValidFrom,
      o.RegistrationValidTo AS registrationValidTo,
      o.InchargeName AS inchargeName,
      o.InchargePhone AS inchargePhone,
      o.InchargeEmail AS inchargeEmail,
      o.CountryID AS countryID,
      rc.RegionName AS country,
      o.LocalBodyType AS localBodyTypeID,
      lbt.RegionTypeName AS localBodyType,
      o.LocalBodyName AS localBodyNameID,
      lbn.RegionName AS localBodyName,
      o.PhoneNumber AS phoneNumber,
      o.CityID AS city,
      o.DistrictID AS districtID,
      rd.RegionName AS district,
      o.StateID AS stateID,
      rs.RegionName AS state,
      o.WardName AS wardID,
      wa.RegionName AS wardName,
      o.PostOffice AS postOfficeID,
      po.RegionName AS postOffice,
      o.Pincode AS pinCode,
      o.About AS about,
      COALESCE(
        (SELECT JSON_OBJECT(
            "documentID", td.DocumentID,
            "path", td.DocumentUrl,
            "fileName", td.DocumentName
          )
          FROM tdocument td
          JOIN tlookupdetail tl ON td.DocumentTypeID = tl.LookupDetailID
          WHERE td.OwnerID = o.organizationID
          AND tl.LookupDetailName = 'Organization'
          LIMIT 1
        ), NULL
      ) AS avatar
    FROM 
      torganization o
    LEFT JOIN 
      tregion rc ON o.CountryID = rc.RegionID
    LEFT JOIN 
      tregion rs ON o.StateID = rs.RegionID
    LEFT JOIN 
      tregion rd ON o.DistrictID = rd.RegionID
    LEFT JOIN 
      tregion rcy ON o.CityID = rcy.RegionID
    LEFT JOIN 
      tregion wa ON o.WardName = wa.RegionID
    LEFT JOIN 
      tregion po ON o.PostOffice = po.RegionID
    LEFT JOIN 
      tlookupdetail ot ON o.OrganizationTypeID = ot.LookupDetailID
    LEFT JOIN 
      tregiontype lbt ON o.LocalBodyType = lbt.RegionTypeID
    LEFT JOIN 
      tregion lbn ON o.LocalBodyName = lbn.RegionID`;

  if (validator.isNullOrEmpty(organizationID)) {
    return { error: errorMessages.ERROR_NOUSERID };
  } else {
    sql += ` WHERE o.OrganizationID = ${organizationID}`;
  }
  return sql;

};

/*
Author     : Abhijith JS
Date       : 5 June 2024
Purpose    : Sql Function for saving new organization 
parameter  : organizationData
return type:  sql
*/
exports.qSaveOrganization = function (organizationData) {
  const {
    organizationName,
    organizationEmail,
    organizationTypeID,
    registrationNumber,
    registrationValidFrom,
    registrationValidTo,
    inchargeName,
    inchargePhone,
    inchargeEmail,
    website,
    phoneNumber,
    country,
    city,
    district,
    state,
    localBodyType,
    localBodyName,
    wardName,
    postOffice,
    pinCode,
    about,
    userID,
  } = organizationData;

  const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

  let sql= `CALL cSaveOrganization('${ organizationName != undefined ? escapeSqlString(organizationName) : organizationName }', ${formatValue(organizationEmail)}
  , ${formatValue(organizationTypeID)}, ${ formatValue(registrationNumber != undefined ? escapeSqlString(registrationNumber) : registrationNumber )}
  , ${formatValue(registrationValidFrom)}, ${formatValue(registrationValidTo)}, ${formatValue( inchargeName != undefined ? escapeSqlString(inchargeName) : inchargeName )}
  , ${formatValue(inchargePhone)}, ${formatValue(inchargeEmail)}, ${formatValue(phoneNumber)}, ${formatValue(userID)}
  , ${formatValue( website != undefined ? escapeSqlString(website) : website )}, ${formatValue(country)}, ${formatValue(state)}, ${formatValue(district)}, ${formatValue(city)}
  , ${formatValue(localBodyType)}, ${formatValue(localBodyName)}, ${formatValue(wardName)}, ${formatValue(postOffice)}, ${formatValue(pinCode)}
  , ${formatValue(about != undefined ? escapeSqlString(about) : about )}, NULL, NULL, NULL)`;

  return sql;
};

/*
Author     : Abhijith JS
Date       : 5 June 2024
Purpose    : Sql Function for updating organization 
parameter  : organizationData
return type:  sql
*/
exports.qUpdateOrganization = function (organizationData) {
  const {
    organizationName,
    organizationEmail,
    organizationTypeID,
    registrationNumber,
    registrationValidFrom,
    registrationValidTo,
    inchargeName,
    inchargePhone,
    inchargeEmail,
    website,
    phoneNumber,
    country,
    city,
    district,
    state,
    localBodyType,
    localBodyName,
    wardName,
    postOffice,
    pinCode,
    about,
    userID,
    organizationID,
  } = organizationData;

  const formatValue = (value) =>
    value === undefined || validator.isNullOrEmpty(value) || value === ""
      ? "NULL"
      : `'${value}'`;

  const sql = `CALL cSaveOrganization(
    ${formatValue( organizationName != undefined ? escapeSqlString(organizationName) : organizationName )}, 
    ${formatValue(organizationEmail)}, 
    ${formatValue(organizationTypeID)}, 
    ${formatValue( registrationNumber != undefined ? escapeSqlString(registrationNumber) : registrationNumber )}, 
    ${formatValue(registrationValidFrom)}, 
    ${formatValue(registrationValidTo)}, 
    ${formatValue( inchargeName != undefined ? escapeSqlString(inchargeName) : inchargeName )}, 
    ${formatValue(inchargePhone)}, 
    ${formatValue(inchargeEmail)}, 
    ${formatValue(phoneNumber)}, 
    ${userID || "NULL"}, 
    ${formatValue( website != undefined ? escapeSqlString(website) : website )}, 
    ${formatValue(country)}, 
    ${state || "NULL"}, 
    ${district || "NULL"}, 
    ${formatValue(city)}, 
    ${formatValue(localBodyType)}, 
    ${formatValue(localBodyName)}, 
    ${formatValue(wardName)}, 
    ${formatValue(postOffice)}, 
    ${formatValue(pinCode)},
    ${formatValue( about != undefined ? escapeSqlString(about) : about )},
    NULL, 
    NULL, 
    ${organizationID || "NULL"}
  )`;

  return sql;
};

/*
Author     : Abhijith JS
Date       : 5 June 2024
Purpose    : Sql Function for deleting organization 
parameter  : organizationID
return type:  sql
*/
exports.qDeleteOrganization = function (organizationID) {
  let sql = `call sportfolio.cDeleteOrganization(${organizationID});`;
  
  return sql;
};

/*
Author     : Abhijith JS
Date       : 5 June 2024
Purpose    : Sql Function to check if email and organization name already exists
parameter  : organizationName,organizationEmail
return type:  sql
*/
exports.qCheckOrganizationNameAndEmail = function (
  organizationName,
  organizationEmail
) {
  let sql = `CALL CheckOrganizationNameAndEmail('${escapeSqlString(organizationName)}', '${organizationEmail}')`;
  return sql;
};

/*
Author     : Abhijith JS
Date       : 5 June 2024
Purpose    : Sql Function to get organization by userID
parameter  : organizationName,organizationEmail
return type:  sql
*/
exports.qgetOrganizationDetailsByUserID = function (userID) {
  let sql = `SELECT OrganizationID,OrganizationName,OrganizationEmail FROM tOrganization WHERE UserID = ${userID}`;
  return sql;
};

//sql to check mail not matching with id

exports.qExcludeCurrentOrganization = function (updateOrganizationData) {
  let sql = `SELECT * FROM torganization WHERE `;
  sql += `OrganizationEmail= '${updateOrganizationData.organizationEmail}' AND OrganizationID != '${updateOrganizationData.organizationID}'`;
  return sql;
};


/*
Author     : Abhijith JS
Date       : 28 October 2024
Purpose    : sql query function for Saving organization avatar
parameter  : organizationEnteredDetails 
return type: sql query
*/
exports.qSaveOrganizationAvatar = function(organizationEnteredDetails) {
  const { organizationID, uploadsInfo } = organizationEnteredDetails;
  const uploadsJson = JSON.stringify(uploadsInfo);
  
  const sql = `CALL cSaveOrganizationAvatar(${organizationID}, '${uploadsJson}', NULL);`;
  
  return sql;
}


/*
Author     : Abhijith JS
Date       : 28 October 2024
Purpose    : sql function for updating organization Avatar/profile photo 
parameter  : userEnteredDetails 
return type: sql
*/
exports.qUpdateOrganizationAvatar = function (organizationEnteredDetails) {
  const { organizationID, uploadsInfo, documentID } = organizationEnteredDetails;
  const uploadsJson = JSON.stringify(uploadsInfo);

  const formatValue = (value) =>
    value === undefined || validator.isNullOrEmpty(value) ? 'NULL' : `'${value}'`;

  const sql = `CALL cSaveOrganizationAvatar(
    ${formatValue(organizationID)},
    ${formatValue(uploadsJson)},
    ${formatValue(documentID)});`;

  return sql;
};


/*
Author     : Abhijith JS
Date       : 20 November 2024
Purpose    : MySql query function to search organization details with keyword.
parameter  : keywordSearchText 
return     : sql query
*/
exports.qKeySearchOrganization = function (keywordSearchText, fetchTypes, page, pageSize) {
  let conditions = "";
  let orConditions = [];
  let andConditions = [];

  let limitations;

  if (keywordSearchText) {
    // List of fields to search for organizations
    const searchFields = ["tog.OrganizationName", "tog.OrganizationEmail", "tog.PhoneNumber", "tog.Website", "tog.DistrictID"];

    // Build search conditions for each field
    searchFields.forEach((field) => {
      orConditions.push(`${field} LIKE ''%${keywordSearchText}%''`);
    });
  }

  if (!validator.isNullOrEmpty(fetchTypes.userID)) {
    fetchTypes?.type =="M" || fetchTypes?.type =="O" ? andConditions.push(`togm.MemberID = ${fetchTypes.userID}`) : andConditions.push(`tog.CreatedBy  = ${fetchTypes.userID}`);
  }
  // Combine OR conditions
  if (orConditions.length > 0) {
    conditions += '(' + orConditions.join(" OR ") + ')';
  }
  // Combine AND conditions
  if (andConditions.length > 0) {
    conditions += (conditions ? ' AND ' : '') + andConditions.join(" AND ");
  }

  // Pagination logic
  if (!validator.isNullOrEmpty(page || pageSize)) {
    const offset = (page - 1) * pageSize;
    limitations = `LIMIT ${pageSize} OFFSET ${offset}`;
  }

  // Pass conditions and limitations as parameters to the stored procedure
  conditions = !validator.isNullOrEmpty(conditions) ? `'${conditions}'` : null;
  limitations = !validator.isNullOrEmpty(limitations) ? `'${limitations}'` : null;

  const formatValue = (value) => 
    value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

  // Use the stored procedure for searching organizations
  let sql = `CALL cSearchOrganizationByKey(${conditions}, ${limitations}, ${formatValue(fetchTypes.type)});`;

  return { sql };
};
