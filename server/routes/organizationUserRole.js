const express = require("express");
const router = express.Router();
const organizationUserRoleService = require("../services/organizationUserRole");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");





/*
Author     : Abhijith JS
Date       : 27 November 2024
Purpose    : route for saving organization User Role
parameter  : organizationUserRoleData
return type: organizationUserRoleData int
*/
/**
 * @swagger
 * /api/organizationUserRole:
 *   post:
 *     tags:
 *       - : "Organization User Role"
 *     summary: Create a new organization user role
 *     description: |
 *       Creates a new Organization User Role.
 *       Required fields:
 *       | Key                 | Value                       | Description                            |
 *       |---------------------|-----------------------------|----------------------------------------|
 *       | organizationRoleID  | eg., 1 (integer)            | ID of the organization                 |
 *       | notes               | eg., "Manages projects"     | Additional notes about the role        |
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
 *         description: Organization user role object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationRoleID:
 *               type: integer
 *             notes:
 *               type: string

 *           example: # Sample object
 *             organizationRoleID: 1
 *             notes: "Manages projects"
 *     responses:
 *       201:
 *         description: Successfully created organization user role
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
 *                   description: Created organization user role ID
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
router.post("/api/organizationUserRole", (request, response) => {
    // Getting new organizationUserRole details from request body
    const { organizationRoleID, notes } = request.body;
  
    // Validating if any required fields are missing
    if (
      validator.isNullOrEmpty(organizationRoleID) || 
      validator.isNullOrEmpty(notes)
    ) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_ALLFIELDMISSING,
      });
    }
  
    // Getting the userID from the request headers for auditing purposes
    const userID = request.headers.userID;
    if (validator.isNullOrEmpty(userID)) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_NOUSERID,
      });
    }
  
    // Passing organizationUserRole data into an object
    const organizationUserRoleData = { 
      userID, 
      organizationRoleID, 
      notes, 
    };
  
    // Assuming a service function for saving organizationUserRole
    organizationUserRoleService.saveOrganizationUserRole(
      organizationUserRoleData,
      (organizationUserRoleID, errMsg) => {
        if (errMsg) {
          console.error(errorMessages.ERROR_SAVING_ORGANIZATION_USER_ROLE, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else {
          return response.status(201).json({
            success: true,
            data: organizationUserRoleID,
            errMsg: null,
          });
        }
      }
    );
  });








  module.exports = router;