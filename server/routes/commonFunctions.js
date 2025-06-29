const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer();
const extractUserID = require("../common/commonFunctions");
const globalConstants = require("../common/globalConstants");
const { encryptPassword } = require("../common/commonFunctions");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const getLocationServices = require("../services/commonFunctions");
const organizationMemberService = require("../services/commonFunctions");
const requireApplyMembershipButtonService = require("../services/commonFunctions");
const organizationListServices = require("../services/commonFunctions");
const notificationServices = require("../services/commonFunctions");
const passwordServices = require("../services/commonFunctions");
const commonFunctions = require("../services/commonFunctions");



/**
     * @swagger
     * /api/getLocation/parentID/{parentID}/regionType/{regionType}:
     *   get:
     *     tags:
     *       - : "CommonAPIs"
     *     summary: "get region Details"
     *     description: |
     *       get region Details based on matching parent region ID and region type ID
     *       | Key            | Value              | Description                         |
     *       |----------------|--------------------|-------------------------------------|
     *       | parentID       | eg.,"1"(ID)        | ID of the Parent region             |
     *       | regionType     | eg.,"2"(ID)        | regionTypeID of the child region    |
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         schema:
     *            type: string
     *         required: true
     *       - in: path
     *         name: parentID
     *         required: true
     *         schema:
     *           type: string
     *         description: parentID of the region to match
     *       - in: path
     *         name: regionType
     *         required: true
     *         schema:
     *           type: string
     *         description: regionType of the region to match
     *     responses:
     *       200:
     *         description: Successfully fetched region data
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
     *                   description: region response data
     *                 errMsg:
     *                   type: string
     *                   example: null
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
     *                   example: ERROR_FETCHING_REGIONDETAILS or ERROR_NOREGIONID
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
Author     : Abhijith JS
Date       : 20 August 2024
Purpose    : Route for getting region data by matching parentID and regiontype.
parameter  : dataPassed
return type: response object
*/
router.get("/api/getLocation/parentID/:parentID/regionType/:regionType", (request, response) => {
    let parentID = request.params.parentID;
    let regionType = request.params.regionType;
    if (validator.isNullOrEmpty(parentID) && validator.isNullOrEmpty(regionType)) {
      return response.status(404).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_NOREGIONID,
      });
    }
    if(validator.isNullOrEmpty(parentID)){
      parentID = null;
  }
    const dataPassed = { parentID, regionType };
  
    getLocationServices.getLocation(dataPassed, (regionData, errMsg) => {
      if (errMsg) {
        // If any error occurs while finding region
        console.error(errorMessages.ERROR_FETCHING_REGIONDETAILS, errMsg);
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If region details fetched successfully
        return response.status(200).json({
          success: true,
          data: regionData,
          errMsg: null,
        });
      }
    });
  });


