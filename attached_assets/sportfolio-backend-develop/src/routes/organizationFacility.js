const express = require("express");
const Validator = require("validator");
const router = express.Router();
const organizationFacilityServices = require("../services/organizationFacility");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const { authentication } = require("../common/authMiddleware");






/*
Author     : Abhijith JS
Date       : 14 November 2024
Purpose    : route for creating new organization Facility
parameter  : organizationFacilityData
return type: organizationFacilityID int
*/
/**
 * @swagger
 * /api/organization/facility:
 *   post:
 *     tags:
 *       - : "Organization Facility"
 *     summary: Add new Facility to an Organization
 *     description: |
 *       Adds a new facility for an organization. All fields are required.
 *       | Key            | Value                | Description                                   |
 *       |----------------|----------------------|-----------------------------------------------|
 *       | organizationID | eg., "123" (integer) | ID of the organization *                      |
 *       | facilityName   | eg., "Lab" (string)  | Name of the facility *                        |
 *       | description    | eg., "Advanced lab for R&D" (string) | Description of the facility * |
 *       | notes          | eg., "Open 24/7" (string) | Additional notes for the facility *      |
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *       - in: body
 *         name: body
 *         description: Organization facility object
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - organizationID
 *             - facilityName
 *             - description
 *             - notes
 *           properties:
 *             organizationID:
 *               type: integer
 *             facilityName:
 *               type: string
 *             description:
 *               type: string
 *             notes:
 *               type: string
 *           example:
 *             organizationID: 50
 *             facilityName: "Stadium"
 *             description: "Advanced Stadium for Sports"
 *             notes: "Open"
 *     responses:
 *       201:
 *         description: Successfully created organization facility
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
 *                   description: ID of the created organization facility
 *                   example: 456
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Missing required fields or invalid input
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
 *                   example: "ERROR_ALLFIELDMISSING"
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
 *                   example: "ERROR_SAVINGORGANIZATION_FACILITY"
 */
router.post("/api/organization/facility", (request, response) => {
    //getting new organization Facility details from request body
    const { organizationID, facilityName, description, notes } = request.body;
    const userID = request.headers.userID
    //validating if any fields are missing data
    if (validator.isNullOrEmpty(organizationID) || validator.isNullOrEmpty(facilityName) || validator.isNullOrEmpty(description)
         || validator.isNullOrEmpty(notes)) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_ALLFIELDMISSING,
      });
    }
    if (validator.isNullOrEmpty(userID)) {
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_NOUSERID,
        });}
  
    //passing organization Facility data into an object
    const organizationFacilityData = { organizationID, facilityName, description, notes, userID };
  
    organizationFacilityServices.saveorganizationFacility(
        organizationFacilityData,
      (organizationFacilityID, errMsg) => {
        if (errMsg) {
          console.error(errorMessages.ERROR_SAVINGORGANIZATION_FACILITY, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else {
          return response.status(201).json({
            success: true,
            data: organizationFacilityID,
            errMsg: null,
          });
        }
      }
    );
  });




/*
Author     : Abhijith JS
Date       : 14 November 2024
Purpose    : route for updating organization Facility
parameter  : organizationFacilityData
return type: organizationFacilityID int
*/
/**
 * @swagger
 * /api/organization/facility/{organizationFacilityID}:
 *   put:
 *     tags:
 *       - : "Organization Facility"
 *     summary: Update an existing Facility in an Organization
 *     description: Updates the details of an existing organization facility.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: organizationFacilityID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the organization facility to update
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *       - in: body
 *         name: body
 *         description: Organization facility update object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationID:
 *               type: integer
 *               description: ID of the organization
 *             facilityName:
 *               type: string
 *               description: Name of the facility
 *             description:
 *               type: string
 *               description: Description of the facility
 *             notes:
 *               type: string
 *               description: Additional notes for the facility
 *           example:
 *             organizationID: 50
 *             facilityName: "Stadium"
 *             description: "Updated Stadium description"
 *             notes: "Open"
 *     responses:
 *       200:
 *         description: Facility updated successfully
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
 *                   description: ID of the updated organization facility
 *                   example: 456
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Missing required fields or invalid input
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
 *                   example: "ERROR_ALLFIELDMISSING"
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
 *                   example: "ERROR_UPDATING_ORGANIZATION_FACILITY"
 */
