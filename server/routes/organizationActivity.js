const express = require("express");
const Validator = require("validator");
const router = express.Router();
const organizationActivityServices = require("../services/organizationActivity");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const { authentication } = require("../common/authMiddleware");

/**
     * @swagger
     * /api/search/organizationActivity:
     *   post:
     *     tags:
     *       - : "Organization Activity"
     *     summary: "Search Organization Activity"
     *     description: |
     *       To search Organization activity data
     *       Organization data:
     *       | Key               | Value                                  | Description                |
     *       |-------------------|----------------------------------------|----------------------------|
     *       | organizationID    | eg., "10" (number)                     | ID   of the organization   |
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         schema:
     *            type: string
     *         required: true
     *       - in: body
     *         name: body
     *         description: Organization object
     *         required: true
     *         schema:
     *            type: object
     *            properties:
     *               organizationID:
     *                  type: string 
     *            example: # Sample object
     *               organizationID: "1"
     *     responses:
     *       200:
     *         description: Successfully get organization activity details
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
     *                   description: User basic detail response data
     *                 errMsg:
     *                   type: string
     *                   example: null or ERROR_NO_ORGANIZATIONFOUND
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
/*
Author     : VARUN H M
Date       : 29 August 2024
Purpose    : route for search organizations activity.
parameter  : searchOrganizationData
return type: array organizationDetails
*/
router.post("/api/search/organizationActivity", (request, response) => {
  //storing organization data from request body to variables
  const {
    organizationID
  } = request.body;
  const { page, pageSize } = request.query;

  //storing organization data into organization's object
  const searchOrganizationData = {
    organizationID
  };

  organizationActivityServices.searchOrganizationActivity(
    searchOrganizationData,
    page,
    pageSize,
    (organizationDetails, errMsg) => {
      //If an error occured during the search
      if (errMsg) {
        console.error(errorMessages.ERROR_NOUSER, errMsg);
        return response.status(500).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
        //if organization found
      } else {
        if (organizationDetails) {

          const totalCount = organizationDetails.length > 0 ? organizationDetails[0].total_count : 0;
          const count = organizationDetails.length;
          const totaldata = { organizationDetails, page, pageSize, totalCount, count };

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
            errMsg: errorMessages.ERROR_NO_ORGANIZATIONACTIVITYFOUND,
          });
        }
      }
    }
  );
});


/**
     * @swagger
     * /api/get/organizationActivity/{organizationActivityID}:
     *   get:
     *     tags:
     *       - : "Organization Activity"
     *     summary: "get Organization activity details"
     *     description: |
     *       To get Organization details
     *       | Key            | Value                          | Description                          |
     *       |----------------|--------------------------------|--------------------------------------|
     *       | organizationActivityID             | eg.,"2"(organizationActivityID)                    | ID to match and fetch organization   |
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         schema:
     *            type: string
     *         required: true
     *       - in: path
     *         name: organizationActivityID
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the Organization activity to retrieve
     *     responses:
     *       200:
     *         description: Successfully fetched Organization Activity
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
     *                   description: Organization activity details
     *                 errMsg:
     *                   type: string
     *                   example: null
     *       400:
     *         description: Organization activity ID is missing 
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
     *                   example: ERROR_NOORGANIZATION_ID
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
     *                   example: errMsg
 */
/*
Author     : VARUN H M
Date       : 29 August 2024
Purpose    : route for getting organization by organizationActivityID.
parameter  : id
return type: object - organization
*/

router.get("/api/get/organizationActivity/:organizationActivityID", (request, response) => {
  const organizationActivityID = request.params.organizationActivityID;

  if (validator.isNullOrEmpty(organizationActivityID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOORGANIZATIONACTIVITY_ID,
    });
  }
  organizationActivityServices.getOrganizationActivityByID(
    organizationActivityID,
    (organization, errMsg) => {
      if (errMsg) {
        // If any error occurs while finding organization
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATIONACTIVITYDETAILS, errMsg);
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If organization details fetched successfully
        return response.status(200).json({
          success: true,
          data: organization,
          errMsg: null,
        });
      }
    }
  );
});