/**
     * @swagger
     * /api/getLookupDetails/lookupTypeName:
     *   post:
     *     tags:
     *       - : "CommonAPIs"
     *     summary: "get lookup Details"
     *     description: |
     *       get lookup Details based on lookup type name
     *       Lookup Types:
     *       | Key            | Value                          | Description                                  |
     *       |----------------|--------------------------------|----------------------------------------------|
     *       | LookupTypeName:|                                |                                              |
     *       |                | eg.,"Gender"(String)           | for fetching all gender details              |
     *       |                | eg.,"BloodGroup"(String)       | for fetching all BloodGroup details          |
     *       |                | eg.,"Qualification"(String)    | for fetching all Qualification details       |
     *       |                | eg.,"AddressType"(String)      | for fetching all AddressType details         |
     *       |                | eg.,"CommunicationType"(String)| for fetching all CommunicationType details   |
     *       |                | eg.,"RegionType"(String)       | for fetching all localbody types             |
     *       |                | eg.,"Organization"(String)     | for fetching all Organizations,for particular area enter {"organizationTypeID":12,"localBodyName":15} in search criteria |
     *       |                | eg.,"OrganizationMemberStatus"(String) | for fetching OrganizationMemberStatus|
     *       | LookupType:    |                                |                                              |
     *       |                | eg.,"L"(String)                | for fetching other dropdown details          |
     *       |                | eg.,"T"(String)                | for fetching localbody details               |
     *     consumes:
     *       - multipart/form-data
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         schema:
     *            type: string
     *         required: true
     *       - in: formData
     *         name: lookupTypeName
     *         type: string
     *         description: "Name of lookup (e.g., 'BloodGroup')."
     *         required: true
     *       - in: formData
     *         name: lookupType
     *         type: string
     *         description: "Lookup type (e.g., 'L')."
     *         required: true
     *       - in: formData
     *         name: searchCriteria
     *         type: string
     *         description: "Optional JSON string for advanced search (e.g., '{\"organizationTypeID\":12,\"localBodyName\":15}')."
     *         required: false
     *     responses:
     *       200:
     *         description: Successfully fetched lookup data
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
     *                   description: region response data
     *                 errMsg:
     *                   type: string
     *                   example: null
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
     *                   example: ERROR_FETCHING_REGIONDETAILS or ERROR_NOREGIONID
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
Author     : Abhijith JS
Date       : 20 August 2024
Purpose    : Route for getting Lookupdetails by matching  lookupTypeName, lookupType, searchCriteria.
parameter  : dataPassed
return type: response object
*/
router.post("/api/getLookupDetails/lookupTypeName", upload.none(), (request, response) => {
  let { lookupTypeName, lookupType, searchCriteria } = request.body;
  const userID = request.headers.userID;

  if (validator.isNullOrEmpty(lookupTypeName) || validator.isNullOrEmpty(userID) || validator.isNullOrEmpty(lookupType)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOLOOKUP_DETAILS,
    });
  }
  if(validator.isNullOrEmpty(searchCriteria)){
    searchCriteria = null
  }
  const dataPassed = { lookupTypeName, userID, lookupType, searchCriteria };

  getLocationServices.getLookupByTypeName(dataPassed, (lookupData, errMsg) => {
    if (errMsg) {
      console.error(errorMessages.ERROR_FETCHING_LOOKUPDETAILS, errMsg);
      return response.status(404).json({
        success: false,
        data: null,
        errMsg: errMsg,
      });
    } else {
      return response.status(200).json({
        success: true,
        data: lookupData,
        errMsg: null,
      });
    }
  });
});



/*
Author     : ABHIJITH JS
Date       : 18 November 2024
Purpose    : route for updating organization member status
parameter  : organization member details with organizationMemberID
return type: organizationMemberID int
*/
/**
 * @swagger
 * /api/organization/member/status/update:
 *   put:
 *     tags:
 *       - : "Organization Member"
 *     summary: Update Organization Member Status
 *     description: |
 *       Updates the status of an organization member. All fields are required for the update.
 *       | Key                | Value                            | Description                                    |
 *       |--------------------|----------------------------------|------------------------------------------------|
 *       | organizationMemberID | eg., "12345" (integer)          | ID of the organization member *                |
 *       | statusID           | eg., "2" (integer)              | ID of the status to be updated *               |
 *       | status             | eg., "Active" (string)          | Status of the organization member *            |
 *       | notes              | eg., "Promoted to senior member" (string) | Notes for the status update *          |
 *       | userID             | eg., "98765" (integer)          | ID of the user performing the update *         |
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
 *         description: Organization member status update data
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - organizationMemberID
 *             - statusID
 *             - status
 *             - userID
 *           properties:
 *             organizationMemberID:
 *               type: string
 *               description: The ID of the organization member to update.
 *               example: "12345"
 *             statusID:
 *               type: string
 *               description: The ID of the status to be updated.
 *               example: "2"
 *             status:
 *               type: string
 *               description: The new status of the organization member.
 *               example: "Active"
 *             notes:
 *               type: string
 *               description: Optional notes for the status update.
 *               example: "Promoted to senior member."
 *     responses:
 *       200:
 *         description: Successfully updated the organization member status
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
 *                   description: Updated organization member ID
 *                   example: "12345"
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
 *       404:
 *         description: Organization member not found
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
 *                   example: "ERROR_NO_ORGANIZATION_MEMBER_FOUND"
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
 *                   example: "ERROR_INTERNAL_SERVER_ERROR"
 */
