const errorMessages = require("../common/errorMessages");
const validator = require("../common/validation");
const globalConstants = require("../common/globalConstants");


/*
Author     : Abhijith JS
Date       : 6 August 2024
Purpose    : sql function for fetching region
parameter  : regionID 
return type: sql query
*/
exports.qGetRegionMasters = function(regionID){

    let sql = `SELECT RegionName FROM tregion`;

    if(validator.isNullOrEmpty(regionID)){
        return response.status(404).json({
            success:false,
            data:null,
            errMsg:errorMessages.ERROR_NOREGIONID
    })
    }else {
        sql+= ` WHERE RegionID = '${regionID}'`;
        return sql;
    }
}