router.put("/api/organization/facility/:organizationFacilityID", (request, response) => {
    // Get the facility details from request 
    const { organizationID, facilityName, description, notes } = request.body;
    const userID = request.headers.userID;
    const organizationFacilityID = request.params.organizationFacilityID;
  
    // Validate if any fields are missing data
    if (
      validator.isNullOrEmpty(organizationID) ||
      validator.isNullOrEmpty(facilityName) 
    ) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_ALLFIELDMISSING,
      });
    }
    if (validator.isNullOrEmpty(userID)) {
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_NOUSERID,
        });
      }
    if (validator.isNullOrEmpty(organizationFacilityID)) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_ORGANIZATION_FACILITYID_MISSING,
      });
    }

    // Construct the update data object
    const updateOrganizationFacilityData = { organizationFacilityID, organizationID, facilityName, description, notes, userID };
  
    // Call the update service function
    organizationFacilityServices.updateOrganizationFacility(
      updateOrganizationFacilityData,
      (updatedOrganizationFacilityID, errMsg) => {
        if (errMsg) {
          console.error(errorMessages.ERROR_UPDATING_ORGANIZATION_FACILITY, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else {
          if (updatedOrganizationFacilityID) {
            return response.status(200).json({
              success: true,
              data: updatedOrganizationFacilityID,
              errMsg: null,
            });
          } else {
            return response.status(200).json({
              success: false,
              data: null,
              errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_FACILITY_DETAILS,
            });
          }
        }
      }
    );
  });
  



/*
Author     : Abhijith JS
Date       : 15 November 2024
Purpose    : route for search organization facility.
parameter  : searchOrganizationFacilityData 
return type: array of organization Facility Details
*/
/**
 * @swagger
 * /api/search/organization/facility:
 *   post:
 *     tags:
 *       - : "Organization Facility"
 *     summary: Search for Organization Facilities
 *     description: Searches for facilities within organizations based on organization and facility name with pagination.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Authorization token
 *       - in: body
 *         name: body
 *         description: Organization facility search criteria
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationName:
 *               type: string
 *               description: Name of the organization
 *             facilityName:
 *               type: string
 *               description: Name of the facility
 *           example:
 *             organizationName: "TechCorp"
 *             facilityName: "Research Lab"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of organization facilities matching search criteria
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
 *                     organizationFacilityDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           facilityID:
 *                             type: integer
 *                             example: 123
 *                           facilityName:
 *                             type: string
 *                             example: "Research Lab"
 *                           organizationName:
 *                             type: string
 *                             example: "TechCorp"
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     totalCount:
 *                       type: integer
 *                       example: 25
 *                     count:
 *                       type: integer
 *                       example: 10
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Invalid input or missing required parameters
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
 *                   example: "ERROR_MISSING_SEARCH_CRITERIA"
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
 *                   example: "ERROR_FETCHING_ORGANIZATION_FACILITY_DETAILS"
 */
router.post("/api/search/organization/facility", (request, response) => {
  // Storing organization facility data from request body to variables
  const { organizationName, facilityName } = request.body;
  const { page, pageSize } = request.query;

  // Storing organization facility data into organization's object
  const searchOrganizationFacilityData = { organizationName, facilityName };

  // Call the facility search service instead of the department service
  organizationFacilityServices.searchOrganizationFacility(
    searchOrganizationFacilityData,
    page,
    pageSize,
    (organizationFacilityDetails, errMsg) => {
      // If an error occurred during the search
      if (errMsg) {
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_FACILITY, errMsg);
        return response.status(500).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If organization facilities were found
        if (organizationFacilityDetails) {
          const totalCount = organizationFacilityDetails.length > 0 ? organizationFacilityDetails[0].total_count : 0;
          const count = organizationFacilityDetails.length;
          const totalData = { organizationFacilityDetails, page, pageSize, totalCount, count };

          return response.status(200).json({
            success: true,
            data: totalData,
            errMsg: null,
          });
        } else {
          // If no organization facilities were found
          return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_FACILITY,
          });
        }
      }
    }
  );
});




