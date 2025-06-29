const express = require("express");
const router = express.Router();
const organizationDepartmentTeamService = require("../services/organizationDepartmentTeam");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");




/*
Author     : Abhijith JS
Date       : 01 November 2024
Purpose    : route for saving organization Department Team
parameter  : organizationDepartmentTeamData
return type: organizationDepartmentTeamID int
*/
/**
 * @swagger
 * /api/organizationDepartmentTeam:
 *   post:
 *     tags:
 *       - : "Organization Department Team"
 *     summary: "Create a new Organization Department Team"
 *     description: |
 *       Creates a new organization department team with the specified details.
 *       | Key               | Value                  | Description                                      |
 *       |-------------------|------------------------|--------------------------------------------------|
 *       | organizationID    | eg., "1"               | ID of the organization                           |
 *       | activityID        | eg., "2"               | ID of the associated activity                    |
 *       | teamName          | eg., "Team Alpha"      | Name of the team                                 |
 *       | teamCategoryID    | eg., "3"               | Category ID of the team                          |
 *       | description       | eg., "Description here"| Brief description of the team                    |
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
 *         description: Object containing details for the new organization department team
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationID:
 *               type: string
 *               example: "1"
 *             activityID:
 *               type: string
 *               example: "2"
 *             teamName:
 *               type: string
 *               example: "Team Alpha"
 *             teamCategoryID:
 *               type: string
 *               example: "3"
 *             description:
 *               type: string
 *               example: "Description of the organization team"
 *     responses:
 *       201:
 *         description: Organization department team successfully created
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
 *                   description: ID of the newly created organization department team
 *                   example: "1001"
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
router.post("/api/organizationDepartmentTeam", (request, response) => {

    //getting new organizationDepartmentTeam details from request body
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
        });
    }

    //passing organizationDepartmentTeam data into an object
    const organizationDepartmentTeamData = { organizationID, activityID, teamName, teamCategoryID, description, userID };

    organizationDepartmentTeamService.saveOrganizationDepartmentTeam(
        organizationDepartmentTeamData,
      (organizationDepartmentTeamID, errMsg) => {
        if (errMsg) {
          console.error(errorMessages.ERROR_SAVINGORGANIZATION_DEPARTMENT_TEAM, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else {
          return response.status(201).json({
            success: true,
            data: organizationDepartmentTeamID,
            errMsg: null,
          });
        }
      }
    );
});

/*
Author     : Varun H M 
Date       : 04 November 2024
Purpose    : route for fetching organization department Team by id
parameter  : organizationDepartmentTeamData
return type: OrganizationDepartmentTeamID int
*/
/**
 * @swagger
 * /api/organizationDepartmentTeam/{organizationDepartmentTeamID}:
 *   get:
 *     tags:
 *       - : "Organization Department Team"
 *     summary: "Get organization department team details by ID"
 *     description: Retrieve details of a specific organization department team using its ID.
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
 *         name: organizationDepartmentTeamID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the organization department team to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved organization department team details
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
 *                   description: Organization department team data object
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
 *         description: Missing organization department team ID
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
 *                   example: ERROR_ORGANIZATION_DEPARTMENT_TEAMID_MISSING
 *       404:
 *         description: Organization department team not found
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
 *                   example: ERROR_FETCHING_ORGANIZATION_DEPARTMENT_TEAM_DETAILS
 */
router.get("/api/organizationDepartmentTeam/:organizationDepartmentTeamID", (request, response) => {

  const organizationDepartmentTeamID = request.params.organizationDepartmentTeamID;
  
  if (validator.isNullOrEmpty(organizationDepartmentTeamID)) {
      return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_ORGANIZATION_DEPARTMENT_TEAMID_MISSING,
      });
      }
      organizationDepartmentTeamService.getOrganizationDepartmentTeamByID(
        organizationDepartmentTeamID,
    (organizationDepartmentTeamData, errMsg) => {
      if (errMsg) {
        // If any error occurs while finding organizationDepartmentTeam
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_TEAM_DETAILS, errMsg);
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If organizationDepartmentTeam details fetched successfully
        return response.status(200).json({
          success: true,
          data: organizationDepartmentTeamData,
          errMsg: null,
        });
      }
    }
  );
});


