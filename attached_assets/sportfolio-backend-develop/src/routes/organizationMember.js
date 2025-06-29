const express = require("express");
const router = express.Router();
const organizationMemberService = require("../services/organizationMember");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");



/**
     * @swagger
     * /api/organization/member:
     *   post:
     *     tags:
     *       - : "Organization Member"
     *     summary: "Add new organization member"
     *     description: |
     *       Add new Organization
     *       Organization data:
     *       | Key                      | Value                                  | Description                     |
     *       |--------------------------|----------------------------------------|---------------------------------|
     *       | organizationID           | eg., 1 (integer)                       | Organization Id                 |
     *       | memberID                 | eg., "1" (integer)                     | Member Id                       |
     *       | isOrganizationInitiated  | eg., "1" or "0" (string)               | member ID                       |
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
     *                  type: integer
     *               memberID:
     *                  type: integer
     *               isOrganizationInitiated:
     *               type: string
     *               example: "0"
     *            example: # Sample object
     *               organizationID: 1
     *               memberID: 1
     *               isOrganizationInitiated: 0
     *     responses:
     *       200:
     *         description: Successfully created organization member detail
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
     *                   description: Organization member response data
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
Author     : Varun H M
Date       : 08 October 2024
Purpose    : route for creating new organization member
parameter  : organizationID and memberId in request body
return type: organizationMemberID int
*/
router.post("/api/organization/member", (request, response) => {
  //getting new organization details from request body
  const { organizationID, memberID, isOrganizationInitiated } = request.body;

  //validating if any fields are missing data
  if (validator.isNullOrEmpty(organizationID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOORGANIZATION_ID,
    });
  }

  if (validator.isNullOrEmpty(memberID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NO_MEMBER_ID,
    });
  }

  //passing organization data into an object
  const organizationMemberData = { organizationID, memberID, isOrganizationInitiated };

  organizationMemberService.saveOrganizationMember(
    organizationMemberData,
    (organizationMemberID, errMsg) => {
      if (errMsg) {
        console.error(errorMessages.ERROR_SAVINGORGANIZATIONMEMBER, errMsg);
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        return response.status(201).json({
          success: true,
          data: organizationMemberID,
          errMsg: null,
        });
      }
    }
  );
});


/**
     * @swagger
     * /api/organization/member/{organizationMemberID}:
     *   put:
     *     tags:
     *       - : "Organization Member"
     *     summary: "Update organization member"
     *     description: |
     *       To update the Organization
     *       Organization data:
     *       | Key                      | Value                                  | Description                     |
     *       |--------------------------|----------------------------------------|---------------------------------|
     *       | organizationID           | eg., 1 (integer)                       | organization ID                 |
     *       | memberID                 | eg., 1 (integer)                       | member ID                       |
     *       | isOrganizationInitiated  | eg., "1" or "0" (string)               | member ID                       |
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         schema:
     *            type: string
     *         required: true
     *       - in: path
     *         name: organizationMemberID
     *         required: true
     *         schema:
     *           type: string
     *       - in: body
     *         name: body
     *         description: Organization object
     *         required: true
     *         schema:
     *            type: object
     *            properties:
     *               organizationID:
     *                  type: integer
     *               memberID:
     *                  type: integer 
     *               isOrganizationInitiated:
     *               type: string
     *               example: "0"
     *            example: # Sample object
     *               organizationID: 1
     *               memberID: 1
     *               isOrganizationInitiated: 0
     *     responses:
     *       200:
     *         description: Successfully updated Organization details
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
     *                   description: Organization details response data
     *                 errMsg:
     *                   type: string
     *                   example: null or ERROR_NOUSER_FOUND
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
     *                   type: object
     *                   example: null
     *                 errMsg:
     *                   type: string
     *                   example: ERROR_NOORGANIZATION_ID or ERROR_ALLFIELDMISSING or ERROR_INVALID_EMAIL
 */