router.put("/api/organization/member/status/update", (request, response) => {
  const { organizationMemberID, statusID, status, notes } = request.body;
  const userID = request.headers.userID;

  const updateOrganizationMemberStatusData = {
    organizationMemberID,
    statusID,
    status,
    notes,
    userID
  };

  if (validator.isNullOrEmpty(userID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOUSERID,
    });
  }

  if (
    validator.isNullOrEmpty(statusID) &&
    validator.isNullOrEmpty(status) &&
    validator.isNullOrEmpty(organizationMemberID)
  ) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ALLFIELDMISSING,
    });
  }

  organizationMemberService.updateOrganizationMemberStatus(
    updateOrganizationMemberStatusData,
    (updateOrganizationMemberID, errMsg) => {
      //If an error occured during the update
      if (errMsg) {
        console.error(errorMessages.ERROR_UPDATING_ORGANIZATION_MEMBER_STATUS, errMsg);
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
        //if Organization Member Status updated
      } else {
        if (updateOrganizationMemberID) {
          return response.status(200).json({
            success: true,
            data: updateOrganizationMemberID,
            errMsg: null,
          });
        } else {
          // If Organization Member Status not updated
          return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_NO_ORGANIZATION_MEMBER_FOUND,
          });
        }
      }
    }
  );
});



/*
Author     : Abhijith JS
Date       : 20 August 2024
Purpose    : Route for fetching count of user's Organization
parameter  : dataPassed
return type: response object
*/
router.get("/api/user/Organization/count", (request, response) => {
  let userID = request.headers.userID;
  if (validator.isNullOrEmpty(userID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOUSERID,
    });
  }
 
  getUserOrganizationCount.getLocation(dataPassed, (regionData, errMsg) => {
    if (errMsg) {
      // If any error occurs while finding region
      console.error(errorMessages.ERROR_FETCHING_REGIONDETAILS, errMsg);
      return response.status(404).json({
        success: false,
        data: null,
        errMsg: errMsg,
      });
    } else {
      // If region details fetched successfully
      return response.status(200).json({
        success: true,
        data: regionData,
        errMsg: null,
      });
    }
  });
});



/*
Author     : ABHIJITH JS
Date       : 25 November 2024
Purpose    : Route for checking, to display Apply,Revoke membership button required or not
parameter  : organizationID
return type: response object
*/
/**
 * @swagger
 * /api/disable/applyMembership/{organizationID}:
 *   get:
 *     tags:
 *       - : "CommonAPIs"
 *     summary: Check Membership Application Button Status
 *     description: Retrieves the status for enabling or disabling the "Apply Membership" button for a specific organization.
 *     parameters:
 *       - in: path
 *         name: organizationID
 *         schema:
 *           type: string
 *           example: "12345"
 *         required: true
 *         description: The unique ID of the organization.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authorization.
 *     responses:
 *       200:
 *         description: Successfully retrieved the status of the "Apply Membership" button.
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
 *                   example:
 *                     isButtonDisabled: true
 *                     reason: "Membership applications are currently disabled."
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       404:
 *         description: Organization ID not provided or status not found.
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
 *                   example: "ERROR_NOORGANIZATION_ID"
 *       500:
 *         description: Internal server error occurred while processing the request.
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
 *                   example: "An unexpected error occurred while fetching the status."
 */
