const express = require('express');
const router = express.Router();
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const activityServices = require("../services/activity");


/*
Author     : Abhijith JS
Date       : 29 August 2024
Purpose    : route for saving activity
parameter  : activityData
return type:  int
*/
router.post("/api/organization/activity", (request, response) => {
    const {
        activityName,
        activityDescription,
        parentID,
        userID
      } = request.body;
      //validating if any fields are missing data
      if (
        validator.isNullOrEmpty(activityName) &&
        validator.isNullOrEmpty(activityDescription) &&
        validator.isNullOrEmpty(parentID) &&
        validator.isNullOrEmpty(userID) 
      ){
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_MISSINGFIELDS,
        });
      }
    
      //passing activity data into an object
      const activityData = {
        activityName,
        activityDescription,
        parentID,
        userID
      };
    
      activityServices.saveActivity(
        activityData,
        (activityID, errMsg) => {
          if (errMsg) {
            console.error(errorMessages.ERROR_SAVINGACTIVITY, errMsg);
            return response.status(400).json({
              success: false,
              data: null,
              errMsg: errMsg,
            });
          } else if(validator.isNullOrEmpty(activityID)){
                return response.status(201).json({
                    success: true,
                    data: null,
                    errMsg: errorMessages.ERROR_ACTIVITYEXISTS,
                });
          }
          else{
            return response.status(201).json({
              success: true,
              data: activityID,
              errMsg: null,
            });
          }
        }
      );
    });


/*
Author     : Abhijith JS
Date       : 29 August 2024
Purpose    : route for Fetching activity by activityID
parameter  : activityID
return type:  Array with data
*/
    router.get("/api/organization/activity/:id", (request, response) => {
        const activityID = request.params.id;
      
        if (validator.isNullOrEmpty(activityID)) {
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_NOACTIVITY_ID,
          });
        }
        activityServices.getActivityByID(
            activityID,
          (Activity, errMsg) => {
            if (errMsg) {
              // If any error occurs while finding activity
              console.error(errorMessages.ERROR_FETCHING_ACTIVITYDETAILS, errMsg);
              return response.status(404).json({
                success: false,
                data: null,
                errMsg: errMsg,
              });
            } else {
              // If user details fetched successfully
              return response.status(200).json({
                success: true,
                data: Activity,
                errMsg: null,
              });
            }
          }
        );
      });
      

/*
Author     : Abhijith JS
Date       : 29 August 2024
Purpose    : route for Updating activity
parameter  : updateActivityData
return type:  int
*/
    router.put("/api/organization/activity", (request, response) => {
        const {
            activityName,
            activityDescription,
            parentID,
            userID,
            activityID
          } = request.body;
            
        const updateActivityData = {
            activityName,
            activityDescription,
            parentID,
            userID,
            activityID
          };
      
        if(
            validator.isNullOrEmpty(activityName) &&
            validator.isNullOrEmpty(activityDescription) &&
            validator.isNullOrEmpty(parentID) &&
            validator.isNullOrEmpty(activityID) 
          ){
            return response.status(400).json({
              success: false,
              data: null,
              errMsg: errorMessages.ERROR_MISSINGFIELDS,
            });
          }
          if (validator.isNullOrEmpty(userID)) {
            return response.status(400).json({
              success: false,
              data: null,
              errMsg: errorMessages.ERROR_NOUSERID,
            });}
      
        activityServices.updateActivity(
          updateActivityData,
          (activityID, errMsg) => {
            //If an error occured during the update
            if (errMsg) {
              console.error(errorMessages.ERROR_UPDATINGACTIVITY, errMsg);
              return response.status(400).json({
                success: false,
                data: null,
                errMsg: errMsg,
              });
              //if activity updated
            } else {
              if (activityID) {
                return response.status(200).json({
                  success: true,
                  data: activityID,
                  errMsg: null,
                });
              } else {
                // If activity not updated
                return response.status(200).json({
                  success: false,
                  data: null,
                  errMsg: errorMessages.ERROR_NOACTIVITY_FOUND,
                });
              }
            }
          }
        );
      });


/*
Author     : Abhijith JS
Date       : 30 August 2024
Purpose    : route for Searching activity
parameter  : searchActivityData
return type: Array of data
*/
      router.post("/api/search/organization/activity", (request, response) => {
        //storing activity data from request body to variables
        const {
          activityName,
          activityDescription,
          parentID,
          activityID
        } = request.body;
        const { page, pageSize } = request.query;
      
        //storing activity data into activity's object
        const searchActivityData = {
          activityName,
          activityDescription,
          parentID,
          activityID
        };
      
        activityServices.searchActivity(
          searchActivityData,
          page,
          pageSize,
          (activityDetails, errMsg) => {
            //If an error occured during the search
            if (errMsg) {
              console.error(errorMessages.ERROR_NOUSER, errMsg);
              return response.status(500).json({
                success: false,
                data: null,
                errMsg: errMsg,
              });
              //if activity found
            } else {        
              if (activityDetails) {
                
                const totalCount = activityDetails.length > 0 ? activityDetails[0].total_count : 0;
                const count = activityDetails.length;
                const totaldata = {activityDetails, page, pageSize, totalCount, count };
      
                return response.status(200).json({
                  success: true,
                  data: totaldata,
                  errMsg: null,
                });
              } else {
                // If no activities were found
                return response.status(200).json({
                  success: false,
                  data: null,
                  errMsg: errorMessages.ERROR_NOACTIVITY_FOUND,
                });
              }
            }
          }
        );
      });


/*
Author     : Abhijith JS
Date       : 30 August 2024
Purpose    : route for Deleting activity by activityID
parameter  : activityID
return type: Boolean
*/
      router.delete("/api/organization/activity/:id", (request, response) => {
        const activityID = request.params.id;
      
        if (validator.isNullOrEmpty(activityID)) {
          return response.status(404).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_NOACTIVITY_ID,
          });
        } else {
          activityServices.deleteActivity(
            activityID,
            (success, errMsg) => {
              if (errMsg) {
                // If any error occurs while deleting
                console.error(
                  errorMessages.ERROR_FETCHING_ACTIVITYDETAILS,
                  errMsg
                );
                return response.status(400).json({
                  success: false,
                  data: null,
                  errMsg: errMsg,
                });
              } else if (success) {
                //activity deleted successfully
                return response.status(200).json({
                  success: true,
                  data: true,
                  errMsg: null,
                });
              } else {
                //No activity found
                return response.status(200).json({
                  success: false,
                  data: false,
                  errMsg: errorMessages.ERROR_NOACTIVITY_FOUND,
                });
              }
            }
          );
        }
      });




  module.exports = router;