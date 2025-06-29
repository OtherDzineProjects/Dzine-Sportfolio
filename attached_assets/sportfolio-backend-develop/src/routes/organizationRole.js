const express = require("express");
const router = express.Router();
const organizationRoleService = require("../services/organizationRole");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");





/*
Author     : Abhijith JS
Date       : 26 November 2024
Purpose    : route for saving organization Role
parameter  : organizationRoleData
return type: organizationRoleData int
*/
/**
 * @swagger
 * /api/organizationRole:
 *   post:
 *     tags:
 *       - : "Organization Role"
 *     summary: Create a new organization role
 *     description: |
 *       Creates a new Organization Role.
 *       Required fields:
 *       | Key            | Value                       | Description                        |
 *       |----------------|-----------------------------|------------------------------------|
 *       | organizationID | eg., 1 (integer)            | ID of the organization             |
 *       | roleName       | eg., "Admin" (string)       | Name of the role                   |
 *       | isAdmin        | eg., 1 (integer)            | 1 if the role has admin privileges |
 *       | heirarchy      | eg., 5 (integer)            | Role hierarchy level               |
 *       | notes          | eg., "Manages projects"     | Additional notes about the role    |
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
 *         description: Organization role object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationID:
 *               type: integer
 *             roleName:
 *               type: string
 *             isAdmin:
 *               type: integer
 *             heirarchy:
 *               type: integer
 *             status:
 *               type: integer
 *             notes:
 *               type: string
 *           example: # Sample object
 *             organizationID: 1
 *             roleName: "Admin"
 *             isAdmin: "1"
 *             heirarchy: "5"
 *             notes: "Manages projects"
 *     responses:
 *       201:
 *         description: Successfully created organization role
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
 *                   description: Created organization role ID
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
router.post("/api/organizationRole", (request, response) => {
    // Getting new organizationRole details from request body
    const { organizationID, roleName, isAdmin, heirarchy, notes } = request.body;
  
    // Validating if any required fields are missing
    if (
      validator.isNullOrEmpty(organizationID) || 
      validator.isNullOrEmpty(roleName) || 
      validator.isNullOrEmpty(isAdmin) || 
      validator.isNullOrEmpty(heirarchy)
    ) {
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
  
    // Passing organizationRole data into an object
    const organizationRoleData = { 
      organizationID, 
      roleName, 
      isAdmin, 
      heirarchy, 
      notes, 
      userID 
    };
  
    organizationRoleService.saveOrganizationRole(
      organizationRoleData,
      (organizationRoleID, errMsg) => {
        if (errMsg) {
          console.error(errorMessages.ERROR_SAVING_ORGANIZATION_ROLE, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else {
          return response.status(201).json({
            success: true,
            data: organizationRoleID,
            errMsg: null,
          });
        }
      }
    );
  });

  

/*
Author     : Abhijith JS
Date       : 26 November 2024
Purpose    : route for updating organization Role
parameter  : updateOrganizationRoleData
return type: organizationRoleData int
*/
/**
 * @swagger
 * /api/organizationRole/{organizationRoleID}:
 *   put:
 *     tags:
 *       - : "Organization Role"
 *     summary: "Update an organization role"
 *     description: |
 *       Updates an organization role with new details. Required fields:
 *       | Key                | Value                            | Description                       |
 *       |--------------------|----------------------------------|-----------------------------------|
 *       | organizationID     | eg., 1 (integer)                 | ID of the organization            |
 *       | roleName           | eg., "Admin" (string)            | Name of the role                  |
 *       | isAdmin            | eg., 1 (boolean)                 | Indicates if the role is admin    |
 *       | heirarchy          | eg., 4 (integer)                 | Heirarchy level of the role       |
 *       | notes              | eg., "Admin role"(string)        | Description of the role           |
 *       | organizationRoleID | eg., "7" (integer)               | ID of the role to be updated      |
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
 *         name: organizationRoleID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the organization role to update
 *       - in: body
 *         name: body
 *         description: Organization role object to be updated
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationID:
 *               type: integer
 *             roleName:
 *               type: string
 *             isAdmin:
 *               type: integer
 *             heirarchy:
 *               type: integer
 *             status:
 *               type: integer
 *             notes:
 *               type: string
 *           example: # Sample object
 *             organizationID: 1
 *             roleName: "Admin"
 *             isAdmin: "0"
 *             heirarchy: "4"
 *             notes: "Admin note's"
 *     responses:
 *       200:
 *         description: Successfully updated organization role details
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
 *                   description: Updated organization role ID
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
 *                   example: ERROR_ALLFIELDMISSING or ERROR_USERIDMISSING or ERROR_ORGANIZATION_ROLEID_MISSING
 */
