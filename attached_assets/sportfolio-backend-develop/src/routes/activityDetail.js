const express = require('express');
const router = express.Router();
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const activityDetailService = require("../services/activityDetail");


/*
Author     : Abhijith JS
Date       : 06 November 2024
Purpose    : route for saving activityDetail Data
parameter  : activityDetailData
return type: int
*/
/**
 * @swagger
 * /api/ActivityDetail:
 *   post:
 *     tags:
 *       - : "Activity Detail"
 *     summary: Add a new activity detail
 *     description: Endpoint to add details for an activity. Requires activity details and a user ID in the headers.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authorization
 *       - in: body
 *         name: body
 *         description: Activity detail object
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             activityID:
 *               type: string
 *               example: "12345"
 *               description: Unique identifier for the activity
 *             name:
 *               type: string
 *               example: "Project Meeting"
 *               description: Name of the activity
 *             parentID:
 *               type: string
 *               example: ""
 *               description: Parent activity ID if applicable
 *             description:
 *               type: string
 *               example: "Quarterly project meeting for discussing progress and issues."
 *               description: Brief description of the activity
 *           required:
 *             - activityID
 *             - name
 *             - parentID
 *             - description
 *     responses:
 *       201:
 *         description: Activity detail created successfully or already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: "abcd1234"
 *                   description: Unique ID of the newly created or existing activity detail
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Missing required fields or user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: string
 *                   example: null
 *                 errMsg:
 *                   type: string
 *                   example: "ERROR_MISSINGFIELDS"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: string
 *                   example: null
 *                 errMsg:
 *                   type: string
 *                   example: "ERROR_INTERNAL_SERVER_ERROR"
 */
router.post("/api/ActivityDetail", (request, response) => {
    const {
        activityID,
        name,
        parentID,
        description
      } = request.body;
      //validating if any fields are missing data
      if (
        validator.isNullOrEmpty(activityID) &&
        validator.isNullOrEmpty(name) &&
        validator.isNullOrEmpty(parentID) &&
        validator.isNullOrEmpty(description)
      ){
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_MISSINGFIELDS,
        });
      }
      const userID = request.headers.userID;

      if (validator.isNullOrEmpty(userID)) {
        return response.status(400).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_USERIDMISSING,
        });
    }
    
      //passing activityDetail data into an object
      const activityDetailData = {
        activityID,
        name,
        parentID,
        description,
        userID,
      };
    
      activityDetailService.saveActivityDetail(
        activityDetailData,
        (activityDetailID, errMsg) => {
          if (errMsg) {
            console.error(errorMessages.ERROR_SAVINGACTIVITY_DETAIL, errMsg);
            return response.status(400).json({
              success: false,
              data: null,
              errMsg: errMsg,
            });
          } else if(validator.isNullOrEmpty(activityDetailID)){
                return response.status(201).json({
                    success: true,
                    data: null,
                    errMsg: errorMessages.ERROR_ACTIVITYDETAIL_EXISTS,
                });
          }
          else{
            return response.status(201).json({
              success: true,
              data: activityDetailID,
              errMsg: null,
            });
          }
        }
      );
    });


/*
Author     : Varun H M 
Date       : 07 November 2024
Purpose    : route for fetching activity detail by id
parameter  : activityDetailID
return type: activityDetail Datas
*/
/**
 * @swagger
 * /api/activityDetail/{activityDetailID}:
 *   get:
 *     tags:
 *       - : "Activity Detail"
 *     summary: "Get activity detail datas by ID"
 *     description: Retrieve details of a specific activity detail using its ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authorization
 *       - in: path
 *         name: activityDetailID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the activity detail to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved activity detail datas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Activity detail data object
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Missing activity detail ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: null
 *                   example: null
 *                 errMsg:
 *                   type: string
 *                   example: ERROR_ERROR_ACTIVITYDETAILID_MISSING
 *       404:
 *         description: Activity detail not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: null
 *                   example: null
 *                 errMsg:
 *                   type: string
 *                   example: ERROR_FETCHING_ACTIVITYDETAIL
 */