router.get("/api/disable/applyMembership/:organizationID", (request, response) => {
  let organizationID = request.params.organizationID;
  const userID = request.headers.userID;
  if (validator.isNullOrEmpty(organizationID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOORGANIZATION_ID,
    });
  }
  const dataPassed = { organizationID, userID }

  requireApplyMembershipButtonService.requireApplyMembershipButton(dataPassed, (ApplyMembershipButtonData, errMsg) => {
    if (errMsg) {
      // If any error occurs while checking status
      console.error(errorMessages.ERROR_ORGANIZATION_MEMBERSTATUS, errMsg);
      return response.status(404).json({
        success: false,
        data: null,
        errMsg: errMsg,
      });
    } else {
      // If status and data fetched successfully
      return response.status(200).json({
        success: true,
        data: ApplyMembershipButtonData,
        errMsg: null,
      });
    }
  });
});



/*
Author     : Abhijith JS
Date       : 28 November 2024
Purpose    : Route for searching organization List
parameter  : searchOrganizationListData
return type: callback
*/
/**
 * @swagger
 * /api/organization/list:
 *   post:
 *     tags:
 *       - : "CommonAPIs"
 *     summary: "List Organizations"
 *     description: |
 *       Fetch a list of organizations based on search criteria and pagination.
 *       Organization search criteria:
 *       | Key               | Value                   | Description                                |
 *       |-------------------|-------------------------|--------------------------------------------|
 *       | organizationName  | eg., "testOrg" (String) | Name of the organization                   |
 *       | organizationID    | eg., "123" (string)     | Unique ID of the organization              |
 *       | type              | eg., "O" (String)       | Type of organization ("O" or "M")          |
 *       | userID            | eg., 456 (Integer)      | Unique ID of the user (passed in header)   |
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authorization.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: The current page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page for pagination.
 *       - in: body
 *         name: body
 *         description: Organization search criteria.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationName:
 *               type: string
 *               description: Name of the organization.
 *             organizationID:
 *               type: string
 *               description: Unique ID of the organization.
 *             type:
 *               type: string
 *               description: Type of organization ("O" or "M").
 *           example: # Sample object
 *             organizationName: "TechCorp"
 *             organizationID: "101"
 *             type: "O"
 *     responses:
 *       200:
 *         description: Successfully retrieved organization list.
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
 *                     organizationListDetails:
 *                       type: array
 *                       description: List of organization details.
 *                       items:
 *                         type: object
 *                         properties:
 *                           organizationID:
 *                             type: integer
 *                             example: 101
 *                           organizationName:
 *                             type: string
 *                             example: "TechCorp"
 *                           total_count:
 *                             type: integer
 *                             description: Total number of organizations matching the criteria.
 *                             example: 25
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
 *                       description: Number of organizations returned in the current page.
 *                       example: 10
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Missing or invalid userID in the header.
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
 *                   example: "ERROR_NOUSERID"
 *       500:
 *         description: Internal server error during organization listing.
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
 *                   example: "Unexpected server error."
 */
router.post("/api/organization/list", (request, response) => {
  //storing organization data from request body to variables
  const {
    organizationName,
    organizationID,
    type
  } = request.body;
  const { page, pageSize } = request.query;
  const userID = request.headers.userID;

        if (validator.isNullOrEmpty(userID)) {
            return response.status(400).json({
              success: false,
              data: null,
              errMsg: errorMessages.ERROR_NOUSERID,
            });
        }

  //storing organization data into organization's object
  const searchOrganizationListData = {
    organizationName,
    organizationID,
    type,
    userID,
  };

  organizationListServices.searchOrganizationList(
    searchOrganizationListData,
    userID,
    page,
    pageSize,
    (organizationListDetails, errMsg) => {
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
        if (organizationListDetails) {

          const totalCount = organizationListDetails.length > 0 ? organizationListDetails[0].total_count : 0;
          const count = organizationListDetails.length;
          const totaldata = {organizationListDetails, page, pageSize, totalCount, count };

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
            errMsg: errorMessages.ERROR_NO_ORGANIZATIONFOUND,
          });
        }
      }
    }
  );
});