router.put("/api/organizationRole/:organizationRoleID", (request, response) => {

    // Getting organizationRole details from request body to update
    const { organizationID, roleName, isAdmin, heirarchy, notes } = request.body;
    const userID = request.headers.userID;
    const organizationRoleID = request.params.organizationRoleID;
  
    // Contain the organizationRole details into updateOrganizationRoleData object
    const updateOrganizationRoleData = { organizationID, roleName, isAdmin, heirarchy, notes, userID, organizationRoleID };
  
    // Check if the required fields are null or empty
    if (validator.isNullOrEmpty(organizationID) && validator.isNullOrEmpty(roleName) && validator.isNullOrEmpty(isAdmin) && validator.isNullOrEmpty(heirarchy)
         && validator.isNullOrEmpty(notes)) {
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
  
    if (validator.isNullOrEmpty(organizationRoleID)) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_ORGANIZATION_ROLEID_MISSING,
      });
    }
  
    // Pass the object containing details to be updated
    organizationRoleService.updateOrganizationRole(
      updateOrganizationRoleData,
      (updateorganizationRoleID, errMsg) => {
        // If an error occurred during the update
        if (errMsg) {
          console.error(errorMessages.ERROR_UPDATING_ORGANIZATION_ROLE, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else {
          if (updateorganizationRoleID) {
            return response.status(200).json({
              success: true,
              data: updateorganizationRoleID,
              errMsg: null,
            });
          } else {
            // If role not updated
            return response.status(200).json({
              success: false,
              data: null,
              errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_ROLE_DETAILS,
            });
          }
        }
      }
    );
  });



/*
Author     : Abhijith JS
Date       : 27 November 2024
Purpose    : Route for fetching organization role by id
parameter  : organizationRoleID
return type: organizationRoleData array
*/
/**
 * @swagger
 * /api/organizationRole/{organizationRoleID}:
 *   get:
 *     tags:
 *       - : "Organization Role"
 *     summary: "Get organization role details by ID"
 *     description: Retrieve details of a specific organization role using its ID.
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
 *         name: organizationRoleID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the organization role to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved organization role details
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
 *                   description: Organization role data object
 *                   properties:
 *                     organizationID:
 *                       type: integer
 *                       example: 1
 *                     roleName:
 *                       type: string
 *                       example: "Admin Role"
 *                     isAdmin:
 *                       type: boolean
 *                       example: true
 *                     hierarchy:
 *                       type: integer
 *                       example: 1
 *                     notes:
 *                       type: string
 *                       example: "Responsible for managing the organization."
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
 *         description: Missing organization role ID
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
 *                   example: ERROR_ORGANIZATION_ROLEID_MISSING
 *       404:
 *         description: Organization role not found
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
 *                   example: ERROR_FETCHING_ORGANIZATION_ROLE_DETAILS
 */
router.get("/api/organizationRole/:organizationRoleID", (request, response) => {
    const organizationRoleID = request.params.organizationRoleID;
  
    // Validate the input for organizationRoleID
    if (validator.isNullOrEmpty(organizationRoleID)) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_ORGANIZATION_ROLEID_MISSING,
      });
    }
  
    // Call the service function to fetch organizationRole details
    organizationRoleService.getOrganizationRoleByID(
      organizationRoleID,
      (organizationRoleData, errMsg) => {
        if (errMsg) {
          // If an error occurs while fetching organizationRole
          console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_ROLE_DETAILS, errMsg);
          return response.status(404).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else if(validator.isNullOrEmpty(organizationRoleData)){
          const errMsg = errorMessages.ERROR_FETCHING_ORGANIZATION_ROLE_DETAILS;
          return response.status(404).json({
            success: true,
            data: [],
            errMsg: errMsg,
          });
        } else {
          // If organizationRole details are fetched successfully
          return response.status(200).json({
            success: true,
            data: organizationRoleData,
            errMsg: null,
          });
        }
      }
    );
  });
  