/*
Author     : Varun H M
Date       : 08 October 2024
Purpose    : route for updating organization member
parameter  : organization member details with organizationMemberID
return type: organizationMemberID int
*/
router.put("/api/organization/member/:organizationMemberID", (request, response) => {
  const { organizationID, memberID, isOrganizationInitiated } = request.body;

  const organizationMemberID = request.params.organizationMemberID;

  const updateOrganizationMemberData = {
    organizationID,
    memberID,
    isOrganizationInitiated,
    organizationMemberID
  };

  if (validator.isNullOrEmpty(organizationMemberID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOORGANIZATION_MEMBER_ID,
    });
  } else if (
    validator.isNullOrEmpty(organizationID) &&
    validator.isNullOrEmpty(memberID) &&
    validator.isNullOrEmpty(organizationMemberID)
  ) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ALLFIELDMISSING,
    });
  }

  organizationMemberService.updateOrganizationMember(
    updateOrganizationMemberData,
    (updateOrganizationMemberID, errMsg) => {
      //If an error occured during the update
      if (errMsg) {
        console.error(errorMessages.ERROR_UPDATING_ORGANIZATION_MEMBER, errMsg);
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
        //if user updated
      } else {
        if (updateOrganizationMemberID) {
          return response.status(200).json({
            success: true,
            data: updateOrganizationMemberID,
            errMsg: null,
          });
        } else {
          // If user not updated
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

/**
     * @swagger
     * /api/get/organization/member/{id}:
     *   get:
     *     tags:
     *       - : "Organization Member"
     *     summary: "get Organization details"
     *     description: |
     *       To get Organization details
     *       | Key            | Value                          | Description                          |
     *       |----------------|--------------------------------|--------------------------------------|
     *       | id             | eg.,"2"(ID)                    | ID to match and fetch organization member   |
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         schema:
     *            type: string
     *         required: true
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the Organization member to retrieve
     *     responses:
     *       200:
     *         description: Successfully fetched Organization member
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
     *                   description: Organization member details
     *                 errMsg:
     *                   type: string
     *                   example: null
     *       400:
     *         description: OrganizationMemberID not found
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
Author     : Varun H M
Date       : 08 October 2024
Purpose    : route for getting organization member by ID.
parameter  : id
return type: object - organization member
*/

router.get("/api/get/organization/member/:id", (request, response) => {
  const organizationMemberID = request.params.id;

  if (validator.isNullOrEmpty(organizationMemberID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOORGANIZATION_MEMBER_ID,
    });
  }
  organizationMemberService.getOrganizationMemberByID(
    organizationMemberID,
    (organization, errMsg) => {
      if (errMsg) {
        // If any error occurs while finding user
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_MEMBER_DETAILS, errMsg);
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If user details fetched successfully
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
     * /api/organization/member/{id}:
     *   delete:
     *     tags:
     *       - : "Organization Member"
     *     summary: "delete Organization member"
     *     description: |
     *       To delete Organization
     *       | Key            | Value                          | Description                                 |
     *       |----------------|--------------------------------|---------------------------------------------|
     *       | id             | eg.,"2"(ID)                    | ID to match and delete organization member  |
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         schema:
     *            type: string
     *         required: true
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the Organization member to delete
     *     responses:
     *       200:
     *         description: Successfully deleted Organization member
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
     *                   description: OrganizationID
     *                 errMsg:
     *                   type: string
     *                   example: null or ERROR_NO_ORGANIZATIONMEMBERFOUND
     *       400:
     *         description: Organization not found
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
     *       404:
     *         description: OrganizationMemberID not found
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
     *                   example: ERROR_NOORGANIZATION_MEMBER_ID
 */
/*
Author     : Varun H M
Date       : 08 October 2024
Purpose    : route for deleting organization member
parameter  : id - int
return type: boolean- true/false
*/
router.delete("/api/organization/member/:id", (request, response) => {
  const organizationMemberID = request.params.id;

  if (validator.isNullOrEmpty(organizationMemberID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOORGANIZATION_MEMBER_ID,
    });
  } else {
    organizationMemberService.deleteOrganizationMember(
      organizationMemberID,
      (success, errMsg) => {
        if (errMsg) {
          // If any error occurs while deleting
          console.error(
            errorMessages.ERROR_DELETING_ORGANIZATION_MEMBER_DETAILS,
            errMsg
          );
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else if (success) {
          //user deleted successfully
          return response.status(200).json({
            success: true,
            data: true,
            errMsg: null,
          });
        } else {
          //No users found
          return response.status(200).json({
            success: false,
            data: false,
            errMsg: errorMessages.ERROR_NO_ORGANIZATIONMEMBERFOUND,
          });
        }
      }
    );
  }
});



/**
 * @swagger
 * /api/search/organization/member:
 *   post:
 *     tags:
 *       - : "Organization Member"
 *     summary: "Search organization member"
 *     description: |
 *       To search Organization members, provide the following details:
 *       Organization data:
 *       | Key                      | Value                                  | Description                      |
 *       |--------------------------|----------------------------------------|----------------------------------|
 *       | name                     | eg., "test6" (String)                  | Name of the organization         |
 *       | localBodyType            | eg., 1 (integer)                       | Local body type Id               |
 *       | localBody                | eg., 1 (integer)                       | Local body name Id               |
 *       | ward                     | eg., 1 (integer)                       | Ward Id                          |
 *       | district                 | eg., 1 (integer)                       | District Id                      |
 *       | state                    | eg., 1 (integer)                       | State Id                         |
 *       | postOffice               | eg., 1 (integer)                       | Post office Id                   |
 *       | pinCode                  | eg., "629173" (String)                 | Pincode                          |
 *       | organizationMemberID     | eg., 1 (integer)                       | Organization member Id           |
 *       | organizationID           | eg., 1 (integer)                       | Organization Id                  |
 *       | type                     | eg., "A" (String)                      | Fetch Status Types               |
 *       | isOrganizationInitiated  | eg., "0" or "1" (String)               | Fetch by isOrganizationInitiated |
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authorization
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
 *         description: Number of users per page
 *         required: false
 *       - in: body
 *         name: body
 *         description: Organization object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: "test6"
 *             lastName:
 *               type: string
 *               example: "test6"
 *             organizationName:
 *               type: string
 *               example: "test6"
 *             OrganizationID:
 *               type: integer
 *               example: 1
 *             memberID:
 *               type: integer
 *               example: 1
 *             localBodyType:
 *               type: integer
 *               example: 1
 *             localBody:
 *               type: integer
 *               example: 1
 *             type:
 *               type: string
 *               example: A
 *             isOrganizationInitiated:
 *               type: string
 *               example: "0"
 *             ward:
 *               type: integer
 *               example: 1
 *             district:
 *               type: integer
 *               example: 1
 *             state:
 *               type: integer
 *               example: 1
 *             postOffice:
 *               type: integer
 *               example: 1
 *             pinCode:
 *               type: string
 *               example: "629173"
 *             organizationMemberID:
 *               type: integer
 *               example: 1
 *             organizationID:
 *               type: integer
 *               example: 1
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
Author     : Varun H M
Date       : 08 October 2024
Purpose    : route for search organization members.
parameter  : searchOrganizationMemberData
return type: array organization Member Details
*/
router.post("/api/search/organization/member", (request, response) => {
  //storing organization data from request body to variables
  const { organizationMemberID, firstName, lastName, organizationID, organizationName, memberID , localBodyType, localBody, ward, district, state, postOffice, pinCode, type, isOrganizationInitiated } = request.body;
  const { page, pageSize } = request.query;
  const userID = request.headers.userID;


  //storing organization data into organization's object
    const searchOrganizationMemberData = { organizationMemberID, firstName, lastName, organizationID, organizationName, memberID,  localBodyType, localBody, ward, district, state, postOffice, pinCode, type, isOrganizationInitiated };

    organizationMemberService.searchOrganizationMember(
    searchOrganizationMemberData,
    userID,
    page,
    pageSize,
    (organizationMemberDetails, errMsg) => {
      //If an error occured during the search
      if (errMsg) {
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_MEMBER_DETAILS, errMsg);
        return response.status(500).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
        //if organization found
      } else {        
        if (organizationMemberDetails) {

          const totalCount = organizationMemberDetails.length > 0 ? organizationMemberDetails[0].total_count : 0;
          const count = organizationMemberDetails.length;
          const totaldata = {organizationMemberDetails, page, pageSize, totalCount, count };

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
            errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_MEMBER_DETAILS,
          });
        }
      }
    }
  );
});



/*
Author     : Abhijith JS
Date       : 08 November 2024
Purpose    : Route for fetching OrganizationMembersStatus count
parameter  : organizationID
return type: OrganizationMembersStatusData array
*/
/**
 * @swagger
 * /api/get/organizationMembers/status/{id}:
 *   get:
 *     tags:
 *       - : "Organization Member"
 *     summary: "Get Organization Members Status counts by Organization ID"
 *     description: Retrieves the status data of organization members based on the specified organization ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the organization to get member status data for.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved organization members' status data
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
 *                   description: The organization members' status data
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       404:
 *         description: Organization members' status data not found or error occurred
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
 *                   example: ERROR_FETCHING_ORGANIZATION_MEMBERS_STATUS_DETAILS
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
router.get("/api/get/organizationMembers/status/:id", (request, response) => {

  const organizationID = request.params.id;
  const userID = request.headers.userID;

  organizationMemberService.getOrganizationMembersStatusData(
    organizationID,
    userID,
    (OrganizationMembersStatusData, errMsg) => {
      if (errMsg) {
        // If any error occurs while finding OrganizationMembersStatusData
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_MEMBERS_STATUS_DETAILS, errMsg);
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If OrganizationMembersStatusData fetched successfully
        return response.status(200).json({
          success: true,
          data: OrganizationMembersStatusData,
          errMsg: null,
        });
      }
    }
  );
});


/**
 * @swagger
 * /api/organization/member/search:
 *   post:
 *     tags:
 *       - : "Organization Member"
 *     summary: "Search member details"
 *     description: |
 *       To search members, provide the following details:
 *       Member details:
 *       | Key                      | Value                                  | Description                      |
 *       |--------------------------|----------------------------------------|----------------------------------|
 *       | firstName                | eg., "test6" (String)                  | First name of the user           |
 *       | lastName                 | eg., "test6" (String)                  | Last name of the user            |
 *       | localBodyType            | eg., 1 (integer)                       | Local body type Id               |
 *       | localBody                | eg., 1 (integer)                       | Local body name Id               |
 *       | ward                     | eg., 1 (integer)                       | Ward Id                          |
 *       | district                 | eg., 1 (integer)                       | District Id                      |
 *       | state                    | eg., 1 (integer)                       | State Id                         |
 *       | postOffice               | eg., 1 (integer)                       | Post office Id                   |
 *       | pinCode                  | eg., "629173" (String)                 | Pincode                          |
 *       | organizationID           | eg., 1 (integer)                       | Organization Id                  |
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authorization
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
 *         description: Number of users per page
 *         required: false
 *       - in: body
 *         name: body
 *         description: Member object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: "test6"
 *             lastName:
 *               type: string
 *               example: "test6"
 *             localBodyType:
 *               type: integer
 *               example: 1
 *             localBody:
 *               type: integer
 *               example: 1
 *             ward:
 *               type: integer
 *               example: 1
 *             district:
 *               type: integer
 *               example: 1
 *             state:
 *               type: integer
 *               example: 1
 *             postOffice:
 *               type: integer
 *               example: 1
 *             pinCode:
 *               type: string
 *               example: "629173"
 *             organizationID:
 *               type: integer
 *               example: 1
 *     responses:
 *       200:
 *         description: Successfully get member details
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
 *                   description: User or member basic detail response data
 *                 errMsg:
 *                   type: string
 *                   example: null or ERROR_NOUSER
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
Author     : Varun H M
Date       : 12 November 2024
Purpose    : route for search user details.
parameter  : userDetailsData
return type: array of user details
*/
router.post("/api/organization/member/search", (request, response) => {
  //storing organization data from request body to variables
  const { firstName, lastName, organizationID , localBodyType, localBody, ward, district, state, postOffice, pinCode } = request.body;
  const { page, pageSize } = request.query;

  if (validator.isNullOrEmpty(organizationID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOORGANIZATION_ID,
    });
  }

  //storing organization data into organization's object
    const searchMemberData = { firstName, lastName, organizationID,  localBodyType, localBody, ward, district, state, postOffice, pinCode };

    organizationMemberService.searchMemberForOrganizationMember(
    searchMemberData,
    page,
    pageSize,
    (memberDetails, errMsg) => {
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
        if (memberDetails) {

          const totalCount = memberDetails.length > 0 ? memberDetails[0].total_count : 0;
          const count = memberDetails.length;
          const totaldata = {memberDetails, page, pageSize, totalCount, count };

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
            errMsg: errorMessages.ERROR_NOUSER,
          });
        }
      }
    }
  );
});


