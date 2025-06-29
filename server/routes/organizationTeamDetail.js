const express = require("express");
const router = express.Router();
const organizationTeamDetailService = require("../services/organizationTeamDetail");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");




/*
Author     : Abhijith JS
Date       : 05 November 2024
Purpose    : route for saving organization Team Detail
parameter  : saveOrganizationTeamDetailData
return type: organizationTeamDetailID int
*/
/**
 * @swagger
 * /api/organizationTeamDetail:
 *   post:
 *     tags:
 *       - : "Organization Team Detail"
 *     summary: "Create a new Organization Team Detail"
 *     description: |
 *       Creates a new organization team detail entry with the specified information.
 *       | Key                 | Value                   | Description                                      |
 *       |---------------------|-------------------------|--------------------------------------------------|
 *       | organizationTeamID  | eg., "10"               | ID of the organization team                      |
 *       | userID              | eg., "5"                | ID of the user associated with the team          |
 *       | activityDetailID    | eg., "15"               | ID of the associated activity detail             |
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
 *         description: Object containing details for the new organization team detail
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationTeamID:
 *               type: string
 *               example: "10"
 *             userID:
 *               type: string
 *               example: "5"
 *             activityDetailID:
 *               type: string
 *               example: "15"
 *     responses:
 *       201:
 *         description: Organization team detail successfully created
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
 *                   description: ID of the newly created organization team detail
 *                   example: "1002"
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Missing or invalid fields in request
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
 *                   example: "ERROR_ALLFIELDMISSING or ERROR_NOUSERID"
 */
router.post("/api/organizationTeamDetail", (request, response) => {

    //getting new organizationTeamDetail details from request body
    const { organizationTeamID, userID, activityDetailID } = request.body;

    //validating if any fields are missing data
    if (validator.isNullOrEmpty(organizationTeamID) || validator.isNullOrEmpty(activityDetailID)) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_ALLFIELDMISSING,
      });
    }
    
    // const userID = request.headers.userID;
    if (validator.isNullOrEmpty(userID)) {
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_NOUSERID,
        });
    }

    //passing organizationTeamDetail data into an object
    const saveOrganizationTeamDetailData = { organizationTeamID, userID, activityDetailID };

    organizationTeamDetailService.saveorganizationTeamDetail(
      saveOrganizationTeamDetailData,
      (organizationTeamDetailID, errMsg) => {
        if (errMsg) {
          console.error(errorMessages.ERROR_SAVINGORGANIZATION_TEAMDETAIL, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else {
          return response.status(201).json({
            success: true,
            data: organizationTeamDetailID,
            errMsg: null,
          });
        }
      }
    );
});




/*
Author     : Abhijith JS
Date       : 05 November 2024
Purpose    : route for updating organization Team Detail
parameter  : updateOrganizationTeamDetailData
return type: OrganizationTeamDetailID int
*/
/**
 * @swagger
 * /api/organizationTeamDetail/{organizationTeamDetailID}:
 *   put:
 *     tags:
 *       - : "Organization Team Detail"
 *     summary: "Update an organization team detail"
 *     description: |
 *       Updates an organization team detail with new details. Required fields:
 *       | Key                           | Value                            | Description                             |
 *       |-------------------------------|----------------------------------|-----------------------------------------|
 *       | organizationTeamID            | eg., 1 (integer)                 | ID of the organization team             |
 *       | userID                        | eg., 2 (integer)                 | ID of the user                          |
 *       | activityDetailID              | eg., 2 (integer)                 | ID of the activity detail               |
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
 *         name: organizationTeamDetailID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the organization team detail to update
 *       - in: body
 *         name: body
 *         description: Organization team detail object to be updated
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationTeamID:
 *               type: integer
 *             userID:
 *               type: integer
 *             activityDetailID:
 *               type: integer
 *             organizationTeamDetailID:
 *               type: integer
 *           example: # Sample object
 *             organizationTeamID: 1
 *             userID: 2
 *             activityDetailID: 3
 *             organizationTeamDetailID: 4
 *     responses:
 *       200:
 *         description: Successfully updated organization team detail datas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: integer
 *                   description: Updated organization team detail ID
 *                   example: 7
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Invalid input or missing fields
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
 *                   example: ERROR_UPDATING_ORGANIZATION_TEAMDETAIL or ERROR_ORGANIZATION_TEAMDETAILID_MISSING or ERROR_ALLFIELDMISSING
 */
