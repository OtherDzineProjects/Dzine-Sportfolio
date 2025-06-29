const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");

/*
Author     : VARUN H M
Date       : 29 August 2024
Purpose    : Sql Function for searching organization activity
parameter  : searchOrganizationData
return type:  sql
*/
exports.qSearchOrganization = function ( searchOrganizationData, page, pageSize ) {
  let conditions = [];
  let limitations;
//   let sql = `SELECT 
//     toa.OrganizationActivityID AS organizationActivityID,toa.OrganizationID AS organizationID, ta.ActivityID AS activityID, ta.ActivityName AS activityName,toa.Reason AS reason
//     ,tl.LookupDetailName as status, total_count.total_count
// FROM 
//     torganizationactivity toa
// INNER JOIN 
//     tactivity ta ON toa.ActivityID = ta.ActivityID
// INNER JOIN 
//     tlookupdetail tl ON tl.LookupDetailID = toa.Status `
//   let selectTotalCount = `SELECT COUNT(*) as total_count FROM torganizationactivity toa`;

  if (searchOrganizationData) {
    if (!validator.isNullOrEmpty(searchOrganizationData.organizationID)) {
      conditions.push(`organizationID = ${searchOrganizationData.organizationID}`);
    }

    conditions = conditions.length > 0 ? conditions.join(" AND ") : null
  }
  if (!validator.isNullOrEmpty(page || pageSize)) {
    const offset = (page - 1) * pageSize;
    limitations = ` LIMIT ${pageSize} OFFSET ${offset}`;
}

conditions = !validator.isNullOrEmpty(conditions) ? `'${conditions}'` : null
limitations = !validator.isNullOrEmpty(limitations) ? `'${limitations}'` : null


let sql = `CALL cSearchOrganizationActivity(${conditions},${limitations});`

return sql;

};

/*
Author     : VARUN H M
Date       : 29 August 2024
Purpose    : Sql Function for getting organization activity by ID
parameter  : organizationActivityID
return type:  sql
*/
exports.qGetOrganizationByActivityID = function (organizationActivityID) {
  let sql = `SELECT toa.OrganizationActivityID AS organizationActivityID,toa.OrganizationID AS organizationID, ta.ActivityID AS activityID, ta.ActivityName AS activityName
  ,toa.Reason AS reason,tl.LookupDetailName as status 
    FROM 
      torganizationactivity toa 
    INNER JOIN 
      tactivity ta ON toa.ActivityID = ta.ActivityID 
    INNER JOIN 
      tlookupdetail tl ON tl.LookupDetailID = toa.Status WHERE `;

  if (validator.isNullOrEmpty(organizationActivityID)) {
    return { error: errorMessages.ERROR_NOUSERID };
  } else {
    sql += `OrganizationActivityID = ${organizationActivityID} AND Status != (SELECT ActionCodeID FROM tactioncode WHERE Description = 'Delete')`;
    return sql;
  }
};

/*
Author     : VARUN H M
Date       : 29 August 2024
Purpose    : Sql Function for saving new organization activity
parameter  : organizationData
return type:  sql
*/
exports.qSaveOrganizationActivity = function (organizationData) {
  const {
    activityID,
    organizationID,
    userID
  } = organizationData;
  return `CALL cSaveOrganizationActivity('${activityID}', '${organizationID}', '${userID}')`;
};



/*
Author     : VARUN H M
Date       : 5 June 2024
Purpose    : Sql Function to delete organization by organization ID
parameter  : organizationID
return type:  sql
*/
exports.deleteOrganizationExistsInactivity = function (
  organizationID
) {
  let sql = `CALL cDeleteOrganizationExistsInActivity('${organizationID}')`;
  return sql;
};


/*
Author     : Abhijith JS
Date       : 25 October 2024
Purpose    : Sql query Function to delete organizationactivity by organization ID
parameter  : organizationID
return type:  sql
*/
exports.qDeleteOrganizationActivity = function (organizationID) {

  let sql = `
    UPDATE torganizationactivity 
    SET Status = (
      SELECT ActionCodeID 
      FROM tactioncode 
      WHERE Description = 'Delete'
    )
    WHERE OrganizationID = ${organizationID};
  `;
   return sql;
  
};
