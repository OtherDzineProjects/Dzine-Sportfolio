const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");


/*
Author     : Varun H M
Date       : 09 October 2024
Purpose    : Sql Function for saving new organization member
parameter  : organizationMemberData
return type:  sql
*/
exports.qSaveOrganizationMember = function (organizationMemberData) {
  const { organizationID, memberID, isOrganizationInitiated } = organizationMemberData;
  let sql = `CALL cSaveOrganizationMember('${organizationID}', '${memberID}', '${isOrganizationInitiated}', NULL)`;
  return sql;
};

/*
Author     : Varun H M
Date       : 09 October 2024
Purpose    : Sql Function for searching organization member
parameter  : searchOrganizationMemberData
return type:  sql
*/
exports.qSearchOrganizationMember = function (searchOrganizationMemberData, userID, page, pageSize) {
  let andConditions = [];
  let oRConditions = [];
  let limitations;
  let conditions = "";
  let StatusType;

  if (searchOrganizationMemberData) {
    if (!validator.isNullOrEmpty(searchOrganizationMemberData.name)) {
      oRConditions.push(`tu.FirstName LIKE ''${searchOrganizationMemberData.firstName}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationMemberData.name)) {
      oRConditions.push(`tu.LastName LIKE ''${searchOrganizationMemberData.lastName}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationMemberData.localBodyType)) {
      andConditions.push(`tubd.localBodyType = ${searchOrganizationMemberData.localBodyType}`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationMemberData.localBody)) {
      andConditions.push(`tubd.LocalBodyName = ${searchOrganizationMemberData.localBody}%`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationMemberData.ward)) {
      andConditions.push(`tubd.WardID = ${searchOrganizationMemberData.ward}`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationMemberData.district)) {
      andConditions.push(`tubd.DistrictID = ${searchOrganizationMemberData.district}`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationMemberData.state)) {
      andConditions.push(`tubd.StateID = ${searchOrganizationMemberData.state}`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationMemberData.postOffice)) {
      andConditions.push(`tubd.PostOffice = ${searchOrganizationMemberData.postOffice}`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationMemberData.pinCode)) {
      andConditions.push(`tubd.Pincode = '${searchOrganizationMemberData.pinCode}'`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationMemberData.organizationID)) {
      andConditions.push(`tog.OrganizationID = ${searchOrganizationMemberData.organizationID}`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationMemberData.organizationMemberID)) {
      andConditions.push(`tom.OrganizationMemberID = ${searchOrganizationMemberData.organizationMemberID}`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationMemberData.organizationName)) {
      andConditions.push(`tog.OrganizationName LIKE ''${searchOrganizationMemberData.organizationName}%''`);
    }
    if (!validator.isNullOrEmpty(searchOrganizationMemberData.memberID)) {
      andConditions.push(`tom.MemberID = ${searchOrganizationMemberData.memberID}`);
    }
    if ((searchOrganizationMemberData.isOrganizationInitiated == 1 ||  searchOrganizationMemberData.isOrganizationInitiated == 0 ) && 
            validator.isNumber(searchOrganizationMemberData.isOrganizationInitiated)) {
      andConditions.push(`tom.isOrganizationInitiated = ${searchOrganizationMemberData.isOrganizationInitiated}`);
    }

    if (!validator.isNullOrEmpty(searchOrganizationMemberData.type)) {
      StatusType =  searchOrganizationMemberData.type.toUpperCase()
    }

    conditions += oRConditions.length > 0 ? oRConditions.join(" OR ") : ''
    conditions += andConditions.length > 0 ? andConditions.join(" AND ") : ''
  }

  if (!validator.isNullOrEmpty(page || pageSize)) {
    const offset = (page - 1) * pageSize;
    limitations = ` LIMIT ${pageSize} OFFSET ${offset}`;
  }

  conditions = !validator.isNullOrEmpty(conditions) ? `'${conditions}'` : null
  limitations = !validator.isNullOrEmpty(limitations) ? `'${limitations}'` : null
  StatusType = !validator.isNullOrEmpty(StatusType) ? `'${StatusType}'` : null

  let sql = `CALL cSearchOrganizationMember(${conditions},${limitations},${StatusType});`

  return { sql };
};

/*
Author     : Varun H M
Date       : 09 October 2024
Purpose    : Sql Function for getting organization member byID
parameter  : organizationMemberID
return type:  sql
*/
exports.qGetOrganizationMemberByID = function (organizationMemberID) {
  let sql = `CALL cGetOrganizationMemberByID(${organizationMemberID});`;

  return sql;

};


/*
Author     : Varun H M
Date       : 09 October 2024
Purpose    : Sql Function for updating organization member
parameter  : organizationMemberData
return type:  sql
*/
exports.qUpdateOrganizationMember = function (organizationMemberData) {
  const {
    organizationID,
    memberID,
    isOrganizationInitiated,
    organizationMemberID,
  } = organizationMemberData;

  const formatValue = (value) => value === undefined || validator.isNullOrEmpty(value) || value === "" ? "NULL" : `'${value}'`;

  const sql = `CALL sportfolio.cSaveOrganizationMember( ${formatValue(organizationID)}, ${formatValue(memberID)}, '${isOrganizationInitiated}',  ${formatValue(organizationMemberID)})`;

  return sql;
};

