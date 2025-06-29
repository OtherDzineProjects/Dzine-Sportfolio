const express = require("express");
const router = express.Router();
const organizationTeamService = require("../services/organizationTeam");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");



/*
Author     : Abhijith JS
Date       : 30 October 2024
Purpose    : route for saving organization Team
parameter  : organizationTeamData
return type: OrganizationTeamID int
*/
/**
 * @swagger
 * /api/organizationTeam:
 *   post:
 *     tags:
 *       - : "Organization Team"
 *     summary: Create a new organization team
 *     description: |
 *       Creates a new Organization Team.
 *       Required fields:
 *       | Key            | Value                        | Description                      |
 *       |----------------|------------------------------|----------------------------------|
 *       | organizationID | eg., 1 (integer)             | ID of the organization           |
 *       | activityID     | eg., 2 (integer)             | ID of the activity               |
 *       | teamName       | eg., "Team Alpha" (string)   | Name of the team                 |
 *       | teamCategoryID | eg., 3 (integer)             | Category ID of the team          |
 *       | description    | eg., "Finance team" (string) | Description of the team          |
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
 *         description: Organization team object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationID:
 *               type: integer
 *             activityID:
 *               type: integer
 *             teamName:
 *               type: string
 *             teamCategoryID:
 *               type: integer
 *             description:
 *               type: string
 *           example: # Sample object
 *             organizationID: 1
 *             activityID: 2
 *             teamName: "Team Alpha"
 *             teamCategoryID: 3
 *             description: "Finance team"
 *     responses:
 *       201:
 *         description: Successfully created organization team
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
 *                   description: Created organization team ID
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
 *                   example: ERROR_ALLFIELDMISSING or ERROR_NOUSERID
 */
router.post("/api/organizationTeam", (request, response) => {

    //getting new organizationTeam details from request body
    const { organizationID, activityID, teamName, teamCategoryID, description } = request.body;
  
    //validating if any fields are missing data
    if (validator.isNullOrEmpty(organizationID) || validator.isNullOrEmpty(teamName) || validator.isNullOrEmpty(teamCategoryID) || validator.isNullOrEmpty(description)
         || validator.isNullOrEmpty(activityID)) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_ALLFIELDMISSING,
      });
    }
    const userID = request.headers.userID;
    if (validator.isNullOrEmpty(userID)) {
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_NOUSERID,
        });}
  
    //passing organizationTeam data into an object
    const organizationTeamData = { organizationID, activityID, teamName, teamCategoryID, description, userID };

    organizationTeamService.saveOrganizationTeam(
        organizationTeamData,
      (organizationTeamID, errMsg) => {
        if (errMsg) {
          console.error(errorMessages.ERROR_SAVINGORGANIZATION_TEAM, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else {
          return response.status(201).json({
            success: true,
            data: organizationTeamID,
            errMsg: null,
          });
        }
      }
    );
  });




/*
Author     : Abhijith JS
Date       : 30 October 2024
Purpose    : route for updating organization Team
parameter  : updateOrganizationTeamData
return type: OrganizationTeamID int
*/
/**
 * @swagger
 * /api/organizationTeam/{organizationTeamID}:
 *   put:
 *     tags:
 *       - : "Organization Team"
 *     summary: "Update an organization team"
 *     description: |
 *       Updates an organization team with new details. Required fields:
 *       | Key                | Value                            | Description                       |
 *       |--------------------|----------------------------------|-----------------------------------|
 *       | organizationID     | eg., 1 (integer)                 | ID of the organization            |
 *       | activityID         | eg., 2 (integer)                 | ID of the related activity        |
 *       | teamName           | eg., "Team Alpha" (string)       | Name of the team                  |
 *       | teamCategoryID     | eg., 3 (integer)                 | Category ID of the team           |
 *       | description        | eg., "Finance team" (string)     | Description of the team           |
 *       | organizationTeamID | eg., "7" (integer)               | ID of the team to be updated      |
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
 *         name: organizationTeamID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the organization team to update
 *       - in: body
 *         name: body
 *         description: Organization team object to be updated
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationID:
 *               type: integer
 *             activityID:
 *               type: integer
 *             teamName:
 *               type: string
 *             teamCategoryID:
 *               type: integer
 *             description:
 *               type: string
 *           example: # Sample object
 *             organizationID: 1
 *             activityID: 2
 *             teamName: "Team Alpha"
 *             teamCategoryID: 3
 *             description: "Finance team"
 *     responses:
 *       200:
 *         description: Successfully updated organization team details
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
 *                   description: Updated organization team ID
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
 *                   example: ERROR_ALLFIELDMISSING or ERROR_USERIDMISSING or ERROR_ORGANIZATION_TEAMID_MISSING
 */