/*
Author     : Varun H M
Date       : 04 November 2024
Purpose    : route for delete organization department team.
parameter  : organizationDepartmentTeamID
return type: Boolean
*/
/**
 * @swagger
 * /api/organizationDepartmentTeam/{organizationDepartmentTeamID}:
 *   delete:
 *     tags:
 *       - : "Organization Department Team"
 *     summary: "Delete an Organization Team"
 *     description: |
 *       Deletes an organization department team by its ID.
 *       | Key                          | Value                       | Description                                   |
 *       |------------------------------|-----------------------------|-----------------------------------------------|
 *       | organizationDepartmentTeamID | eg., "2" (ID)               | ID to match and delete organization team      |
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
 *         name: organizationDepartmentTeamID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the Organization Department Team to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the organization department team or team not found
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
 *                   example: "Error occurred while deleting the organization department team"
 *       404:
 *         description: OrganizationDepartmentTeamID not provided or invalid
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
 *                   example: "ERROR_NOORGANIZATION_DEPARTMENT_TEAM_ID"
 */
router.delete("/api/organizationDepartmentTeam/:organizationDepartmentTeamID", (request, response) => {
  const organizationDepartmentTeamID = request.params.organizationDepartmentTeamID;
// check if organizationDepartmentTeamID is missing
  if (validator.isNullOrEmpty(organizationDepartmentTeamID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOORGANIZATION_DEPARTMENT_TEAM_ID,
    });
  } else {
    organizationDepartmentTeamService.deleteOrganizationDepartmentTeam(
      organizationDepartmentTeamID,
      (success, errMsg) => {
        if (errMsg) {
          // If any error occurs while deleting
          console.error(
            errorMessages.ERROR_DELETING_ORGANIZATION_DEPARTMENT_TEAM,
            errMsg
          );
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else if (success) {
          //Organization Department team deleted successfully
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
            errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_TEAM_DETAILS,
          });
        }
      }
    );
  }
});





/*
Author     : Abhijith JS
Date       : 04 November 2024
Purpose    : route for updating organization Team
parameter  : updateOrganizationDepartmentTeamData
return type: OrganizationDepartmentTeamID int
*/
/**
 * @swagger
 * /api/organizationDepartmentTeam/{organizationDepartmentTeamID}:
 *   put:
 *     tags:
 *       - : "Organization Department Team"
 *     summary: "Update an organization department team"
 *     description: |
 *       Updates an organization department team with new details. Required fields:
 *       | Key                           | Value                            | Description                             |
 *       |-------------------------------|----------------------------------|-----------------------------------------|
 *       | organizationID                | eg., 1 (integer)                 | ID of the organization                  |
 *       | activityID                    | eg., 2 (integer)                 | ID of the related activity              |
 *       | teamName                      | eg., "Team Alpha" (string)       | Name of the team                        |
 *       | teamCategoryID                | eg., 3 (integer)                 | Category ID of the team                 |
 *       | description                   | eg., "Finance team" (string)     | Description of the team                 |
 *       | organizationDepartmentTeamID  | eg., "7" (integer)               | ID of the department team to be updated |
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
 *         name: organizationDepartmentTeamID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the organization department team to update
 *       - in: body
 *         name: body
 *         description: Organization department team object to be updated
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
 *         description: Successfully updated organization department team details
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
 *                   description: Updated organization department team ID
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
 *                   example: ERROR_ALLFIELDMISSING or ERROR_USERIDMISSING or ERROR_ORGANIZATION_DEPARTMENT_TEAMID_MISSING
 */