/*
Author     : Varun H M
Date       : 09 October 2024
Purpose    : Sql Function for deleting organization member
parameter  : organizationMemberID
return type:  sql
*/
exports.qDeleteOrganizationMember = function (organizationMemberID) {
  let sql = `call sportfolio.cDeleteOrganizationMember(${organizationMemberID});`;

  return sql;
};

/*
Author     : Varun H M
Date       : 09 October 2024
Purpose    : Sql Function to check organization Id and member Id exists
parameter  : organizationID, memberId
return type:  sql
*/
exports.qCheckOrganizationIdAndMemberExists = function (organizationId, memberId) {
  let sql = `CALL sportfolio.cCheckOrganizationAndUserExists('${organizationId}', '${memberId}', NULL)`;

  return sql;
}

/*
Author     : Varun H M
Date       : 09 October 2024
Purpose    : Sql Function for deleting organization member
parameter  : organizationId, memberId, organizationMemberID
return type:  sql
*/
exports.qCheckOrganizationIdAndMemberExistsUpdate = function (organizationId, memberId, organizationMemberID) {
  let sql = `CALL sportfolio.cCheckOrganizationAndUserExists('${organizationId}', '${memberId}', '${organizationMemberID}')`;

  return sql;
}


/*
Author     : Abhijith JS
Date       : 08 November 2024
Purpose    : Sql Function for fetching organization members statuses count
parameter  : organizationID
return type: sql
*/
exports.qgetOrganizationMembersStatusData = function (organizationID, userID) {
  let sql = `CALL cgetOrganizationMembersStatusCount(${organizationID}, ${userID});`;

  return sql;

};

/*
Author     : Varun H M
Date       : 13 November 2024
Purpose    : Sql Function for fetching members details that are not added in organization member by organizationId
parameter  : searchMemberData, page, pageSize
return type: sql
*/
exports.qsearchMemberForOrganizationMember = function (searchMemberData, page, pageSize ) {
  let andConditions = [];
  let oRConditions = [];
  let organizationID;
  let limitations;
  let conditions = "";
  let StatusType;

  if (searchMemberData) {
    if (!validator.isNullOrEmpty(searchMemberData.firstName)) {
      oRConditions.push(`tub.FirstName LIKE ''${searchMemberData.firstName}%''`);
    }
    if (!validator.isNullOrEmpty(searchMemberData.lastName)) {
      oRConditions.push(`tub.LastName = ''${searchMemberData.lastName}%''`);
    }
    if (!validator.isNullOrEmpty(searchMemberData.localBodyType)) {
      andConditions.push(`tub.localBodyType = ${searchMemberData.localBodyType}`);
    }
    if (!validator.isNullOrEmpty(searchMemberData.localBody)) {
      andConditions.push(`tub.LocalBodyName = ${searchMemberData.localBody}%`);
    }
    if (!validator.isNullOrEmpty(searchMemberData.ward)) {
      andConditions.push(`tub.WardID = ${searchMemberData.ward}`);
    }
    if (!validator.isNullOrEmpty(searchMemberData.district)) {
      andConditions.push(`tub.DistrictID = ${searchMemberData.district}`);
    }
    if (!validator.isNullOrEmpty(searchMemberData.state)) {
      andConditions.push(`tub.StateID = ${searchMemberData.state}`);
    }
    if (!validator.isNullOrEmpty(searchMemberData.postOffice)) {
      andConditions.push(`tub.PostOffice = ${searchMemberData.postOffice}`);
    }
    if (!validator.isNullOrEmpty(searchMemberData.pinCode)) {
      andConditions.push(`tub.Pincode = '${searchMemberData.pinCode}'`);
    }
    if (!validator.isNullOrEmpty(searchMemberData.organizationID)) {
      organizationID = searchMemberData.organizationID;
    }

    if (!validator.isNullOrEmpty(searchMemberData.type)) {
      StatusType =  searchMemberData.type.toUpperCase()
    }

    conditions += oRConditions.length > 0 ? oRConditions.join(" OR ") : ''
    conditions += andConditions.length > 0 ? andConditions.join(" AND ") : ''
  }

  if (!validator.isNullOrEmpty(page || pageSize)) {
    const offset = (page - 1) * pageSize;
    limitations = ` LIMIT ${pageSize} OFFSET ${offset}`;
  }

  conditions = !validator.isNullOrEmpty(conditions) ? `'${conditions}'` : null
  limitations = !validator.isNullOrEmpty(limitations) ? `'${limitations}'` : null
  StatusType = !validator.isNullOrEmpty(StatusType) ? `'${StatusType}'` : null

  let sql = `CALL csearchMemberForOrganizationMember(${conditions}, ${organizationID}, ${limitations});`

  return { sql };

};

/*
Author     : Varun H M
Date       : 27 December 2024
Purpose    : Sql Function for updating organization member ownership
parameter  : organizationID, userIDs, isOwner
return type: sql
*/
exports.qUpdateOrganizationMemberOwnership = function (organizationMemberOwnershipDetails) {
  const { organizationID, userIDs, isOwner } = organizationMemberOwnershipDetails;

  let sql = `CALL cUpdateOrganizationMemberOwnership(${organizationID}, '${userIDs}', ${isOwner});`;

  return sql;

};