router.put("/api/organizationTeam/:organizationTeamID", (request, response) => {

//getting organizationTeam details from request body to update
const { organizationID, activityID, teamName, teamCategoryID, description } = request.body;
const userID = request.headers.userID;
const organizationTeamID = request.params.organizationTeamID;

// contain the organizationTeam details into updateOrganizationTeamData object
const updateOrganizationTeamData = { organizationID, activityID, teamName, teamCategoryID, description, userID, organizationTeamID };

//Check if the required fields are null or empty
if (validator.isNullOrEmpty(organizationID) && validator.isNullOrEmpty(activityID) && validator.isNullOrEmpty(teamName) && validator.isNullOrEmpty(teamCategoryID)
     && validator.isNullOrEmpty(description)) {
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
if (validator.isNullOrEmpty(organizationTeamID)) {
    return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_ORGANIZATION_TEAMID_MISSING,
    });
    }
//pass the object containing details to be updated
organizationTeamService.updateOrganizationTeam(
    updateOrganizationTeamData,
    (updateorganizationTeamID, errMsg) => {
    // If an error occurred during the update
    if (errMsg) {
        console.error(errorMessages.ERROR_UPDATING_ORGANIZATION_TEAM, errMsg);
        return response.status(400).json({
        success: false,
        data: null,
        errMsg: errMsg,
        });
    } else {
        if (updateorganizationTeamID) {
        return response.status(200).json({
            success: true,
            data: updateorganizationTeamID,
            errMsg: null,
        });
        } else {
        // If department not updated
        return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_TEAM_DETAILS,
        });
        }
    }
    }
);
});

  


/*
Author     : Abhijith JS
Date       : 30 October 2024
Purpose    : route for fetching organization Team by id
parameter  : organizationTeamData
return type: OrganizationTeamID int
*/
/**
 * @swagger
 * /api/organizationTeam/{organizationTeamID}:
 *   get:
 *     tags:
 *       - : "Organization Team"
 *     summary: "Get organization team details by ID"
 *     description: Retrieve details of a specific organization team using its ID.
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
 *         name: organizationTeamID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the organization team to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved organization team details
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
 *                   description: Organization team data object
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
 *         description: Missing organization team ID
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
 *                   example: ERROR_ORGANIZATION_TEAMID_MISSING
 *       404:
 *         description: Organization team not found
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
 *                   example: ERROR_FETCHING_ORGANIZATION_TEAM_DETAILS
 */
router.get("/api/organizationTeam/:organizationTeamID", (request, response) => {

    const organizationTeamID = request.params.organizationTeamID;
    
    if (validator.isNullOrEmpty(organizationTeamID)) {
        return response.status(400).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_ORGANIZATION_TEAMID_MISSING,
        });
        }
        organizationTeamService.getOrganizationTeamByID(
        organizationTeamID,
      (organizationTeamData, errMsg) => {
        if (errMsg) {
          // If any error occurs while finding organizationTeam
          console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_TEAM_DETAILS, errMsg);
          return response.status(404).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else {
          // If organizationTeam details fetched successfully
          return response.status(200).json({
            success: true,
            data: organizationTeamData,
            errMsg: null,
          });
        }
      }
    );
  });



