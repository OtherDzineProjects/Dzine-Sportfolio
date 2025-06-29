const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const generalMessages = require('../common/generalMessages');
const errorMessages = require("./errorMessages");
const queries = require("../sql/records");
const { executeQuery } = require("../common/dbConnect");
const globalConstants = require('../common/globalConstants');
const commonQuery = require('./commonFunctionsSql')


/*
Author     : Abhijith JS
Date       : 17 May 2024
Purpose    : function for encrypting the password
parameter  : password  
return type : encrypted password as String.
*/
function encryptPassword(password) {
  if (password) {
    var encryptedPassword = crypto
      .createHash(generalMessages.password_encriptionType)
      .update(password)
      .digest(generalMessages.convertTo_hex);
    return encryptedPassword;
  }
}

/*
Author     : Abhijith JS
Date       : 28 May 2024
Purpose    : function for decrypting the password
parameter  : 
return type: decrypted password.
*/
function decryptPassword() {}

/*
Author     : Abhijith JS
Date       : 28 May 2024
Purpose    : function for creating JWT token
parameter  : userData
return type: JWT token.
*/
function createJWTToken(userData) {
  const payload = {
    userID: userData.UserID,
    firstName: userData.FirstName,
    lastName: userData.LastName,
    email: userData.Email,
    roleID: userData.RoleID,
    SFID: userData.SFID,
    isAdmin: userData.IsAdmin,
  };
  const token = jwt.sign(payload, generalMessages.secret_Key , { noTimestamp:true, expiresIn: generalMessages.token_Expiry });
  return token;
}

function extractUserDetails(token) {
  try {
      const decoded = jwt.verify(token, generalMessages.secret_Key);
      let userID = decoded.userID
      const roleID = decoded.roleID

      // Return both values
      return { userID, roleID };
    } catch (err) {
      // Handle error / token invalid
      throw new Error(errorMessages.ERROR_INVALID_TOKEN);
  }
}



function toGetCredentials() {
  var promise = new Promise(function(resolve, reject){
    let query = queries.qGetCredentialSetting();
    executeQuery(query,null)    
    .then((result)=>{
      let credentials = result? result[0].Credential : false

      resolve(credentials);
    })
    .catch((err) => {
      resolve(false)
  });
  });
  return promise; 
}


function configureCloudinary() {

  return toGetCredentials()
  .then((credentials) => {
    if (credentials) {
      cloudinary.config(credentials);

      return new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => {
          const originalFileName = file.originalname.split('.')[0];
          return {
          folder: "Cloudinary",
          public_id: originalFileName,
          allowed_formats: ['jpeg', 'png', 'jpg', 'pdf', 'mp4', 'avi', 'mkv'],
          resource_type: 'auto'
        }}
      });
    } else {
      throw new Error('Cloudinary credentials not found');
    }
  });
}

function getUploadMiddleware() {
  return configureCloudinary()
    .then(storage => multer({ storage }).array('uploads', globalConstants.filesLimit))
    .catch(err => {
      throw err;
    });
}

function deleteCloudinaryImage(filename) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(filename, (error, result) => {
      if (error) {
        resolve(error);
      } else {
        resolve(result);
      }
    });
  });
}

function deleteMultipleImages(cloudinaryDatas, callback) {
  // Create an array of promises for each image deletion
  const deletePromises = cloudinaryDatas.map(cloudinaryData => deleteCloudinaryImage(cloudinaryData.filename));

  // Use Promise.all to handle all deletions
  return Promise.all(deletePromises)
    .then(results => {
      return callback(true, null);
    })
    .catch(error => {
      return callback(null, `${error.message}`);
    });
}


function getEmailFromLookupType(communicationDetails, callback) {
  // Collect promises
  const promises = communicationDetails.map(data => {
    let query = commonQuery.qCheckCommunicationType(data.communicationTypeId);

    return executeQuery(query, null)
      .then(result => {
        if (result.length > 0) {
          data.communicationTypeName = result[0].LookupDetailName;
          return data;  // Return updated data
        }
        return null;  // No result found
      })
      .catch(err => {
        return Promise.reject(err);  // Propagate error
      });
  });

  // Wait for all promises to complete
  Promise.all(promises)
    .then(results => {
      // Filter out null results
      const filteredResults = results.filter(result => result !== null);

      if (filteredResults.length > 0) {
        callback(filteredResults, null);  // Success: return filtered results
      } else {
        callback(null, null);  // No matching results
      }
    })
    .catch(err => {
      callback(null, err);  // Error handling: pass error to callback
    });
}

/*
Author     : VARUN H M
Date       : 30 September 2024
Purpose    : Fuction for escaping the special characters.
parameter  : string
return type: string
*/

function escapeHtml(string) {
  return string.replace(/[&<>"'\/`\\]/g, function(match) {
      switch (match) {
          case '&':
              return '&amp;';   // Ampersand
          case '<':
              return '&lt;';    // Less than
          case '>':
              return '&gt;';    // Greater than
          case '"':
              return '&quot;';  // Double quote
          case "'":
              return '&#39;';    // Single quote
          case '/':
              return '&#47;';     // Forward slash
          case '`':
              return '&#96;';     // Backtick
          case '\\':
              return '&#92;';     // Backslash
      }
  });
}

/*
Author     : ABHIJITH JS
Date       : 14 October 2024
Purpose    : Fuction for escaping the special characters(',",\").
parameter  : string
return type: string
*/
let escapeSqlString = function(string) {
  return string.replace(/'/g, function(match) {
    switch (match) {
        case "'":
            return "''";    // Single quote
    }
});
}
module.exports.escapeSqlString = escapeSqlString;



module.exports = { 
  encryptPassword, 
  decryptPassword, 
  createJWTToken, 
  extractUserDetails, 
  getUploadMiddleware, 
  deleteCloudinaryImage, 
  deleteMultipleImages,
  getEmailFromLookupType,
  escapeHtml,
  escapeSqlString
};
