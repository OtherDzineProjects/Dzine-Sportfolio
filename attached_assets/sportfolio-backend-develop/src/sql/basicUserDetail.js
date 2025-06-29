const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");
const globalConstants = require("../common/globalConstants");


/*
Author     : Abhijith JS
Date       : 4 july 2024
Purpose    : MySql query function for user basic detail adding.
parameter  : userEnteredDetails 
return     : sql query
*/
exports.qSaveBasicUserDetail = function (userEnteredDetails) {
  
  const representingDistrictIDs = JSON.stringify(userEnteredDetails.representingDistricts);

  const sql = `CALL ${globalConstants.connectionString.database}.cSaveBasicUserDetail('${validator.escapeHtml(userEnteredDetails.firstName)}', '${validator.escapeHtml(userEnteredDetails.middleName)}'
  , '${validator.escapeHtml(userEnteredDetails.lastName)}','${validator.escapeHtml(userEnteredDetails.nickName)}','${userEnteredDetails.userID}','${userEnteredDetails.emailID}', '${userEnteredDetails.phoneNumber}' 
  , '${userEnteredDetails.alternativePhoneNumber}', '${userEnteredDetails.gender}','${userEnteredDetails.dateOfBirth}','${validator.escapeHtml(userEnteredDetails.bio)}','${userEnteredDetails.bloodGroup}', '${userEnteredDetails.country}'
  ,'${userEnteredDetails.state}','${userEnteredDetails.district}','${validator.escapeHtml(userEnteredDetails.city)}','${userEnteredDetails.locationID}','${representingDistrictIDs}'
  ,'${validator.escapeHtml(userEnteredDetails.houseName)}','${validator.escapeHtml(userEnteredDetails.streetName)}','${validator.escapeHtml(userEnteredDetails.place)}','${userEnteredDetails.localBodyType}','${userEnteredDetails.localBodyName}'
  ,'${userEnteredDetails.wardName}','${userEnteredDetails.postOffice}','${validator.escapeHtml(userEnteredDetails.pinCode)}', NULL)`;
     return sql;
  };

  /*
Author     : Abhijith JS
Date       : 4 july 2024
Purpose    : MySql query function to get user by id.
parameter  :  userBasicDetailID
return     : sql query
*/