/*
Author     : ABHIJITH JS
Date       : 02 December 2024
Purpose    : route for updating notification status
parameter  : status,notificationID
return type: notificationID int
*/
/**
 * @swagger
 * /api/notification/status/update:
 *   put:
 *     tags:
 *       - : "Notification"
 *     summary: Update Notification Status
 *     description: |
 *       Updates the status of a notification. All fields except `notes` are required for the update.
 *       | Key                | Value                            | Description                                    |
 *       |--------------------|----------------------------------|------------------------------------------------|
 *       | notificationID     | eg., "1" (integer)               | ID of the notification to update *             |
 *       | statusID           | eg., "57" (integer)              | ID of the status to be updated *               |
 *       | status             | eg., "Active" (string)           | Status of the notification *                   |
 *       | notes              | eg., "Marked as read" (string)   | Optional notes for the status update           |
 *       | userID             | eg., "12" (integer)              | ID of the user performing the update *         |
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
 *         description: Notification status update data
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - notificationID
 *             - statusID
 *             - status
 *             - userID
 *           properties:
 *             notificationID:
 *               type: string
 *               description: The ID of the notification to update.
 *               example: "5"
 *             statusID:
 *               type: string
 *               description: The ID of the status to be updated.
 *               example: "57"
 *             status:
 *               type: string
 *               description: The new status of the notification.
 *               example: "Active"
 *             notes:
 *               type: string
 *               description: Optional notes for the status update.
 *               example: "Marked as read"
 *     responses:
 *       200:
 *         description: Successfully updated the notification status
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
 *                   description: Updated notification ID
 *                   example: "12345"
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
 *       404:
 *         description: Notification not found
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
 *                   example: "ERROR_NO_NOTIFICATION_FOUND"
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
 *                   example: "ERROR_INTERNAL_SERVER_ERROR"
 */
router.put("/api/notification/status/update", (request, response) => {
  const { notificationID, statusID, status, notes } = request.body;
  const userID = request.headers.userID;

  const updateNotificationStatusData = {
    notificationID,
    statusID,
    status,
    notes,
    userID
  };

  if (validator.isNullOrEmpty(userID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOUSERID,
    });
  }

  if (
    validator.isNullOrEmpty(statusID) &&
    validator.isNullOrEmpty(status) &&
    validator.isNullOrEmpty(updateNotificationStatusData)
  ) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ALLFIELDMISSING,
    });
  }

  notificationServices.updateNotificationStatus(
    updateNotificationStatusData,
    (data, errMsg) => {
      //If an error occured during the update
      if (errMsg) {
        console.error(errorMessages.ERROR_UPDATING_NOTIFICATION_STATUS, errMsg);
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
        //if Notification Status updated
      } else {
        if (data) {
          return response.status(200).json({
            success: true,
            data: data,
            errMsg: null,
          });
        } else {
          // If Notification Status not updated
          return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_FETCHING_NOTIFICATION_DETAILS,
          });
        }
      }
    }
  );
});



/*
Author     : Abhijith JS
Date       : 19 December 2024
Purpose    : Route for sending otp via gmail to reset when user forgot password
parameter  : resetData 
return type: data
*/
/**
 * @swagger
 * /api/reset/password:
 *   post:
 *     tags:
 *       - : "User"
 *     summary: Send Password Reset OTP
 *     description: Sends a password reset OTP to the user's email address.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Request body to send the OTP.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: "user@example.com"
 *               description: The email address of the user.
 *             action:
 *               type: string
 *               example: "Forgot Password"
 *               description: The action to be performed (e.g., reset password).
 *             userSettingsType:
 *               type: string
 *               example: "Password"
 *               description: The type of user settings associated with the request.
 *     responses:
 *       200:
 *         description: Password reset OTP sent successfully.
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
 *                     isMessageSent:
 *                       type: boolean
 *                       example: true
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Missing or invalid input parameters.
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
 *       404:
 *         description: User details not found or an error occurred while sending the OTP.
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
 *                   example: "ERROR_FETCHING_USERDETAILS"
 *       500:
 *         description: Internal server error.
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
 *                   example: "An unexpected error occurred."
 */