router.put("/api/organizationDepartmentTeam/:organizationDepartmentTeamID", (request, response) => {
    
  // Getting organizationDepartmentTeam details from request body to update
  const { organizationID, activityID, teamName, teamCategoryID, description } = request.body;
  const userID = request.headers.userID;
  const organizationDepartmentTeamID = request.params.organizationDepartmentTeamID;

  // Contain the organizationDepartmentTeam details into updateOrganizationDepartmentTeamData object
  const updateOrganizationDepartmentTeamData = { organizationID, activityID, teamName, teamCategoryID, description, userID, organizationDepartmentTeamID };

  // Check if the required fields are null or empty
  if (validator.isNullOrEmpty(organizationID) || validator.isNullOrEmpty(activityID) && validator.isNullOrEmpty(teamName) || validator.isNullOrEmpty(teamCategoryID)
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
  if (validator.isNullOrEmpty(organizationDepartmentTeamID)) {
      return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_ORGANIZATION_DEPARTMENT_TEAMID_MISSING,
      });
  }

  // Pass the object containing details to be updated
  organizationDepartmentTeamService.updateOrganizationDepartmentTeam(
      updateOrganizationDepartmentTeamData,
      (organizationDepartmentTeamID, errMsg) => {
          // If an error occurred during the update
          if (errMsg) {
              console.error(errorMessages.ERROR_UPDATING_ORGANIZATION_DEPARTMENT_TEAM, errMsg);
              return response.status(400).json({
                  success: false,
                  data: null,
                  errMsg: errMsg,
              });
          } else {
              if (organizationDepartmentTeamID) {
                  return response.status(200).json({
                      success: true,
                      data: organizationDepartmentTeamID,
                      errMsg: null,
                  });
              } else {
                  // If department team not updated
                  return response.status(200).json({
                      success: false,
                      data: null,
                      errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_TEAM_DETAILS,
                  });
              }
          }
      }
  );
});




/*
Author     : Abhijith JS
Date       : 04 November 2024
Purpose    : route for searching organization Team
parameter  : searchOrganizationDepartmentTeamData
return type: organizationDepartmentTeamDetails Array
*/
/**
 * @swagger
 * /api/search/organizationDepartmentTeam:
 *   post:
 *     tags:
 *       - : "Organization Department Team"
 *     summary: "Search for organization department teams"
 *     description: Searches for organization department teams by name and pagination options.
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
 *         description: Criteria for searching organization department teams
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
 *               description: Name of the department team
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
 *         description: Successfully retrieved organization department team details
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
 *                     organizationDepartmentTeamDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           organizationDepartmentTeamID:
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
 *                             example: "Handles project management"
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
 *         description: Server error or failed to fetch organization department team details
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
 *                   example: ERROR_FETCHING_ORGANIZATION_DEPARTMENT_TEAM_DETAILS
 */
router.post("/api/search/organizationDepartmentTeam", (request, response) => {
  // storing organizationDepartmentTeam data from request body to variables
  const { organizationName, teamName } = request.body;
  const { page, pageSize } = request.query;

  // storing organizationDepartmentTeam data into organizationDepartmentTeam's object
  const searchOrganizationDepartmentTeamData = { organizationName, teamName };

  organizationDepartmentTeamService.searchOrganizationDepartmentTeam(
    searchOrganizationDepartmentTeamData,
    page,
    pageSize,
    (organizationDepartmentTeamDetails, errMsg) => {
      // If an error occurred during the search
      if (errMsg) {
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_TEAM_DETAILS, errMsg);
        return response.status(500).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        if (organizationDepartmentTeamDetails) {
          const totalCount = organizationDepartmentTeamDetails.length > 0 ? organizationDepartmentTeamDetails[0].total_count : 0;
          const count = organizationDepartmentTeamDetails.length;
          const totaldata = { organizationDepartmentTeamDetails, page, pageSize, totalCount, count };

          return response.status(200).json({
            success: true,
            data: totaldata,
            errMsg: null,
          });
        } else {
          // If no organizationDepartmentTeams were found
          return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_TEAM_DETAILS,
          });
        }
      }
    }
  );
});





module.exports = router;