exports.qGetBasicUserDetailByID = function (userBasicDetailID) {
  let sql = `SELECT 
      u.UserBasicDetailID as id,
      u.FirstName as firstName,
      u.MiddleName as middleName, 
      u.LastName as lastName,
      u.NickName as nickName, 
      u.EmailID as emailID,
      u.PhoneNumber as phoneNumber,
      u.AlternativePhoneNumber as alternativePhoneNumber,
      g.LookupDetailName as gender,
      u.DateOfBirth as dateOfBirth,
      b.LookupDetailName as bloodGroup,
      cy.RegionName as country,
      u.CountryID as countryID,
      s.RegionName as state,
      u.StateID as stateID,
      d.RegionName as district,
      u.DistrictID as districtID,
      c.RegionName as city,
      u.City as cityID,
      u.RepresentingDistrictID as representingDistricts,
      u.HouseName as houseName,
      u.StreetName as streetName,
      u.Place as place,
      w.RegionName as wardName,
      u.PostOffice as postOffice,
      u.PinCode as pinCode ,
      COALESCE(
        (SELECT JSON_OBJECT(
            "documentID", td.DocumentID,
            "path", td.DocumentUrl,
            "fileName", td.DocumentName
          )
          FROM tdocument td
          JOIN tlookupdetail tl ON td.DocumentTypeID = tl.LookupDetailID
          WHERE td.OwnerID = u.UserID
          AND tl.LookupDetailName = 'User'
          LIMIT 1
        ), NULL
      ) AS avatar
  FROM tuserbasicdetail u
  LEFT JOIN tlookupdetail g ON u.Gender = g.LookupDetailID
  LEFT JOIN tlookupdetail b ON u.BloodGroup = b.LookupDetailID
  LEFT JOIN tregion cy ON u.CountryID = cy.RegionID
  LEFT JOIN tregion s ON u.StateID = s.RegionID
    LEFT JOIN tregion d ON u.DistrictID = d.RegionID
    LEFT JOIN tregion c ON u.City = c.RegionID
    LEFT JOIN tregion w ON u.WardID = w.RegionID`;

  if (validator.isNullOrEmpty(userBasicDetailID)) {
      return { error: errorMessages.ERROR_NOUSERID };
  } else {
      sql += ` WHERE u.UserBasicDetailID = ${userBasicDetailID}`;
      return sql;
  }
};
  

  /*
Author     : Abhijith JS
Date       : 5 july 2024
Purpose    : MySql query function to search user by input user details.
parameter  : userEnteredDetails 
return     : sql query
*/
exports.qSearchBasicUserDetail = function (userEnteredDetails, page, pageSize) {
    let conditions = [];
    let limitations;

    // Conditions for filtering user details
    if (userEnteredDetails) {
        if (!validator.isNullOrEmpty(userEnteredDetails.userID)) {
            conditions.push(`u.UserID = ''${userEnteredDetails.userID}''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.firstName)) {
            conditions.push(`u.FirstName LIKE ''${userEnteredDetails.firstName}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.middleName)) {
          conditions.push(`u.MiddleName LIKE ''${userEnteredDetails.middleName}%''`);
      }
        if (!validator.isNullOrEmpty(userEnteredDetails.lastName)) {
            conditions.push(`u.LastName LIKE ''${userEnteredDetails.lastName}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.nickName)) {
          conditions.push(`u.NickName LIKE ''${userEnteredDetails.nickName}%''`);
      }
        if (!validator.isNullOrEmpty(userEnteredDetails.emailID)) {
            conditions.push(`u.EmailID LIKE ''${userEnteredDetails.emailID}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.phoneNumber)) {
            conditions.push(`u.PhoneNumber LIKE ''${userEnteredDetails.phoneNumber}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.alternativePhoneNumber)) {
          conditions.push(`u.AlternativePhoneNumber LIKE ''${userEnteredDetails.alternativePhoneNumber}%''`);
      }
        if (!validator.isNullOrEmpty(userEnteredDetails.dateOfBirth)) {
            conditions.push(`u.DateOfBirth LIKE ''${userEnteredDetails.dateOfBirth}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.bloodGroup)) {
            conditions.push(`b.LookupDetailName LIKE ''${userEnteredDetails.bloodGroup}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.country)) {
          conditions.push(`c.RegionName LIKE ''${userEnteredDetails.country}%''`);
      }
        if (!validator.isNullOrEmpty(userEnteredDetails.state)) {
            conditions.push(`s.RegionName LIKE ''${userEnteredDetails.state}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.district)) {
            conditions.push(`d.RegionName LIKE ''${userEnteredDetails.district}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.houseName)) {
            conditions.push(`u.HouseName LIKE ''${userEnteredDetails.houseName}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.streetName)) {
            conditions.push(`u.StreetName LIKE ''${userEnteredDetails.streetName}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.postOffice)) {
            conditions.push(`p.RegionName LIKE ''${userEnteredDetails.postOffice}%''`);
        }
        if (!validator.isNullOrEmpty(userEnteredDetails.pinCode)) {
            conditions.push(`u.PinCode LIKE ''${userEnteredDetails.pinCode}%''`);
        }

        // Join the conditions into a single string
        conditions = conditions.length > 0 ? conditions.join(" AND ") : null;
    }

    // Pagination logic
    if (!validator.isNullOrEmpty(page || pageSize)) {
        const offset = (page - 1) * pageSize;
        limitations = `LIMIT ${pageSize} OFFSET ${offset}`;
    }
    
    // Pass conditions and limitations as parameters to the stored procedure
    conditions = !validator.isNullOrEmpty(conditions) ? `'${conditions}'` : null
    limitations = !validator.isNullOrEmpty(limitations) ? `'${limitations}'` : null

    let sql = `CALL cSearchBasicUserDetail(${conditions}, ${limitations});`;

    return { sql };
};




/*
Author     : Abhijith JS
Date       : 5 july 2024
Purpose    : To update the basic user details
parameter  : userEnteredDetails
return type:  sql
*/
exports.qUpdateBasicUserDetail = function (userEnteredDetails) {
  const {
    firstName, middleName, lastName, nickName, emailID, phoneNumber, alternativePhoneNumber, gender, dateOfBirth, bio, bloodGroup, country, state, district, userID, userBasicDetailID,
    city, representingDistricts, houseName, streetName, place, wardName, postOffice, pinCode
  } = userEnteredDetails;
  const representingDistrictIDs = JSON.stringify(representingDistricts);

  const formatValue = (value) =>
    value === undefined || validator.isNullOrEmpty(value) ? null : `'${value}'`;

  const sql = `CALL cSaveBasicUserDetail(
    ${formatValue(validator.escapeHtml(firstName)) || 'NULL'},
    ${formatValue(validator.escapeHtml(middleName)) || 'NULL'},
    ${formatValue(validator.escapeHtml(lastName)) || 'NULL'},
    ${formatValue(validator.escapeHtml(nickName)) || 'NULL'},
    ${formatValue(userID) || 'NULL'},
    ${formatValue(emailID) || 'NULL'},
    ${formatValue(phoneNumber) || 'NULL'},
    ${formatValue(alternativePhoneNumber) || 'NULL'},
    ${formatValue(gender) || 'NULL'},
    ${formatValue(dateOfBirth) || 'NULL'},
    ${formatValue(validator.escapeHtml(bio)) || 'NULL'},
    ${formatValue(bloodGroup) || 'NULL'},
    ${formatValue(country) || 'NULL'},
    ${formatValue(state) || 'NULL'},
    ${formatValue(district) || 'NULL'},
    ${formatValue(validator.escapeHtml(city)) || 'NULL'},
    ${formatValue(userEnteredDetails.locationID) || 'NULL'},
    ${formatValue(representingDistrictIDs) || 'NULL'},
    ${formatValue(validator.escapeHtml(houseName)) || 'NULL'},
    ${formatValue(validator.escapeHtml(streetName)) || 'NULL'},
    ${formatValue(validator.escapeHtml(place)) || 'NULL'},
    ${formatValue(userEnteredDetails.localBodyType) || 'NULL'},
    ${formatValue(userEnteredDetails.localBodyName) || 'NULL'},
    ${formatValue(wardName) || 'NULL'},
    ${formatValue(postOffice) || 'NULL'},
    ${formatValue(validator.escapeHtml(pinCode)) || 'NULL'},
    ${formatValue(userBasicDetailID) || 'NULL'}
  )`;

  return sql;
};
  


  /*
Author     : Abhijith JS
Date       : 5 july 2024
Purpose    : MySql query function to delete user by userBasicDetailID.
parameter  : userBasicDetailID 
return     : sql query
*/
exports.qDeleteBasicUserDetail = function (dataPassed) {
  if (validator.isNullOrEmpty(dataPassed)) {
    return { error: errorMessages.ERROR_NOUSER_BASICDETAILID };
  }else {
    let sql = `call sportfolio.cDeleteUserBasicDetail('${dataPassed}');`
    return sql;
  }
};









/*
Author     : Abhijith JS
Date       : 4 july 2024
Purpose    : sql to check mail not matching with id
parameter  : userEnteredDetails 
return     : sql query
*/
exports.qExcludeCurrentUser = function (userEnteredDetails) {
  let sql = `CALL ${globalConstants.connectionString.database}.GetUserDetailByEmail('${userEnteredDetails.emailID}','${userEnteredDetails.userID}','${userEnteredDetails.userBasicDetailID}')`;
  return sql;
};
  
/*
Author     : Abhijith JS
Date       : 4 july 2024
Purpose    : store procedure call for checking if user already present
parameter  : userEnteredDetails 
return     : sql query
*/
  exports.qCheckMail = function (emailID, userID) {
    let sql = `CALL ${globalConstants.connectionString.database}.GetUserDetailByEmail('${emailID}', '${userID}', NULL)`;
    return sql;
  };

  