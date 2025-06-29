const express = require("express");
const router = express.Router();
const organizationDepartmentService = require("../services/organizationDepartment");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");




/*
Author     : Abhijith JS
Date       : 15 October 2024
Purpose    : route for creating new organization department
parameter  : organizationDepartmentData
return type: organizationDepartmentID int
*/
/**
 * @swagger
 * /api/organization/department:
 *   post:
 *     tags:
 *       - : "Organization Department"
 *     summary: "Add a new department to an organization"
 *     description: |
 *       Add a new department to an organization. The following data must be provided:
 *       
 *       | Key                    | Value                  | Description                             |
 *       |------------------------|------------------------|-----------------------------------------|
 *       | organizationID         | eg., 1 (integer)       | ID of the organization                  |
 *       | departmentName         | eg., "Dep3" (string)   | Name of the department                  |
 *       | userID                 | eg., 2 (integer)       | ID of the user creating the department  |
 *       | parentDepartmentId     | eg., 3 (integer)       | ID of the department                    |
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
 *         description: Organization department data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationID:
 *               type: integer
 *               example: 49
 *               description: ID of the organization
 *             departmentName:
 *               type: string
 *               example: "Dep3"
 *               description: Name of the department
 *             userID:
 *               type: integer
 *               example: 1
 *               description: ID of the user creating the department
 *             parentDepartmentId :
 *               type: integer
 *               example: 1
 *               description: ID of the department
 *     responses:
 *       201:
 *         description: Successfully created organization department
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
 *                   description: ID of the newly created organization department
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

router.post("/api/organization/department", (request, response) => {
    //getting new organization department details from request body
    const { organizationID, departmentName, userID, parentDepartmentId  } = request.body;
  
    //validating if any fields are missing data
    if (validator.isNullOrEmpty(organizationID) || validator.isNullOrEmpty(departmentName)) {
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
  
    //passing organization department data into an object
    const organizationDepartmentData = { organizationID, departmentName, userID, parentDepartmentId };
  
    organizationDepartmentService.saveorganizationDepartment(
        organizationDepartmentData,
      (organizationDepartmentID, errMsg) => {
        if (errMsg) {
          console.error(errorMessages.ERROR_SAVINGORGANIZATIONDEPARTMENT, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else {
          return response.status(201).json({
            success: true,
            data: organizationDepartmentID,
            errMsg: null,
          });
        }
      }
    );
  });



/*
Author     : Abhijith JS
Date       : 16 October 2024
Purpose    : route for search organization departments.
parameter  : searchOrganizationDepartmentData
return type: array of organization department Details
*/
/**
 * @swagger
 * /api/search/organization/department:
 *   post:
 *     tags:
 *       - : "Organization Department"
 *     summary: "Search Organization Departments"
 *     description: |
 *       Use this API to search for organization departments by providing the necessary filters. 
 *       You can use a combination of the following fields to perform the search:
 *       
 *       | Key                | Value                        | Description                     |
 *       |--------------------|------------------------------|---------------------------------|
 *       | organizationName    | eg., "test6" (String)       | Name of the organization        |
 *       | departmentName      | eg., "Dep1" (String)        | Name of the department          |
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
 *         description: Number of departments per page
 *         required: false
 *       - in: body
 *         name: body
 *         description: Organization department search criteria
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationName:
 *               type: string
 *               example: "test6"
 *             departmentName:
 *               type: string
 *               example: "Dep1"
 *     responses:
 *       200:
 *         description: Successfully fetched organization department data
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
 *                     organizationDepartmentDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                       description: Organization department details
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
 *                   example: ERROR_INTERNAL_SERVER_ERROR
 */

router.post("/api/search/organization/department", (request, response) => {
  //storing organizationdepartment data from request body to variables
  const { organizationName,departmentName} = request.body;
  const { page, pageSize } = request.query;

  //storing organizationdepartment data into organization's object
    const searchOrganizationDepartmentData = { organizationName,departmentName};

    organizationDepartmentService.searchorganizationDepartment(
    searchOrganizationDepartmentData,
    page,
    pageSize,
    (organizationDepartmentDetails, errMsg) => {
      //If an error occured during the search
      if (errMsg) {
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_DETAILS, errMsg);
        return response.status(500).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
        //if organizationdepartments found
      } else {        
        if (organizationDepartmentDetails) {

          const totalCount = organizationDepartmentDetails.length > 0 ? organizationDepartmentDetails[0].total_count : 0;
          const count = organizationDepartmentDetails.length;
          const totaldata = {organizationDepartmentDetails, page, pageSize, totalCount, count };

          return response.status(200).json({
            success: true,
            data: totaldata,
            errMsg: null,
          });
        } else {
          // If no organization departments were found
          return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_DETAILS,
          });
        }
      }
    }
  );
});


/*
Author     : Abhijith JS
Date       : 17 October 2024
Purpose    : route for getting organization department by ID.
parameter  : id
return type: object - organization department
*/
/**
 * @swagger
 * /api/get/organization/department/{id}:
 *   get:
 *     tags:
 *       - : "Organization Department"
 *     summary: "Get Organization Department details"
 *     description: |
 *       Retrieve details of an organization department by its ID.
 *       | Key            | Value                          | Description                                    |
 *       |----------------|--------------------------------|------------------------------------------------|
 *       | id             | eg.,"5"(ID)                    | ID of the Organization department to retrieve  |
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
 *         description: ID of the Organization department to retrieve
 *     responses:
 *       200:
 *         description: Successfully fetched Organization department details
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
 *                   description: Organization department details
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: OrganizationDepartmentID not found
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
 *                   example: ERROR_NOORGANIZATION_DEPARTMENT_ID
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
 *                   example: ERROR_FETCHING_ORGANIZATION_DEPARTMENT_DETAILS
 */