router.put("/api/organizationTeamDetail/:organizationTeamDetailID", (request, response) => {
    
  // Getting organizationDepartmentTeam details from request body to update
  const { organizationTeamID, userID, activityDetailID } = request.body;
  // const userID = request.headers.userID;
  const organizationTeamDetailID = request.params.organizationTeamDetailID;

  // Contain the organizationDepartmentTeam details into updateOrganizationDepartmentTeamData object
  const updateOrganizationTeamDetailData = { organizationTeamID, userID, activityDetailID, organizationTeamDetailID };

  // Check if the required fields are null or empty
  if (validator.isNullOrEmpty(organizationTeamID) || validator.isNullOrEmpty(activityDetailID)) {
      return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_ALLFIELDMISSING,
      });
  } else if (validator.isNullOrEmpty(userID)) {
      return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_USERIDMISSING,
      });
  }
  if (validator.isNullOrEmpty(organizationTeamDetailID)) {
      return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_ORGANIZATION_TEAMDETAILID_MISSING,
      });
  }

  // Pass the object containing details to be updated
  organizationTeamDetailService.updateOrganizationTeamDetail(
      updateOrganizationTeamDetailData,
      (organizationTeamDetailID, errMsg) => {
          // If an error occurred during the update
          if (errMsg) {
              console.error(errorMessages.ERROR_UPDATING_ORGANIZATION_DEPARTMENT_TEAM, errMsg);
              return response.status(400).json({
                  success: false,
                  data: null,
                  errMsg: errMsg,
              });
          } else {
              if (organizationTeamDetailID) {
                  return response.status(200).json({
                      success: true,
                      data: organizationTeamDetailID,
                      errMsg: null,
                  });
              } else {
                  // If department team not updated
                  return response.status(200).json({
                      success: false,
                      data: null,
                      errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_TEAMDETAIL,
                  });
              }
          }
      }
  );
});



/*
Author     : Abhijith JS
Date       : 05 November 2024
Purpose    : route for delete organization TeamDetail.
parameter  : organizationTeamDetailID
return type: Boolean
*/
/**
 * @swagger
 * /api/organizationTeamDetail/{organizationTeamDetailID}:
 *   delete:
 *     tags:
 *       - : "Organization Team Detail"
 *     summary: "Delete an Organization Team Detail"
 *     description: Deletes an organization team detail by its ID.
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
 *         name: organizationTeamDetailID
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the organization team detail to delete
 *     responses:
 *       200:
 *         description: Organization team detail successfully deleted or not found
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
 *                   description: Indicates if the team detail was deleted
 *                   example: true
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Error occurred while deleting the organization team detail
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
 *                   example: "ERROR_DELETING_ORGANIZATION_TEAMDETAIL"
 *       404:
 *         description: Organization team detail ID is missing
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
 *                   example: "ERROR_ORGANIZATION_TEAMDETAILID_MISSING"
 */