/*
Author     : Abhijith JS
Date       : 15 November 2024
Purpose    : route for fetching organization facility by ID.
parameter  : organizationFacilityID 
return type: organization Facility Details
*/
/**
 * @swagger
 * /api/get/organization/facility/{id}:
 *   get:
 *     tags:
 *       - : "Organization Facility"
 *     summary: "Get Organization Facility details"
 *     description: |
 *       Retrieve details of an organization facility by its ID.
 *       | Key                  | Value                    | Description                                      |
 *       |----------------------|--------------------------|--------------------------------------------------|
 *       | id                   | eg.,"12345"(ID)          | ID of the Organization facility to retrieve      |
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the Organization facility to retrieve
 *     responses:
 *       200:
 *         description: Successfully fetched Organization facility details
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
 *                   description: Organization facility details
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Organization Facility ID not found
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
 *                   example: "ERROR_NO_ORGANIZATION_FACILITY_ID"
 *       404:
 *         description: Fetch failed
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
 *                   example: "ERROR_FETCHING_ORGANIZATION_FACILITY_DETAILS"
 *       500:
 *         description: Internal Server Error
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
 *                   example: "Internal server error."
 */
router.get("/api/get/organization/facility/:id", (request, response) => {

  const organizationFacilityID = request.params.id;

  if (validator.isNullOrEmpty(organizationFacilityID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ORGANIZATION_FACILITYID_MISSING,
    });
  }

  organizationFacilityServices.getOrganizationFacilityByID(
    organizationFacilityID,
    (organizationFacilityData, errMsg) => {
      if (errMsg) {
        // If any error occurs while finding organization facility
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_FACILITY, errMsg);
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If organization facility details fetched successfully
        return response.status(200).json({
          success: true,
          data: organizationFacilityData,
          errMsg: null,
        });
      }
    }
  );
});




/*
Author     : Abhijith JS
Date       : 18 November 2024
Purpose    : route for deleting organization facility by ID.
parameter  : organizationFacilityID 
return type: Boolean
*/
/**
 * @swagger
 * /api/organization/facility/{id}:
 *   delete:
 *     tags:
 *       - : "Organization Facility"
 *     summary: "Delete an Organization Facility"
 *     description: Deletes an organization facility by its ID.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authorization
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the organization facility to delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Additional notes for the deletion
 *                 example: "Facility closed due to maintenance"
 *     responses:
 *       200:
 *         description: Successfully deleted the organization facility
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
 *                   example: true
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Error occurred while deleting the organization facility
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
 *                   example: "ERROR_DELETING_ORGANIZATION_FACILITY"
 *       404:
 *         description: Organization facility ID not provided or missing
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
 *                   example: "ERROR_ORGANIZATION_FACILITYID_MISSING"
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
 *                   example: "Internal server error"
 */
router.delete("/api/organization/facility/:id", (request, response) => {
  const organizationFacilityID = request.params.id;
  const notes = request.body.notes;

  if (validator.isNullOrEmpty(organizationFacilityID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ORGANIZATION_FACILITYID_MISSING,
    });
  } else {

    const deleteOrganizationFacilityData = { organizationFacilityID, notes };
    organizationFacilityServices.deleteOrganizationFacility(
      deleteOrganizationFacilityData,
      (success, errMsg) => {
        if (errMsg) {
          // If any error occurs while deleting
          console.error(
            errorMessages.ERROR_DELETING_ORGANIZATION_FACILITY,
            errMsg
          );
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else if (success) {
          // Facility deleted successfully
          return response.status(200).json({
            success: true,
            data: true,
            errMsg: null,
          });
        } else {
          // No facility found
          return response.status(200).json({
            success: false,
            data: false,
            errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_FACILITY,
          });
        }
      }
    );
  }
});








  module.exports = router;