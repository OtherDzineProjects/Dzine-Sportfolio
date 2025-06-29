const express = require("express");
const router = express.Router();
const organizationDepartmentMemberService = require("../services/organizationDepartmentMember");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");




/*
Author     : Abhijith JS
Date       : 17 October 2024
Purpose    : route for creating new organization department member
parameter  : organizationDepartmentMemberData
return type: organizationDepartmentMemberID int
*/
/**
 * @swagger
 * /api/organization/departmentMember:
 *   post:
 *     tags:
 *       - : "Organization Department Member"
 *     summary: "Add a new member to an organization department"
 *     description: |
 *       Add a new member to an organization department. The following data must be provided:
 *       
 *       | Key                      | Value                | Description                                |
 *       |--------------------------|----------------------|--------------------------------------------|
 *       | organizationDepartmentID | eg., 1 (integer)     | ID of the organization department          |
 *       | memberID                 | eg., 2 (integer)     | ID of the user being added as a member     |
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
 *         description: Organization department member data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationDepartmentID:
 *               type: integer
 *               example: 49
 *               description: ID of the organization department
 *             memberID:
 *               type: integer
 *               example: 1
 *               description: ID of the user being added as a member
 *     responses:
 *       201:
 *         description: Successfully created organization department member
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
 *                   description: ID of the newly created organization department member
 *                   example: 101
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Bad request - missing or invalid fields
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
 *                   example: ERROR_ALLFIELDMISSING or ERROR_NOUSERID
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
router.post("/api/organization/departmentMember", (request, response) => {
    //getting new organization department member details from request body
    const { organizationDepartmentID, memberID } = request.body;

    //validating if any fields are missing data
    if (validator.isNullOrEmpty(organizationDepartmentID) && validator.isNullOrEmpty(memberID)) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_ALLFIELDMISSING,
      });
    }
    if (validator.isNullOrEmpty(memberID)) {
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_NOUSERID,
        });
    }

    //passing organization department member data into an object
    const organizationDepartmentMemberData = { organizationDepartmentID, memberID };

    organizationDepartmentMemberService.saveorganizationDepartmentMember(
      organizationDepartmentMemberData,
      (organizationDepartmentMemberID, errMsg) => {
        if (errMsg) {
          console.error(errorMessages.ERROR_SAVING_ORGANIZATIONDEPARTMENTMEMBER, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else {
          return response.status(201).json({
            success: true,
            data: organizationDepartmentMemberID,
            errMsg: null,
          });
        }
      }
    );
});


/*
Author     : Abhijith JS
Date       : 18 October 2024
Purpose    : route for search organization departmentMember.
parameter  : searchOrganizationDepartmentMemberData
return type: array organization departmentMember Details
*/
/**
 * @swagger
 * /api/search/organization/departmentMember:
 *   post:
 *     tags:
 *       - : "Organization Department Member"
 *     summary: "Search organization department members"
 *     description: |
 *       To search Organization department members, provide the following details:
 *       Organization department member data:
 *       | Key                          | Value                                  | Description                             |
 *       |------------------------------|----------------------------------------|-----------------------------------------|
 *       | firstName                    | eg., "John" (String)                   | First name of the department member     |
 *       | lastName                     | eg., "Doe" (String)                    | Last name of the department member      |
 *       | organizationID               | eg., 1 (Integer)                       | ID of the organization                  |
 *       | organizationName             | eg., "Org1" (String)                   | Name of the organization                |
 *       | memberID                     | eg., 1 (Integer)                       | ID of the member                        |
 *       | localBodyType                | eg., 1 (Integer)                       | Local body type ID                      |
 *       | localBody                    | eg., 1 (Integer)                       | Local body ID                           |
 *       | ward                         | eg., 1 (Integer)                       | Ward ID                                 |
 *       | district                     | eg., 1 (Integer)                       | District ID                             |
 *       | state                        | eg., 1 (Integer)                       | State ID                                |
 *       | postOffice                   | eg., 1 (Integer)                       | Post office ID                          |
 *       | pinCode                      | eg., "629173" (String)                 | Pincode                                 |
 *       | organizationDepartmentMemberID | eg., 1 (Integer)                     | Organization department member ID       |
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
 *         description: Number of records per page
 *         required: false
 *       - in: body
 *         name: body
 *         description: Organization department member search data
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: "John"
 *             lastName:
 *               type: string
 *               example: "Doe"
 *             organizationID:
 *               type: string
 *               example: 1
 *             organizationName:
 *               type: string
 *               example: "Org1"
 *             memberID:
 *               type: string
 *               example: 1
 *             localBodyType:
 *               type: string
 *               example: 5
 *             localBody:
 *               type: string
 *               example: 15
 *             ward:
 *               type: string
 *               example: 1
 *             district:
 *               type: string
 *               example: 13
 *             state:
 *               type: string
 *               example: 2
 *             postOffice:
 *               type: string
 *               example: 1
 *             pinCode:
 *               type: string
 *               example: "629173"
 *             organizationDepartmentMemberID:
 *               type: string
 *               example: 1
 *     responses:
 *       200:
 *         description: Successfully fetched organization department member details
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
 *                     organizationDepartmentMemberDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     totalCount:
 *                       type: integer
 *                       example: 100
 *                     count:
 *                       type: integer
 *                       example: 10
 *                 errMsg:
 *                   type: string
 *                   example: null
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
 *                   example: ERROR_FETCHING_ORGANIZATION_DEPARTMENT_MEMBER_DETAILS
 */