/*
Author     : Varun H M 
Date       : 27 December 2024
Purpose    : Route for updating the organization members as owner or not
parameter  : organizationID, userId, isOwner
return type: Success or Error message
*/
/**
 * @swagger
 * /api/organizationMembers/change/ownership:
 *   put:
 *     tags:
 *       - : "Organization Member"
 *     summary: "Update organization member ownership status"
 *     description: Update the organization member ownership status by organization id and member id.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Organization object
 *         required: true
 *         schema:
 *            type: object
 *            properties:
 *               organizationID:
 *                  type: integer
 *               userIDs:
 *                  type: string
 *               isOwner:
 *               type: string
 *            example: # Sample object
 *               organizationID: 1
 *               userIDs: '1,2,3'
 *               isOwner: 0
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Successfully updated organization member ownership status
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
 *                   description: The organization members' status data
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       404:
 *         description: Organization members' status data not found or error occurred
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
 *                   example: ERROR_FETCHING_ORGANIZATION_MEMBERS_STATUS_DETAILS
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
router.put("/api/organizationMembers/change/ownership", (request, response) => {

  const { organizationID, userIDs, isOwner } = request.body;


  const organizationMemberOwnershipDetails = { organizationID, userIDs, isOwner };

  organizationMemberService.updateOrganizationMemberOwnership(
    organizationMemberOwnershipDetails,
    (organizationMemberOwnershipData, errMsg) => {
      if (errMsg) {
        // If any error occurs while finding OrganizationMembersStatusData
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_MEMBERS_STATUS_DETAILS, errMsg);
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_UPDATE_ORGANIZATION_MEMBER_OWNERSHIP,
        });
      } else {
        // If OrganizationMembersStatusData fetched successfully
        return response.status(200).json({
          success: true,
          data: "Organization member ownership status updated successfully",
          errMsg: null,
        });
      }
    }
  );
});


module.exports = router;