router.delete("/api/organizationTeamDetail/:organizationTeamDetailID", (request, response) => {
  const organizationTeamDetailID = request.params.organizationTeamDetailID;
// check if organizationTeamDetailID is missing
  if (validator.isNullOrEmpty(organizationTeamDetailID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ORGANIZATION_TEAMDETAILID_MISSING,
    });
  } else {
    organizationTeamDetailService.deleteOrganizationTeamDetail(
      organizationTeamDetailID,
      (success, errMsg) => {
        if (errMsg) {
          // If any error occurs while deleting organization TeamDetailID
          console.error(
            errorMessages.ERROR_DELETING_ORGANIZATION_TEAMDETAIL,
            errMsg
          );
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else if (success) {
          // organization TeamDetail deleted successfully
          return response.status(200).json({
            success: true,
            data: true,
            errMsg: null,
          });
        } else {
          // No organization TeamDetailID found
          return response.status(200).json({
            success: false,
            data: false,
            errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_TEAMDETAIL,
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
     * /api/search/organizationTeamDetail:
     *   post:
     *     tags:
     *       - : "Organization Team Detail"
     *     summary: "Search Organization Team Detail"
     *     description: |
     *       To search Organization Team Detail data
     *       Organization Team Detail data:
     *       | Key                         | Value                                  | Description                            |
     *       |-----------------------------|----------------------------------------|----------------------------------------|
     *       | organizationTeamDetailID    | eg., "10" (number)                     | ID   of the organization Team Detail   |
     *       | activityName                | eg., "Test" (string)                   | activityName                           |
     *       | teamName                    | eg., "Team Test" (string)              | teamName                               |
     *       | firstName                   | eg., "Michael" (string)                | firstName                              |
     *       | lastName                    | eg., "Michael" (string)                | lastName                               | 
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
     *         description: Organization object
     *         required: true
     *         schema:
     *            type: object
     *            properties:
     *               organizationTeamDetailID:
     *                  type: string 
     *               activityName:
     *                  type: string 
     *               teamName:
     *                  type: string 
     *               firstName:
     *                  type: string 
     *               lastName:
     *                  type: string 
     *            example: # Sample object
     *               organizationTeamDetailID: "1"
     *               activityName: "Test"
     *               teamName: "Test Team"
     *               firstName: "Michael"
     *               lastName: "Michael"
     *     responses:
     *       200:
     *         description: Successfully get organization team detail datas
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
     *                   description: Oreganization Team detail response data
     *                 errMsg:
     *                   type: string
     *                   example: null or ERROR_NO_ORGANIZATION_TEAM_DETAIL_FOUND
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

router.post("/api/search/organizationTeamDetail", (request, response) => {
  //storing organization data from request body to variables
  const {
    organizationTeamDetailID, activityName, teamName, firstName, lastName
  } = request.body;
  const { page, pageSize } = request.query;

  //storing organization data into organization's object
  const searchOrganizationTeamDetailData = {
    organizationTeamDetailID, activityName, teamName, firstName, lastName
  };

  organizationTeamDetailService.searchOrganizationTeamDetail(
    searchOrganizationTeamDetailData,
    page,
    pageSize,
    (organizationTeamDetails, errMsg) => {
      //If an error occured during the search
      if (errMsg) {
        return response.status(500).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
        //if organization found
      } else {
        if (organizationTeamDetails) {

          const totalCount = organizationTeamDetails.length > 0 ? organizationTeamDetails[0].total_count : 0;
          const count = organizationTeamDetails.length;
          const totaldata = { organizationTeamDetails, page, pageSize, totalCount, count };

          return response.status(200).json({
            success: true,
            data: totaldata,
            errMsg: null,
          });
        } else {
          // If no organizations were found
          return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_NO_ORGANIZATION_TEAM_DETAIL_FOUND,
          });
        }
      }
    }
  );
});

/*
Author     : Varun H M 
Date       : 05 November 2024
Purpose    : route for fetching organization Team detail by id
parameter  : organizationTeamDetailData
return type: OrganizationTeamDetailID int
*/
/**
 * @swagger
 * /api/organizationTeamDetail/{organizationTeamDetailID}:
 *   get:
 *     tags:
 *       - : "Organization Team Detail"
 *     summary: "Get organization team detail datas by ID"
 *     description: Retrieve details of a specific organization team detail using its ID.
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
 *         name: organizationTeamDetailID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the organization team detail to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved organization team detail datas
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
 *                   description: Organization team detail data object
 *                   properties:
 *                     organizationID:
 *                       type: integer
 *                       example: 1
 *                     teamName:
 *                       type: string
 *                       example: "Team Alpha"
 *                     categoryID:
 *                       type: integer
 *                       example: 3
 *                     description:
 *                       type: string
 *                       example: "Finance team"
 *                     createdDate:
 *                       type: string
 *                       example: "2024-01-01T12:00:00Z"
 *                     updatedDate:
 *                       type: string
 *                       example: "2024-01-02T15:30:00Z"
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Missing organization team detail ID
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
 *                   example: ERROR_ORGANIZATION_TEAMDETAILID_MISSING
 *       404:
 *         description: Organization team detail not found
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
 *                   example: ERROR_FETCHING_ORGANIZATION_TEAMDETAIL
 */
router.get("/api/organizationTeamDetail/:organizationTeamDetailID", (request, response) => {

  const organizationTeamDetailID = request.params.organizationTeamDetailID;

  if (validator.isNullOrEmpty(organizationTeamDetailID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ORGANIZATION_TEAMDETAILID_MISSING,
    });
  }
  organizationTeamDetailService.getOrganizationTeamDetailByID(
    organizationTeamDetailID,
    (organizationTeamDetailData, errMsg) => {
      if (errMsg) {
        // If any error occurs while finding organizationDepartmentTeam
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_TEAMDETAIL, errMsg);
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If organizationDepartmentTeam details fetched successfully
        return response.status(200).json({
          success: true,
          data: organizationTeamDetailData,
          errMsg: null,
        });
      }
    }
  );
});


module.exports = router;