/*
Author     : Abhijith JS
Date       : 01 November 2024
Purpose    : Function for searching organization teams
parameter  : searchOrganizationTeamData
return type: Array of organizationTeamDetails
*/
/**
 * @swagger
 * /api/search/organizationTeam:
 *   post:
 *     tags:
 *       - : "Organization Team"
 *     summary: "Search for organization teams"
 *     description: Searches for organization teams by name and pagination options.
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
 *         description: Criteria for searching organization teams
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationName:
 *               type: string
 *               description: Name of the organization
 *               example: "Tech Corp"
 *             teamName:
 *               type: string
 *               description: Name of the team
 *               example: "Development Team"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page for pagination
 *     responses:
 *       200:
 *         description: Successfully retrieved organization team details
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
 *                   properties:
 *                     organizationTeamDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           organizationTeamID:
 *                             type: integer
 *                             example: 1
 *                           organizationName:
 *                             type: string
 *                             example: "Tech Corp"
 *                           teamName:
 *                             type: string
 *                             example: "Development Team"
 *                           teamCategoryID:
 *                             type: integer
 *                             example: 3
 *                           description:
 *                             type: string
 *                             example: "Handles software development"
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     totalCount:
 *                       type: integer
 *                       example: 50
 *                     count:
 *                       type: integer
 *                       example: 10
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Server error or failed to fetch organization team details
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
 *                   example: ERROR_FETCHING_ORGANIZATION_TEAM_DETAILS
 */
router.post("/api/search/organizationTeam", (request, response) => {
  //storing organizationTeam data from request body to variables
  const { organizationName,teamName} = request.body;
  const { page, pageSize } = request.query;

  //storing organizationTeam data into organizationTeam's object
    const searchOrganizationTeamData = { organizationName,teamName};

    organizationTeamService.searchorganizationTeam(
    searchOrganizationTeamData,
    page,
    pageSize,
    (organizationTeamDetails, errMsg) => {
      //If an error occured during the search
      if (errMsg) {
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_TEAM_DETAILS, errMsg);
        return response.status(500).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
        //if organizationTeams found
      } else {        
        if (organizationTeamDetails) {

          const totalCount = organizationTeamDetails.length > 0 ? organizationTeamDetails[0].total_count : 0;
          const count = organizationTeamDetails.length;
          const totaldata = {organizationTeamDetails, page, pageSize, totalCount, count };

          return response.status(200).json({
            success: true,
            data: totaldata,
            errMsg: null,
          });
        } else {
          // If no organizationTeams were found
          return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_TEAM_DETAILS,
          });
        }
      }
    }
  );
});




/*
Author     : Abhijith JS
Date       : 01 November 2024
Purpose    : route for delete organization team.
parameter  : organizationTeamID
return type: Boolean
*/
/**
 * @swagger
 * /api/organizationTeam/{organizationTeamID}:
 *   delete:
 *     tags:
 *       - : "Organization Team"
 *     summary: "Delete an Organization Team"
 *     description: |
 *       Deletes an organization team by its ID.
 *       | Key                | Value                       | Description                                   |
 *       |--------------------|-----------------------------|-----------------------------------------------|
 *       | organizationTeamID | eg., "2" (ID)               | ID to match and delete organization team      |
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
 *         name: organizationTeamID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the Organization Team to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the organization team or team not found
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
 *                   description: True if the team was deleted, false if it was not found
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Error during deletion
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
 *                   example: "Error occurred while deleting the organization team"
 *       404:
 *         description: OrganizationTeamID not provided or invalid
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
 *                   example: "ERROR_NOORGANIZATION_TEAM_ID"
 */
router.delete("/api/organizationTeam/:organizationTeamID", (request, response) => {
  const organizationTeamID = request.params.organizationTeamID;
// check if organizationTeamID is missing
  if (validator.isNullOrEmpty(organizationTeamID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOORGANIZATION_DEPARTMENT_ID,
    });
  } else {
    organizationTeamService.deleteOrganizationTeam(
      organizationTeamID,
      (success, errMsg) => {
        if (errMsg) {
          // If any error occurs while deleting
          console.error(
            errorMessages.ERROR_DELETING_ORGANIZATION_TEAM,
            errMsg
          );
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else if (success) {
          // Department deleted successfully
          return response.status(200).json({
            success: true,
            data: true,
            errMsg: null,
          });
        } else {
          // No department found
          return response.status(200).json({
            success: false,
            data: false,
            errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_TEAM_DETAILS,
          });
        }
      }
    );
  }
});





  module.exports = router;