router.get("/api/activityDetail/:activityDetailID", (request, response) => {

  const activityDetailID = request.params.activityDetailID;

  if (validator.isNullOrEmpty(activityDetailID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ACTIVITYDETAILID_MISSING,
    });
  }
  activityDetailService.getActivityDetailByID(
    activityDetailID,
    (activityDetailData, errMsg) => {
      if (errMsg) {
        // If any error occurs while finding organizationDepartmentTeam
        console.error(errorMessages.ERROR_FETCHING_ACTIVITYDETAIL, errMsg);
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If organizationDepartmentTeam details fetched successfully
        return response.status(200).json({
          success: true,
          data: activityDetailData,
          errMsg: null,
        });
      }
    }
  );
});

/*
Author     : Varun H M
Date       : 07 November 2024
Purpose    : route for delete activity Detail.
parameter  : activityDetailID
return type: Boolean
*/
/**
 * @swagger
 * /api/activityDetail/{activityDetailID}:
 *   delete:
 *     tags:
 *       - : "Activity Detail"
 *     summary: "Delete an activity Detail"
 *     description: Deletes an activity detail by its ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authorization
 *       - in: path
 *         name: activityDetailID
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the activity detail to delete
 *     responses:
 *       200:
 *         description: Activity detail successfully deleted or not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: boolean
 *                   description: Indicates if the activity detail was deleted
 *                   example: true
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Error occurred while deleting the activity detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   example: null
 *                 errMsg:
 *                   type: string
 *                   example: "ERROR_DELETING_ACTIVITYDETAIL"
 *       404:
 *         description: Activity detail ID is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   example: null
 *                 errMsg:
 *                   type: string
 *                   example: "ERROR_ACTIVITYDETAILID_MISSING"
 */
router.delete("/api/activityDetail/:activityDetailId", (request, response) => {
  const activityDetailId = request.params.activityDetailId;
// check if activityDetailId is missing
  if (validator.isNullOrEmpty(activityDetailId)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ACTIVITYDETAILID_MISSING,
    });
  } else {
    activityDetailService.deleteActivityDetail(
      activityDetailId,
      (success, errMsg) => {
        if (errMsg) {
          // If any error occurs while deleting organization TeamDetailID
          console.error(
            errorMessages.ERROR_DELETING_ACTIVITYDETAIL,
            errMsg
          );
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else if (success) {
          // activity Detail deleted successfully
          return response.status(200).json({
            success: true,
            data: true,
            errMsg: null,
          });
        } else {
          // No activity detail found
          return response.status(200).json({
            success: false,
            data: false,
            errMsg: errorMessages.ERROR_FETCHING_ACTIVITYDETAIL,
          });
        }
      }
    );
  }
});


/*
Author     : VARUN H M
Date       : 05 November 2024
Purpose    : route for search organizations team detail.
parameter  : searchOrganizationTeamDetailDatas
return type: array organizationTeamDetails
*/
/**
     * @swagger
     * /api/search/activityDetail:
     *   post:
     *     tags:
     *       - : "Activity Detail"
     *     summary: "Search Activity Detail"
     *     description: |
     *       To search Activity Detail data
     *       Organization data:
     *       | Key                         | Value                                  | Description                            |
     *       |-----------------------------|----------------------------------------|----------------------------------------|
     *       | activityDetailID            | eg., 10 (integer)                      | fetch by activityDetailID              |
     *       | activityID                  | eg., 10 (integer)                      | fetch by activityID                    |
     *       | name                        | eg., "Team Test" (string)              | fetch by name                          |
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         schema:
     *            type: string
     *         required: true
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           example: 1
     *         description: Page number for pagination
     *         required: false
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: integer
     *           example: 10
     *         description: Number of departments per page
     *         required: false
     *       - in: body
     *         name: body
     *         description: Activity detail object
     *         required: true
     *         schema:
     *            type: object
     *            properties:
     *               activityDetailID:
     *                  type: integer 
     *               activityID:
     *                  type: integer 
     *               name:
     *                  type: string 
     *            example: # Sample object
     *               activityDetailID: 1
     *               activityID: 1
     *               name: "Test Team"
     *     responses:
     *       200:
     *         description: Successfully get activity detail datas
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: object
     *                   description: Activity detail response data
     *                 errMsg:
     *                   type: string
     *                   example: null or ERROR_FETCHING_ACTIVITYDETAIL
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 data:
     *                   type: object
     *                   example: null
     *                 errMsg:
     *                   type: string
     *                   example: ERROR_INTERNAL_SERVER_ERROR
 */