router.post("/api/search/organization/departmentMember", (request, response) => {
  // Storing organization department member data from request body to variables
  const {
    firstName,
    lastName,
    organizationID,
    organizationName,
    memberID,
    localBodyType,
    localBody,
    ward,
    district,
    state,
    postOffice,
    pinCode,
    organizationDepartmentMemberID,
  } = request.body;
  const { page, pageSize } = request.query;

  // Storing organization department member data into an object
  const searchOrganizationDepartmentMemberData = {
    firstName,
    lastName,
    organizationID,
    organizationName,
    memberID,
    localBodyType,
    localBody,
    ward,
    district,
    state,
    postOffice,
    pinCode,
    organizationDepartmentMemberID, 
  };

  organizationDepartmentMemberService.searchOrganizationDepartmentMember(
    searchOrganizationDepartmentMemberData,
    page,
    pageSize,
    (organizationDepartmentMemberDetails, errMsg) => {
      // If an error occurred during the search
      if (errMsg) {
        console.error(
          errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_MEMBER_DETAILS,
          errMsg
        );
        return response.status(500).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If organization department members found
        if (organizationDepartmentMemberDetails) {
          const totalCount =
            organizationDepartmentMemberDetails.length > 0
              ? organizationDepartmentMemberDetails[0].total_count
              : 0;
          const count = organizationDepartmentMemberDetails.length;
          const totaldata = {
            organizationDepartmentMemberDetails,
            page,
            pageSize,
            totalCount,
            count,
          };

          return response.status(200).json({
            success: true,
            data: totaldata,
            errMsg: null,
          });
        } else {
          // If no organization department members were found
          return response.status(200).json({
            success: false,
            data: null,
            errMsg:
              errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_MEMBER_DETAILS,
          });
        }
      }
    }
  );
});




/*
Author     : Abhijith JS
Date       : 18 October 2024
Purpose    : route for getting organization department member by ID.
parameter  : id
return type: object - organization department member
*/
/**
 * @swagger
 * /api/get/organization/departmentMember/{id}:
 *   get:
 *     tags:
 *       - : "Organization Department Member"
 *     summary: "Get Organization Department Member details"
 *     description: |
 *       Retrieve details of an organization department member by their ID.
 *       | Key            | Value                          | Description                                    |
 *       |----------------|--------------------------------|------------------------------------------------|
 *       | id             | eg.,"5"(ID)                    | ID of the Organization department member to retrieve  |
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
 *         description: ID of the Organization department member to retrieve
 *     responses:
 *       200:
 *         description: Successfully fetched Organization department member details
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
 *                   description: Organization department member details
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: OrganizationDepartmentMemberID not provided
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
 *                   example: ERROR_NO_ORGANIZATION_DEPARTMENT_MEMBER_ID
 *       404:
 *         description: Fetching Organization department member details failed
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
 *                   example: ERROR_FETCHING_ORGANIZATION_DEPARTMENT_MEMBER_DETAILS
 */
router.get("/api/get/organization/departmentMember/:id", (request, response) => {

  const organizationDepartmentMemberID = request.params.id;

  // Check if the organizationDepartmentMemberID is null or empty
  if (validator.isNullOrEmpty(organizationDepartmentMemberID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NO_ORGANIZATION_DEPARTMENT_MEMBER_ID, // Update error message key
    });
  }

  organizationDepartmentMemberService.getOrganizationDepartmentMemberByID(
    organizationDepartmentMemberID,
    (organizationDepartmentMemberData, errMsg) => {
      // If an error occurs while fetching the organizationDepartmentMember
      if (errMsg) {
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_MEMBER_DETAILS, errMsg); // Update error message key
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If organizationDepartmentMember details fetched successfully
        return response.status(200).json({
          success: true,
          data: organizationDepartmentMemberData,
          errMsg: null,
        });
      }
    }
  );
});





