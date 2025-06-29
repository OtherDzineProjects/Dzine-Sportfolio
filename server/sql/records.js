const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");
const globalConstants = require("../common/globalConstants");



exports.qGetCredentialSetting = function (recordsData) {
    const sql = `CALL ${globalConstants.connectionString.database}.qGetCredentialSetting()`;
    return sql;
  };