router.post("/api/search/activityDetail", (request, response) => {
  //storing organization data from request body to variables
 
  const { activityDetailID, activityID, name } = request.body;
  const { page, pageSize } = request.query;

  //storing organization data into organization's object
  const searchActivityDetailData = { activityDetailID, activityID, name };

  activityDetailService.searchActivityDetail(
    searchActivityDetailData,
    page,
    pageSize,
    (activityDetails, errMsg) => {
      //If an error occured during the search
      if (errMsg) {
        return response.status(500).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
        //if organization found
      } else {
        if (activityDetails) {

          const totalCount = activityDetails.length > 0 ? activityDetails[0].total_count : 0;
          const count = activityDetails.length;
          const totaldata = { activityDetails, page, pageSize, totalCount, count };

          return response.status(200).json({
            success: true,
            data: totaldata,
            errMsg: null,
          });
        } else {
          // If no activity details were found
          return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_FETCHING_ACTIVITYDETAIL,
          });
        }
      }
    }
  );
});

/*
Author     : Abhijith JS
Date       : 07 November 2024
Purpose    : route for updating activityDetail Data
parameter  : updateActivityDetailData
return type: int
*/
/**
 * @swagger
 * /api/ActivityDetail:
 *   put:
 *     tags:
 *       -  : "Activity Detail"
 *     summary: Update an existing activity detail
 *     description: Endpoint to update details for an existing activity. Requires activity details and user ID in headers.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authorization
 *       - in: body
 *         name: body
 *         description: Activity detail object to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             activityID:
 *               type: string
 *               example: "12345"
 *               description: Unique identifier for the activity
 *             name:
 *               type: string
 *               example: "Updated Project Meeting"
 *               description: Name of the activity
 *             parentID:
 *               type: string
 *               example: "67890"
 *               description: Parent activity ID if applicable
 *             description:
 *               type: string
 *               example: "Updated description for the project meeting."
 *               description: Brief description of the activity
 *             activityDetailID:
 *               type: string
 *               example: "abcd1234"
 *               description: Unique identifier of the activity detail to update
 *           required:
 *             - activityID
 *             - name
 *             - parentID
 *             - description
 *             - activityDetailID
 *     responses:
 *       200:
 *         description: Successfully updated activity detail or returned an error message if not updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: "abcd1234"
 *                   description: Unique ID of the updated activity detail
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Missing required fields or user ID, or error during update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: string
 *                   example: null
 *                 errMsg:
 *                   type: string
 *                   example: "ERROR_MISSINGFIELDS"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: string
 *                   example: null
 *                 errMsg:
 *                   type: string
 *                   example: "ERROR_INTERNAL_SERVER_ERROR"
 */
router.put("/api/ActivityDetail", (request, response) => {
    const {
      activityID,
      name,
      parentID,
      description,
      activityDetailID
    } = request.body;

    const userID = request.headers.userID;
        
    const updateActivityDetailData = {
      activityID,
      name,
      parentID,
      description,
      userID,
      activityDetailID
    };

  if(
      validator.isNullOrEmpty(activityID) &&
      validator.isNullOrEmpty(name) &&
      validator.isNullOrEmpty(parentID) &&
      validator.isNullOrEmpty(description) &&
      validator.isNullOrEmpty(activityDetailID)  
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

    activityDetailService.updateActivityDetail(
    updateActivityDetailData,
    (activityDetailID, errMsg) => {
      //If an error occured during the update
      if (errMsg) {
        console.error(errorMessages.ERROR_UPDATING_ACTIVITYDETAIL, errMsg);
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
        //if activity updated
      } else {
        if (activityDetailID) {
          return response.status(200).json({
            success: true,
            data: activityDetailID,
            errMsg: null,
          });
        } else {
          // If activity not updated
          return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_FETCHING_ACTIVITYDETAIL,
          });
        }
      }
    }
  );
});





    
module.exports = router;