/*
Author     : Abhijith JS
Date       : 21 October 2024
Purpose    : route for delete organization departmentmember.
parameter  : organizationDepartmentMemberID
return type: Boolean
*/
/**
     * @swagger
     * /api/organization/departmentmember/{id}:
     *   delete:
     *     tags:
     *       - : "Organization Department Member"
     *     summary: "Delete Organization Department Member"
     *     description: |
     *       To delete an Organization Department Member
     *       | Key            | Value                          | Description                                         |
     *       |----------------|--------------------------------|-----------------------------------------------------|
     *       | id             | eg.,"2"(ID)                    | ID to match and delete organization department member |
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
     *         description: ID of the Organization Department Member to delete
     *     responses:
     *       200:
     *         description: Successfully deleted Organization Department Member
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
     *                   description: OrganizationDepartmentMemberID
     *                 errMsg:
     *                   type: string
     *                   example: null or ERROR_NO_ORGANIZATIONDEPARTMENTMEMBERFOUND
     *       400:
     *         description: Organization Department Member not found
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
     *         description: OrganizationDepartmentMemberID not found
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
     *                   example: ERROR_NOORGANIZATION_DEPARTMENT_MEMBER_ID
 */
router.delete("/api/organization/departmentmember/:id", (request, response) => {
  const organizationDepartmentMemberID = request.params.id;

  if (validator.isNullOrEmpty(organizationDepartmentMemberID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NO_ORGANIZATION_DEPARTMENT_MEMBER_ID,
    });
  } else {
    organizationDepartmentMemberService.deleteOrganizationDepartmentMember(
      organizationDepartmentMemberID,
      (success, errMsg) => {
        if (errMsg) {
          // If any error occurs while deleting
          console.error(
            errorMessages.ERROR_DELETING_ORGANIZATION_DEPARTMENT_MEMBER,
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
            errMsg: errorMessages.ERROR_FINDING_ORGANIZATION_DEPARTMENT_MEMBER_BYID,
          });
        }
      }
    );
  }
});




/*
Author     : Abhijith JS
Date       : 21 October 2024
Purpose    : route for updating organization departmentmember
parameter  : organization departmentmember details with organizationDepartmentMemberID
return type: updateOrganizationDepartmentMemberData
*/
/**
 * @swagger
 * /api/organization/departmentmember/{organizationDepartmentMemberID}:
 *   put:
 *     tags:
 *       - : "Organization Department Member"
 *     summary: "Update organization department member"
 *     description: |
 *       To update the Organization Department Member.
 *       Required fields:
 *       | Key                        | Value                            | Description                         |
 *       |----------------------------|----------------------------------|-------------------------------------|
 *       | organizationDepartmentID   | eg., 1 (integer)                 | ID of the organization department   |
 *       | memberID                   | eg., 1 (integer)                 | ID of the member                    |
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: organizationDepartmentMemberID
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: body
 *         description: Organization department member object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationDepartmentID:
 *               type: integer
 *             memberID:
 *               type: integer
 *           example: # Sample object
 *             organizationDepartmentID: 1
 *             memberID: 1
 *     responses:
 *       200:
 *         description: Successfully updated organization department member details
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
 *                   description: Updated organization department member ID
 *                 errMsg:
 *                   type: string
 *                   example: null or ERROR_NO_ORGANIZATION_DEPARTMENT_MEMBER_FOUND
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
 *                 errMsg:
 *                   type: string
 *                   example: ERROR_NO_ORGANIZATION_DEPARTMENT_MEMBER_ID or ERROR_ALL_FIELDS_MISSING
 */
router.put("/api/organization/departmentmember/:organizationDepartmentMemberID", (request, response) => {
  const { organizationDepartmentID, memberID } = request.body;

  const organizationDepartmentMemberID = request.params.organizationDepartmentMemberID;

  const updateOrganizationDepartmentMemberData = {
    organizationDepartmentID,
    memberID,
    organizationDepartmentMemberID
  };

  if (validator.isNullOrEmpty(organizationDepartmentMemberID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NO_ORGANIZATION_DEPARTMENT_MEMBER_ID,
    });
  } else if (
    validator.isNullOrEmpty(organizationDepartmentID) &&
    validator.isNullOrEmpty(memberID)
  ) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ALL_FIELDS_MISSING,
    });
  }

  organizationDepartmentMemberService.updateOrganizationDepartmentMember(
    updateOrganizationDepartmentMemberData,
    (updateOrganizationDepartmentMemberID, errMsg) => {
      // If an error occurred during the update
      if (errMsg) {
        console.error(errorMessages.ERROR_UPDATING_ORGANIZATION_DEPARTMENT_MEMBER, errMsg);
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        if (updateOrganizationDepartmentMemberID) {
          return response.status(200).json({
            success: true,
            data: updateOrganizationDepartmentMemberID,
            errMsg: null,
          });
        } else {
          // If department member not updated
          return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_NO_ORGANIZATION_DEPARTMENT_MEMBER_FOUND,
          });
        }
      }
    }
  );
});





module.exports = router;