router.get("/api/get/organization/department/:id", (request, response) => {

  const organizationDepartmentID = request.params.id;
  
  if (validator.isNullOrEmpty(organizationDepartmentID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOORGANIZATION_DEPARTMENT_ID,
    });
  }
  organizationDepartmentService.getOrganizationDepartmentByID(
    organizationDepartmentID,
    (organizationDepartmentData, errMsg) => {
      if (errMsg) {
        // If any error occurs while finding organizationdepartment
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_DETAILS, errMsg);
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If organizationdepartment details fetched successfully
        return response.status(200).json({
          success: true,
          data: organizationDepartmentData,
          errMsg: null,
        });
      }
    }
  );
});




/*
Author     : Abhijith JS
Date       : 21 October 2024
Purpose    : route for delete organization department.
parameter  : organizationDepartmentID
return type: Boolean
*/
/**
 * @swagger
 * /api/organization/department/{id}:
 *   delete:
 *     tags:
 *       - : "Organization Department"
 *     summary: "Delete Organization Department"
 *     description: |
 *       To delete an Organization Department
 *       | Key            | Value                          | Description                                      |
 *       |----------------|--------------------------------|--------------------------------------------------|
 *       | id             | eg.,"2"(ID)                    | ID to match and delete organization department   |
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
 *         description: ID of the Organization Department to delete
 *     responses:
 *       200:
 *         description: Successfully deleted Organization Department
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
 *                   description: OrganizationDepartmentID
 *                 errMsg:
 *                   type: string
 *                   example: null or ERROR_NO_ORGANIZATIONDEPARTMENTFOUND
 *       400:
 *         description: Organization Department not found
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
 *         description: OrganizationDepartmentID not found
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
 *                   example: ERROR_NOORGANIZATION_DEPARTMENT_ID
 */
router.delete("/api/organization/department/:id", (request, response) => {
  const organizationDepartmentID = request.params.id;

  if (validator.isNullOrEmpty(organizationDepartmentID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOORGANIZATION_DEPARTMENT_ID,
    });
  } else {
    organizationDepartmentService.deleteOrganizationDepartment(
      organizationDepartmentID,
      (success, errMsg) => {
        if (errMsg) {
          // If any error occurs while deleting
          console.error(
            errorMessages.ERROR_DELETING_ORGANIZATION_DEPARTMENT,
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
            errMsg: errorMessages.ERROR_FINDING_ORGANIZATION_DEPARTMENT_BYID,
          });
        }
      }
    );
  }
});



/*
Author     : Abhijith JS
Date       : 22 October 2024
Purpose    : route for updating organization department
parameter  : organization department details with organizationDepartmentID
return type: updateOrganizationDepartmentData
*/
/**
 * @swagger
 * /api/organization/department/{organizationDepartmentID}:
 *   put:
 *     tags:
 *       - : "Organization Department"
 *     summary: "Update organization department"
 *     description: |
 *       To update the Organization Department.
 *       Required fields:
 *       | Key                        | Value                            | Description                         |
 *       |----------------------------|----------------------------------|-------------------------------------|
 *       | organizationID             | eg., 1 (integer)                 | ID of the organization              |
 *       | departmentName             | eg., "Finance" (string)          | Name of the department              |
 *       | organizationDepartmentID   | eg., "7" (string)                | ID of the department to be updated  |
 *       | parentDepartmentId         | eg., "1" (integer)               | ID of the parent department         |
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *            type: string
 *         required: true
 *       - in: path
 *         name: organizationDepartmentID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the organization department to update
 *       - in: body
 *         name: body
 *         description: Organization department object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             organizationID:
 *               type: integer
 *             departmentName:
 *               type: string
 *             parentDepartmentId:
 *               type: integer
 *           example: # Sample object
 *             organizationID: 1
 *             departmentName: "Finance"
 *             parentDepartmentId: 1
 *     responses:
 *       200:
 *         description: Successfully updated organization department details
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
 *                   description: Updated organization department ID
 *                 errMsg:
 *                   type: string
 *                   example: null or ERROR_FETCHING_ORGANIZATION_DEPARTMENT_DETAILS
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
 *                   example: ERROR_ALLFIELDMISSING or ERROR_USERIDMISSING
 */
router.put("/api/organization/department/:organizationDepartmentID", (request, response) => {
  const { departmentName, organizationID, parentDepartmentId }  = request.body;
  const userID = request.headers.userID;
  const organizationDepartmentID = request.params.organizationDepartmentID;

  const updateOrganizationDepartmentData = {
    organizationDepartmentID,
    organizationID,
    departmentName,
    userID,
    parentDepartmentId
  };

  if (validator.isNullOrEmpty(organizationDepartmentID) || validator.isNullOrEmpty(organizationID) || validator.isNullOrEmpty(departmentName)) {
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

  organizationDepartmentService.updateOrganizationDepartment(
    updateOrganizationDepartmentData,
    (updateOrganizationDepartmentID, errMsg) => {
      // If an error occurred during the update
      if (errMsg) {
        console.error(errorMessages.ERROR_UPDATING_ORGANIZATION_DEPARTMENT, errMsg);
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        if (updateOrganizationDepartmentID) {
          return response.status(200).json({
            success: true,
            data: updateOrganizationDepartmentID,
            errMsg: null,
          });
        } else {
          // If department not updated
          return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_FETCHING_ORGANIZATION_DEPARTMENT_DETAILS,
          });
        }
      }
    }
  );
});




  module.exports = router;