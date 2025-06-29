const globalConstants = require('../common/globalConstants');
/*
Author     : Abhijith JS
Date       : 29 May 2024
Purpose    : function for sql query- calling stored procedure for login
parameter  : loginCredentials 
return     : sql query
*/
exports.qLoginUser = function (loginCredentials) {
  const sql = `CALL ${globalConstants.connectionString.database}.authenticateUser('${loginCredentials.email}','${loginCredentials.encryptedPassword}')`;
  return sql;
};

/*
Author     : Abhijith JS
Date       : 29 May 2024
Purpose    : function for sql query- calling stored procedure for checking if email already present
parameter  : signUpData 
return     : sql query
*/
exports.qCheckMail = function (signUpData) {
  let sql = `CALL ${globalConstants.connectionString.database}.GetUserByEmail('${signUpData.email}')`;
  return sql;
};
