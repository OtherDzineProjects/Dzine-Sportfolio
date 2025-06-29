const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");
const globalConstants = require("../common/globalConstants");
const mysql = require("mysql");


/*
Author     : Abhijith JS
Date       : 14 August 2024
Purpose    : function for saving user contact details.
parameter  : userEnteredDetails
return type: sql 
*/
exports.qSaveUserContactDetail = function (userEnteredDetails) {

  const filteredCommunicationDetails = [];
    // Iterate over the communicationDetails array
    for (const detail of userEnteredDetails.communicationDetails) {
      if (!validator.isNullOrEmpty(detail.value)) {
          filteredCommunicationDetails.push(detail);
      }
  }

    // Convert the filtered array to JSON
    const communicationDetailsJson = JSON.stringify(filteredCommunicationDetails);
    if (validator.isNullOrEmpty(userEnteredDetails.sameAsBasicDetail)) {
      userEnteredDetails.sameAsBasicDetail= false;
  }
    const sameAsBasicDetailValue = userEnteredDetails.sameAsBasicDetail == false ? 0 : 1;

  // Construct the SQL query
  const sql = `CALL ${globalConstants.connectionString.database}.cSaveUserContactDetail('${userEnteredDetails.userID}','${userEnteredDetails.addressType}','${userEnteredDetails.country}'
  ,'${userEnteredDetails.state}','${userEnteredDetails.district}','${validator.escapeHtml(userEnteredDetails.city)}','${validator.escapeHtml(userEnteredDetails.houseName)}','${validator.escapeHtml(userEnteredDetails.streetName)}'
  ,'${validator.escapeHtml(userEnteredDetails.place)}','${userEnteredDetails.localBodyType}','${userEnteredDetails.localBodyName}','${userEnteredDetails.wardName}'
  ,'${userEnteredDetails.postOffice}','${validator.escapeHtml(userEnteredDetails.pinCode)}','${communicationDetailsJson}','${sameAsBasicDetailValue}',NULL)`;

  return sql;
};



/*
Author     : Abhijith JS
Date       : 14 August 2024
Purpose    : function for fetching user contact details.
parameter  : userContactDetailID
return type: sql 
*/
  exports.qGetBasicUserDetailByID = function (userContactDetailID) {
    let sql = `SELECT 
        u.UserContactDetailID as id,
        u.AddressType as addressType,
        cy.RegionName as country,
        u.CountryID as countryID,
        s.RegionName as state,
        u.StateID as stateID,
        d.RegionName as district,
        u.DistrictID as districtID,
        c.RegionName as city,
        u.CityID as cityID,
        u.HouseName as houseName,
        u.StreetName as streetName,
        u.Place as place,
        w.RegionName as wardName,
        u.PostOffice as postOffice,
        u.PinCode as pinCode, 
        u.CommunicationDetails as communicationDetails
    FROM tusercontactdetail u
    LEFT JOIN tregion cy ON u.CountryID = cy.RegionID
    LEFT JOIN tregion s ON u.StateID = s.RegionID
    LEFT JOIN tregion d ON u.DistrictID = d.RegionID
    LEFT JOIN tregion c ON u.CityID = c.RegionID
    LEFT JOIN tregion w ON u.WardID = w.RegionID`;
  
    if (validator.isNullOrEmpty(userContactDetailID)) {
        return { error: errorMessages.ERROR_NOUSERID };
    } else {
        sql += ` WHERE u.UserContactDetailID = ${userContactDetailID}`;
        return sql;
    }
  };


/*
Author     : Abhijith JS
Date       : 22 August 2024
Purpose    : function for searching user contact details.
parameter  : userID
return type: sql 
*/
exports.qSearchUserContactDetail = function (userID, page, pageSize) {
  let conditions = [];
  let limitations = '';

  if (userID && !validator.isNullOrEmpty(userID)) {
    conditions.push(`tc.UserID = ${mysql.escape(userID)}`);
  }

  if (page && pageSize) {
    let offset = (page - 1) * pageSize;
    limitations = `LIMIT ${mysql.escape(pageSize)} OFFSET ${mysql.escape(offset)}`;
  }

  let conditionsStr = conditions.length > 0 ? conditions.join(" AND ") : '1=1'; // Default condition
  let sql = `CALL cSearchUserContactDetail(${mysql.escape(userID)}, ${mysql.escape(page)}, ${mysql.escape(pageSize)});`;
  return { sql };
};


/*
Author     : Abhijith JS
Date       : 15 August 2024
Purpose    : function for updating user contact details.
parameter  : userEnteredDetails
return type: sql 
*/
  exports.qUpdateUserContactDetail = function (userEnteredDetails) {
    let { addressType, country, state, district, city, houseName, streetName, place
        ,localBodyType, localBodyName, wardName, postOffice, pinCode, communicationDetails, userContactDetailID, userID, sameAsBasicDetail
    } = userEnteredDetails;

    const filteredCommunicationDetails = [];

    // Iterate over the communicationDetails array
    for (const detail of communicationDetails) {
        if (!validator.isNullOrEmpty(detail.value)) {
            filteredCommunicationDetails.push(detail);
        }
    }
    // Convert the filtered array to JSON
    const communicationDetailsJson = JSON.stringify(filteredCommunicationDetails);

    const formatValue = (value) =>{
      if (typeof value === 'number') {
        return value; // Pass numbers as-is
      }
      return value === undefined || validator.isNullOrEmpty(value) ? null : `'${value}'`;
    }
    if (validator.isNullOrEmpty(sameAsBasicDetail)) {
      sameAsBasicDetail= false;
  }
    const sameAsBasicDetailValue = sameAsBasicDetail == false ? 0 : 1;
    
    const sql = `CALL cSaveUserContactDetail(
      ${formatValue(userID) || 'NULL'},   
      ${formatValue(addressType) || 'NULL'},
      ${formatValue(country) || 'NULL'},
      ${formatValue(state) || 'NULL'},
      ${formatValue(district) || 'NULL'},
      ${formatValue(validator.escapeHtml(city)) || 'NULL'},
      ${formatValue(validator.escapeHtml(houseName)) || 'NULL'},
      ${formatValue(validator.escapeHtml(streetName)) || 'NULL'},
      ${formatValue(validator.escapeHtml(place)) || 'NULL'},
      ${formatValue(localBodyType) || 'NULL'},
      ${formatValue(localBodyName) || 'NULL'},
      ${formatValue(wardName) || 'NULL'},
      ${formatValue(postOffice) || 'NULL'},
      ${formatValue(validator.escapeHtml(pinCode)) || 'NULL'},
      ${formatValue(communicationDetailsJson) || 'NULL'},
      ${sameAsBasicDetailValue},
      ${formatValue(userContactDetailID) || 'NULL'}
    )`;

    return sql;
  };


/*
Author     : Abhijith JS
Date       : 15 August 2024
Purpose    : function for deleting user contact details.
parameter  : userContactDetailID
return type: sql 
*/
  exports.qDeleteUserContactDetail = function (userContactDetailID) {
    if (validator.isNullOrEmpty(userContactDetailID)) {
      return { error: errorMessages.ERROR_NOUSER_CONTACTDETAILID };
    }else {
      let sql = `call sportfolio.cDeleteUserContactDetail('${userContactDetailID}');`
      return sql;
    }
  };