router.post("/api/reset/password", (request, response) => {
  const { email, action, userSettingsType } = request.body;

  if (validator.isNullOrEmpty(email) || validator.isNullOrEmpty(action) || validator.isNullOrEmpty(userSettingsType)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ALLFIELDMISSING,
    });
  }

  const resetData = { email, action, userSettingsType };

  passwordServices.sendPasswordOtp(resetData, (info, errMsg) => {
    if (errMsg) {
      console.error(errorMessages.ERROR_FETCHING_USERDETAILS, errMsg);
      return response.status(404).json({
        success: false,
        data: null,
        errMsg,
      });
    }
// Check if messageId exists and is valid
const isMessageSent = info?.messageId && info.messageId.trim() !== "";
return response.status(200).json({
      success: true,
      data: {isMessageSent},
      errMsg: null,
    });
  });
});



/*
Author     : Abhijith JS
Date       : 23 December 2024
Purpose    : Route for saving new password
parameter  : updateData 
return type: userID int
*/
/**
 * @swagger
 * /api/update/password:
 *   post:
 *     tags:
 *       - : "User"
 *     summary: Update User Password
 *     description: Updates the user's password. If an `existingPassword` is provided, it will validate the current password before updating.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Request body containing new and optional existing passwords.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             newPassword:
 *               type: string
 *               example: "NewPassword123!"
 *               description: The new password for the user.
 *             existingPassword:
 *               type: string
 *               example: "ExistingPassword123!"
 *               description: The existing password of the user (optional).
 *     responses:
 *       200:
 *         description: Password updated successfully.
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
 *                   example: null
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Missing required fields or invalid input.
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
 *                   example: "ERROR_NOUSERID"
 *       500:
 *         description: Internal server error while updating the password.
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
 *                   example: "ERROR_UPDATING_PASSWORD"
 */
router.post("/api/update/password", (request, response) => {
  const { newPassword, existingPassword } = request.body;

  const userID = request.headers.userID;
    // Validate userID
    if (validator.isNullOrEmpty(userID)) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_NOUSERID,
      });
    }
  // Validate input
  if (validator.isNullOrEmpty(existingPassword) && validator.isNullOrEmpty(newPassword)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ALLFIELDMISSING,
    });
  }
  let encryptedExistingPassword;
  let encryptedNewPassword = encryptPassword(newPassword);

  if(!validator.isNullOrEmpty(existingPassword)){
     encryptedExistingPassword = encryptPassword(existingPassword);
  }
  const updateData = { userID, encryptedNewPassword, encryptedExistingPassword };

  // Update password
  passwordServices.updatePassword(updateData, (isUpdated, errMsg) => {
    if (errMsg) {
      console.error(errorMessages.ERROR_UPDATING_PASSWORD, errMsg);
      return response.status(500).json({
        success: false,
        data: null,
        errMsg,
      });
    }
    else {
    return response.status(200).json({
      success: true,
      data: {isUpdated},
      errMsg: isUpdated ? null : errorMessages.ERROR_UPDATING_PASSWORD,
    });
  }
  });
});