/**
     * @swagger
     * /api/organizationActivity:
     *   post:
     *     tags:
     *       - : "Organization Activity"
     *     summary: "Add new Organization Activity"
     *     description: |
     *       Add new Organization
     *       Organization data:
     *       | Key               | Value                                    | Description                |
     *       |-------------------|------------------------------------------|----------------------------|
     *       | activityID        | eg., "1,2" (String)                      | ID of the Activity         |
     *       | organizationID    | eg., "35" (String)                       | ID of the organization     |
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         schema:
     *            type: string
     *         required: true
     *       - in: body
     *         name: body
     *         description: Organization object
     *         required: true
     *         schema:
     *            type: object
     *            properties:
     *               organizationName:
     *                  type: string
     *               organizationEmail:
     *                  type: string 
     *               website:
     *                  type: string 
     *               phoneNumber:
     *                  type: integer 
     *               city:
     *                  type: string
     *               district:
     *                  type: string 
     *               state:
     *                  type: string 
     *               userID:
     *                  type: string
     *            example: # Sample object
     *               activityID: "1,2"
     *               organizationID: "1"
     *     responses:
     *       200:
     *         description: Successfully created user basic detail
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
     *                   description: User basic detail response data
     *                 errMsg:
     *                   type: string
     *                   example: null or ERROR_NO_ORGANIZATIONFOUND
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
/*
Author     : VARUN H M
Date       : 29 August 2024
Purpose    : route for creating new organization activity
parameter  : organizationData
return type: organizationID int
*/
router.post("/api/organizationActivity", (request, response) => {
  //getting new organization details from request body
  const { activityID, organizationID } = request.body;

  if (
    validator.isNullOrEmpty(activityID) ||
    validator.isNullOrEmpty(organizationID)
  ) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_MISSINGFIELDS,
    });
  }

  const userID = request.headers.userID

  const organizationActivityDatas = { activityID: activityID, organizationID, userID}

  organizationActivityServices.saveOrganizationActivity(
    organizationActivityDatas,organizationID,
    (organizationID, errMsg) => {
      if (errMsg) {
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATIONACTIVITYDETAILS, errMsg);
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        return response.status(201).json({
          success: true,
          data: organizationID,
          errMsg: null,
        });
      }
    }
  );
});



/*
Author     : Abhijith JS
Date       : 25 October 2024
Purpose    : route for Deleting organizationActivity by organizationID
parameter  : organizationID
return type: Boolean
*/
/**
 * @swagger
 * /api/organizationActivity/{organizationID}:
 *   delete:
 *     tags:
 *       - : "Organization Activity"
 *     summary: "Delete an Organization Activity"
 *     description: "Deletes an organization activity by its ID."
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authorization
 *       - in: path
 *         name: organizationID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the Organization Activity to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the Organization Activity
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
 *         description: Error occurred while deleting the Organization Activity
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
 *                   example: ERROR_DELETING_ORGANIZATION_ACTIVITY
 *       404:
 *         description: Organization Activity ID not provided or not found
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
 *                   example: ERROR_NO_ORGANIZATION_ID
 */

router.delete("/api/organizationActivity/:organizationID", (request, response) => {
  const organizationID = request.params.organizationID;

  if (validator.isNullOrEmpty(organizationID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOORGANIZATION_ID,
    });
  } else {
    organizationActivityServices.deleteOrganizationActivity(
      organizationID,
      (success, errMsg) => {
        if (errMsg) {
          // If any error occurs while deleting
          console.error(errorMessages.ERROR_DELETING_ORGANIZATION_ACTIVITY, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else if (success) {
          // Organization activity deleted successfully
          return response.status(200).json({
            success: true,
            data: true,
            errMsg: null,
          });
        } else {
          // No organization activity found
          return response.status(200).json({
            success: false,
            data: false,
            errMsg: errorMessages.ERROR_NO_ORGANIZATIONACTIVITYFOUND
            
          });
        }
      }
    );
  }
});



module.exports = router;