/*
Author     : Abhijith JS
Date       : 27 November 2024
Purpose    : Function for searching organization Role
parameter  : searchOrganizationRoleData
return type: Array of organizationRoleDetails
*/
/**
 * @swagger
 * /api/search/organizationRole:
 *   post:
 *     tags:
 *       - : "Organization Role"
 *     summary: "Search for organization roles"
 *     description: Searches for organization roles by name and pagination options.
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
 *         description: Criteria for searching organization roles
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationName:
 *               type: string
 *               description: Name of the organization
 *               example: "Tech Corp"
 *             roleName:
 *               type: string
 *               description: Name of the role
 *               example: "Administrator"
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
 *         description: Successfully retrieved organization role details
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
 *                     organizationRoleDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           organizationRoleID:
 *                             type: integer
 *                             example: 1
 *                           organizationName:
 *                             type: string
 *                             example: "Tech Corp"
 *                           roleName:
 *                             type: string
 *                             example: "Administrator"
 *                           isAdmin:
 *                             type: boolean
 *                             example: true
 *                           hierarchy:
 *                             type: integer
 *                             example: 1
 *                           notes:
 *                             type: string
 *                             example: "Manages the entire organization"
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
 *         description: Server error or failed to fetch organization role details
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
 *                   example: ERROR_FETCHING_ORGANIZATION_ROLE_DETAILS
 */
router.post("/api/search/organizationRole", (request, response) => {
  // Storing organizationRole data from request body to variables
  const { organizationName, roleName } = request.body;
  const { page, pageSize } = request.query;

  // Storing organizationRole data into organizationRole's object
  const searchOrganizationRoleData = { organizationName, roleName };

  organizationRoleService.searchOrganizationRole(
    searchOrganizationRoleData,
    page,
    pageSize,
    (organizationRoleDetails, errMsg) => {
      // If an error occurred during the search
      if (errMsg) {
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_ROLE_DETAILS, errMsg);
        return response.status(500).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If organizationRoles found
        if (organizationRoleDetails) {
          const totalCount = organizationRoleDetails.length > 0 ? organizationRoleDetails[0].total_count : 0;
          const count = organizationRoleDetails.length;
          const totalData = { organizationRoleDetails, page, pageSize, totalCount, count };

          return response.status(200).json({
            success: true,
            data: totalData,
            errMsg: null,
          });
        } else {
          // If no organizationRoles were found
          return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_ROLE_DETAILS,
          });
        }
      }
    }
  );
});



/*
Author     : Abhijith JS
Date       : 27 November 2024
Purpose    : Function for deleting organization Role
parameter  : organizationRoleID
return type: Boolean
*/
/**
 * @swagger
 * /api/organizationRole/{organizationRoleID}:
 *   delete:
 *     tags:
 *       - : "Organization Role"
 *     summary: "Delete an Organization Role"
 *     description: |
 *       Deletes an organization role by its ID.
 *       | Key                | Value                       | Description                                   |
 *       |--------------------|-----------------------------|-----------------------------------------------|
 *       | organizationRoleID | eg., "5" (ID)               | ID to match and delete organization role      |
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
 *         name: organizationRoleID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the Organization Role to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the organization role or role not found
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
 *                   description: True if the role was deleted, false if it was not found
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
 *                   example: "Error occurred while deleting the organization role"
 *       404:
 *         description: OrganizationRoleID not provided or invalid
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
 *                   example: "ERROR_NO_ORGANIZATION_ROLE_ID"
 */
router.delete("/api/organizationRole/:organizationRoleID", (request, response) => {
  const organizationRoleID = request.params.organizationRoleID;

  // Check if organizationRoleID is missing
  if (validator.isNullOrEmpty(organizationRoleID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ORGANIZATION_ROLEID_MISSING,
    });
  } else {
    // Call service to delete the organization role
    organizationRoleService.deleteOrganizationRole(
      organizationRoleID,
      (success, errMsg) => {
        if (errMsg) {
          // If any error occurs while deleting
          console.error(errorMessages.ERROR_DELETING_ORGANIZATION_ROLE, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else if (success) {
          // Role deleted successfully
          return response.status(200).json({
            success: true,
            data: true,
            errMsg: null,
          });
        } else {
          // No role found with the given ID
          return response.status(200).json({
            success: false,
            data: false,
            errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_ROLE_DETAILS,
          });
        }
      }
    );
  }
});






  module.exports = router;