/*
Author     : Abhijith JS
Date       : 19 December 2024
Purpose    : Route for validating otp recieved via gmail to reset forgotten password
parameter  : validateDetails 
return type: data
*/
/**
 * @swagger
 * /api/validateTemporaryPassword:
 *   post:
 *     tags:
 *       - : "User"
 *     summary: Validate Temporary Password (OTP)
 *     description: Validates a temporary password (OTP) for the user's email.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Request body containing email and OTP for validation.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: "user@example.com"
 *               description: The user's email address.
 *             otp:
 *               type: string
 *               example: "123456"
 *               description: The one-time password (OTP) to validate.
 *     responses:
 *       200:
 *         description: Temporary password validated successfully.
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
 *                     isPasswordMatch:
 *                       type: boolean
 *                       example: true
 *                       description: Indicates if the temporary password matches.
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Missing or invalid input parameters.
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
 *         description: Internal server error during validation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: array
 *                   example: []
 *                 errMsg:
 *                   type: string
 *                   example: "ERROR_NOUSER"
 */
router.post("/api/validateTemporaryPassword", (request, response) => {
  //Store data from request.body to the variables
  const { email, otp } = request.body;
  const validateDetails = { email, otp };

  if (validator.isNullOrEmpty(email) || validator.isNullOrEmpty(otp)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ALLFIELDMISSING,
    });
  }

  passwordServices.validateTemporaryPassword(
    validateDetails,
    (result, errMsg) => {
      //If an error occured during the search
      if (errMsg) {
        console.error(errorMessages.ERROR_NOUSER, errMsg);
        return response.status(500).json({
          success: false,
          data: [],
          errMsg: errMsg,
        });
        //if users found
      } else {
          return response.status(200).json({
            success: true,
            data: result,
            errMsg: null,
          });
      }
    }
  );
});



/*
Author     : Abhijith JS
Date       : 24 December 2024
Purpose    : Route for checking access to edit,select,etc buttons
parameter  : dataPassed
return type: accessData  response object
*/
router.get("/api/accessCheck/:editType/organization/:organizationID", (request, response) => {

  let organizationID = request.params.organizationID;
  let editType = request.params.editType;
  const userID = request.headers.userID;
  const roleID = request.headers.roleID;

  if (validator.isNullOrEmpty(organizationID) || validator.isNullOrEmpty(editType) || validator.isNullOrEmpty(roleID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ALLFIELDMISSING,
    });
  }
      // Validate userID
      if (validator.isNullOrEmpty(userID)) {
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_NOUSERID,
        });
      }
  const dataPassed = { editType, organizationID, userID, roleID };

  commonFunctions.accessCheckServices(dataPassed, (accessData, errMsg) => {
    if (errMsg) {
      // If any error occurs while checking organization
      console.error(errorMessages.ERROR_NO_ACCESSFOUND, errMsg);
      return response.status(404).json({
        success: false,
        data: null,
        errMsg: errMsg,
      });
    } else {
      // If status and data fetched successfully
      return response.status(200).json({
        success: true,
        data: accessData,
        errMsg: null,
      });
    }
  });
});



/*
Author     : Abhijith JS
Date       : 24 December 2024
Purpose    : To make a member of an organization as Admin/notAdmin
parameter  : roleDataPassed
return type: boolean
*/
router.post("/api/user/organization/isAdmin", (request, response) => {

  let { organizationID, isAdmin, userID } = request.body;  
 
  let currentUserID = request.headers.userID;

  if (validator.isNullOrEmpty(organizationID) || validator.isNullObject(isAdmin) || validator.isNullOrEmpty(userID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ALLFIELDMISSING,
    });
  }
      // Validate userID
      if (validator.isNullOrEmpty(userID)) {
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_NOUSERID,
        });
      }
  const roleDataPassed = { organizationID, isAdmin, userID, currentUserID };

  commonFunctions.roleChangeServices(roleDataPassed, (success, errMsg) => {
    if (errMsg) {
      // If any error occurs while checking organization
      console.error(errorMessages.ERROR_UPDATING_ORGANIZATION_MEMBER, errMsg);
      return response.status(404).json({
        success: false,
        data: null,
        errMsg: errMsg,
      });
    } else if(success){
      // If status and data fetched successfully
      return response.status(200).json({
        success: true,
        data: true,
        errMsg: null,
      });
    }
  });
});



  module.exports = router;
