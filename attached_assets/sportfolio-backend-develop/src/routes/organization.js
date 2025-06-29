const express = require("express");
const Validator = require("validator");
const router = express.Router();
const organizationServices = require("../services/organization");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const { authentication } = require("../common/authMiddleware");
const { getUploadMiddleware, deleteMultipleImages  } = require("../common/commonFunctions");

/**
     * @swagger
     * /api/search/organization:
     *   post:
     *     tags:
     *       - : "Organization"
     *     summary: "Search Organization"
     *     description: |
     *       To search Organization
     *       Organization data:
     *       | Key                    | Value                                  | Description                                   |
     *       |------------------------|----------------------------------------|-----------------------------------------------|
     *       | organizationName       | eg., "test6" (String)                  | Name of the organization                      |
     *       | organizationEmail      | eg., "test6@gmail.com" (String)        | Email of the organization                     |
     *       | organizationTypeID     | eg., "1" (integer)                     | Type ID of the organization                   |
     *       | registrationNumber     | eg., "123456" (String)                 | Registration number                           |
     *       | registrationValidFrom  | eg., "2023-01-01" (String)             | Registration valid from date                  |
     *       | registrationValidTo    | eg., "2024-01-01" (String)             | Registration valid to date                    |
     *       | inchargeName           | eg., "John" (String)                   | Name of the in-charge person                  |
     *       | inchargePhone          | eg., "9876543210" (integer)            | Phone number of in-charge                     |
     *       | inchargeEmail          | eg., "john@gmail.com" (String)         | Email of the in-charge                        |
     *       | website                | eg., "http://example.com" (String)     | Website of the organization                   |
     *       | phoneNumber            | eg., "74" (number)                     | Phone number                                  |
     *       | country                | eg., "1" (String)                      | Country                                       |
     *       | city                   | eg., "14" (String)                     | City                                          |
     *       | district               | eg., "13" (String)                     | District                                      |
     *       | state                  | eg., "2" (String)                      | State                                         |
     *       | localBodyType          | eg., "5" (String)                      | Type of local body                            |
     *       | localBodyName          | eg., "15" (String)                     | Name of local body                            |
     *       | wardName               | eg., "1" (String)                      | Ward name                                     |
     *       | postOffice             | eg., "2" (String)                      | Post office                                   |
     *       | pinCode                | eg., "695001" (integer)                | pinCode                                       |
     *       | userID                 | eg., "12" (integer)                    | User ID                                       |
     *       | type                   | eg., "O" (string)                      | fetch status type (type should be O or M)     |
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
     *               organizationTypeID:
     *                  type: integer
     *               registrationNumber:
     *                  type: string
     *               registrationValidFrom:
     *                  type: string
     *               registrationValidTo:
     *                  type: string
     *               inchargeName:
     *                  type: string
     *               inchargePhone:
     *                  type: integer
     *               inchargeEmail:
     *                  type: string
     *               website:
     *                  type: string
     *               phoneNumber:
     *                  type: integer 
     *               country:
     *                  type: string
     *               city:
     *                  type: string
     *               district:
     *                  type: string 
     *               state:
     *                  type: string 
     *               localBodyType:
     *                  type: string
     *               localBodyName:
     *                  type: string
     *               wardName:
     *                  type: string
     *               postOffice:
     *                  type: string
     *               pinCode:
     *                  type: integer
     *               userID:
     *                  type: integer
     *               type:
     *                  type: string
     *            example: # Sample object
     *               organizationName: "test6"
     *               organizationEmail: "test6@gmail.com"
     *               organizationTypeID: 1
     *               registrationNumber: "123456"
     *               registrationValidFrom: "2023-01-01"
     *               registrationValidTo: "2024-01-01"
     *               inchargeName: "John"
     *               inchargePhone: 9876543210
     *               inchargeEmail: "john@gmail.com"
     *               website: "http://example.com"
     *               phoneNumber: 7445678902
     *               country: "1"
     *               city: "14"
     *               district: "13"
     *               state: "2"
     *               localBodyType: "5"
     *               localBodyName: "15"
     *               wardName: "1"
     *               postOffice: "2"
     *               pinCode: 695001
     *               userID: 12
     *               type: "M"
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
Author     : Abhijith JS
Date       : 5 June 2024
Purpose    : route for search organizations.
parameter  : searchOrganizationData
return type: array organizationDetails
*/
router.post("/api/search/organization", (request, response) => {
  //storing organization data from request body to variables
  const {
    organizationName,
    organizationEmail,
    organizationTypeID,
    registrationNumber,
    registrationValidFrom,
    registrationValidTo,
    inchargeName,
    inchargePhone,
    inchargeEmail,
    website,
    phoneNumber,
    country,
    city,
    district,
    state,
    localBodyType,
    localBodyName,
    wardName,
    postOffice,
    pinCode,
    type
  } = request.body;
  const { page, pageSize } = request.query;

  //storing organization data into organization's object
  const searchOrganizationData = {
    organizationName,
    organizationEmail,
    organizationTypeID,
    registrationNumber,
    registrationValidFrom,
    registrationValidTo,
    inchargeName,
    inchargePhone,
    inchargeEmail,
    website,
    phoneNumber,
    country,
    city,
    district,
    state,
    localBodyType,
    localBodyName,
    wardName,
    postOffice,
    pinCode,
    type
  };

  const userID = request.headers.userID;

  organizationServices.searchOrganization(
    searchOrganizationData,
    userID,
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
          const totaldata = {organizationDetails, page, pageSize, totalCount, count };

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


/**
     * @swagger
     * /api/get/organization/{id}:
     *   get:
     *     tags:
     *       - : "Organization"
     *     summary: "get Organization details"
     *     description: |
     *       To get Organization details
     *       | Key            | Value                          | Description                          |
     *       |----------------|--------------------------------|--------------------------------------|
     *       | id             | eg.,"2"(ID)                    | ID to match and fetch organization   |
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
     *         description: ID of the Organization to retrieve
     *     responses:
     *       200:
     *         description: Successfully fetched Organization
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
     *                   description: Organization details
     *                 errMsg:
     *                   type: string
     *                   example: null
     *       400:
     *         description: OrganizationID not found
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
Author     : Abhijith JS
Date       : 5 June 2024
Purpose    : route for getting organization by ID.
parameter  : id
return type: object - organization
*/

router.get("/api/get/organization/:id", (request, response) => {
  const organizationID = request.params.id;

  if (validator.isNullOrEmpty(organizationID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOORGANIZATION_ID,
    });
  }
  organizationServices.getOrganizationByID(
    organizationID,
    (organization, errMsg) => {
      if (errMsg) {
        // If any error occurs while finding organization
        console.error(errorMessages.ERROR_FETCHING_ORGANIZATIONDETAILS, errMsg);
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
     * /api/organization:
     *   post:
     *     tags:
     *       - : "Organization"
     *     summary: "Add new Organization"
     *     description: |
     *       Add new Organization with the following required fields:
     *       | Key                    | Value                                      | Description                          |
     *       |------------------------|--------------------------------------------|--------------------------------------|
     *       | organizationName*      | eg., "Techie test Ltd" (String)            | Name of the organization             |  
     *       | organizationEmail*     | eg., "contactin@techietestzovation.com" (String) | Email of the organization      |
     *       | organizationTypeID*    | eg., "12" (integer)                        | Type ID of the organization          |
     *       | website*               | eg., "www.website.in" (String)             | Website of the organization          |
     *       | phoneNumber*           | eg., "7012391742" (String)                 | Phone number                         |
     *       | country*               | eg., "1" (integer)                         | Country ID                           |
     *       | district*              | eg., "13" (integer)                        | District ID                          |
     *       | state*                 | eg., "2" (integer)                         | State ID                             |
     *       | registrationNumber     | eg., "12345" (String)                      | Registration number                  |
     *       | registrationValidFrom  | eg., "2023-01-01" (Date)                   | Registration valid from date         |
     *       | registrationValidTo    | eg., "2024-01-01" (Date)                   | Registration valid to date           |
     *       | inchargeName           | eg., "John Doe" (String)                   | Name of the organization incharge    |
     *       | inchargePhone          | eg., "7012391742" (String)                 | Phone number of the incharge         |
     *       | inchargeEmail          | eg., "johndoe@techietestzovation.com" (String) | Email of the incharge            |
     *       | city                   | eg., "14" (String)                         | City name                            |
     *       | localBodyType          | eg., "6" (String)                          | Local body type                      |
     *       | localBodyName          | eg., "45" (String)                         | Local body name                      |
     *       | wardName               | eg., "27" (String)                         | Ward name                            |  
     *       | postOffice             | eg., "25" (String)                         | Post office                          |
     *       | about                  | eg., "An innovative tech company" (String) | Description about the organization   |
     *       | pinCode                | eg., "560001" (String)                     | Postal code                          |
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
     *            required:
     *              - organizationName
     *              - organizationEmail
     *              - organizationTypeID
     *              - website
     *              - phoneNumber
     *              - country
     *              - district
     *              - state
     *            properties:
     *               organizationName:
     *                  type: string
     *               organizationEmail:
     *                  type: string
     *               organizationTypeID:
     *                  type: integer
     *               registrationNumber:
     *                  type: string
     *               registrationValidFrom:
     *                  type: string
     *                  format: date
     *               registrationValidTo:
     *                  type: string
     *                  format: date
     *               inchargeName:
     *                  type: string
     *               inchargePhone:
     *                  type: string
     *               inchargeEmail:
     *                  type: string
     *               website:
     *                  type: string
     *               phoneNumber:
     *                  type: string
     *               country:
     *                  type: integer
     *               city:
     *                  type: string
     *               district:
     *                  type: integer
     *               state:
     *                  type: integer
     *               localBodyType:
     *                  type: string
     *               localBodyName:
     *                  type: string
     *               wardName:
     *                  type: string
     *               postOffice:
     *                  type: string
     *               about:
     *                  type: string
     *               pinCode:
     *                  type: string
     *            example:
     *               organizationName: "Techie test Ltd"
     *               organizationEmail: "contactin@techietestzovation.com"
     *               organizationTypeID: 12
     *               registrationNumber: "12345"
     *               registrationValidFrom: "2023-01-01"
     *               registrationValidTo: "2024-01-01"
     *               inchargeName: "John Doe"
     *               inchargePhone: "7012391742"
     *               inchargeEmail: "johndoe@techietestzovation.com"
     *               website: "www.website.in"
     *               phoneNumber: "7012391742"
     *               country: 1
     *               city: "14"
     *               district: 13
     *               state: 2
     *               localBodyType: "5"
     *               localBodyName: "25"
     *               wardName: "46"
     *               postOffice: "45"
     *               about: "An innovative technology company."
     *               pinCode: "560001"
     *     responses:
     *       200:
     *         description: Successfully created organization detail
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
     *                   description: Organization detail response data
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
Author     : Abhijith JS
Date       : 6 June 2024
Purpose    : route for creating new organization 
parameter  : organizationData
return type: organizationID int
*/
router.post("/api/organization", (request, response) => {
  //getting new organization details from request body
  const {
    organizationName,
    organizationEmail,
    organizationTypeID,
    registrationNumber,
    registrationValidFrom,
    registrationValidTo,
    inchargeName,
    inchargePhone,
    inchargeEmail,
    website,
    phoneNumber,
    country,
    city,
    district,
    state,
    localBodyType,
    localBodyName,
    wardName,
    postOffice,
    about,
    pinCode,
  } = request.body;

  const userID = request.headers.userID;
  //validating if any fields are missing data
  if (
    validator.isNullOrEmpty(organizationName) ||
    validator.isNullOrEmpty(organizationEmail) ||
    validator.isNullOrEmpty(organizationTypeID) ||
    validator.isNullOrEmpty(phoneNumber) ||
    validator.isNullOrEmpty(country) ||
    validator.isNullOrEmpty(state) ||
    validator.isNullOrEmpty(district)
  ) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_MISSINGFIELDS,
    });
  }
  if (!validator.isEmail(organizationEmail)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_INVALID_EMAIL,
    });
  }
  if (validator.isNullOrEmpty(userID)) {
    return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_USERIDMISSING,
    });
}

  //passing organization data into an object
  const organizationData = {
    organizationName,
    organizationEmail,
    organizationTypeID,
    registrationNumber,
    registrationValidFrom,
    registrationValidTo,
    inchargeName,
    inchargePhone,
    inchargeEmail,
    website,
    phoneNumber,
    country,
    city,
    district,
    state,
    localBodyType,
    localBodyName,
    wardName,
    postOffice,
    pinCode,
    about,
    userID,
  };

  organizationServices.saveOrganization(
    organizationData,
    (organizationID, errMsg) => {
      if (errMsg) {
        console.error(errorMessages.ERROR_SAVINGORGANIZATION, errMsg);
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



/**
     * @swagger
     * /api/organization/{organizationID}:
     *   put:
     *     tags:
     *       - : "Organization"
     *     summary: "Update Organization"
     *     description: |
     *       To update the Organization
     *       Organization data:
     *       | Key                    | Value                                  | Description                     |
     *       |------------------------|----------------------------------------|---------------------------------|
     *       | organizationName       | eg., "test6" (String)                  | Name of the organization        |
     *       | organizationEmail      | eg., "test6@gmail.com" (String)        | Email of the organization       |
     *       | organizationTypeID     | eg., "1" (integer)                     | Type ID of the organization     |
     *       | registrationNumber     | eg., "123456" (String)                 | Registration number             |
     *       | registrationValidFrom  | eg., "2023-01-01" (String)             | Registration valid from date    |
     *       | registrationValidTo    | eg., "2024-01-01" (String)             | Registration valid to date      |
     *       | inchargeName           | eg., "John" (String)                   | Name of the in-charge person    |
     *       | inchargePhone          | eg., "9876543210" (integer)            | Phone number of in-charge       |
     *       | inchargeEmail          | eg., "john@gmail.com" (String)         | Email of the in-charge          |
     *       | website                | eg., "http://example.com" (String)     | Website of the organization     |
     *       | phoneNumber            | eg., "74" (number)                     | Phone number                    |
     *       | country                | eg., "1" (String)                      | Country                         |
     *       | city                   | eg., "14" (integer)                    | City                            |
     *       | district               | eg., "13" (integer)                    | District                        |
     *       | state                  | eg., "2" (integer)                     | State                           |
     *       | localBodyType          | eg., "5" (integer)                     | Type of local body              |
     *       | localBodyName          | eg., "15" (integer)                    | Name of local body              |
     *       | wardName               | eg., "1" (integer)                     | Ward name                       |
     *       | about                  | eg., "some about" (String)             | some about                      |
     *       | postOffice             | eg., "2" (integer)                     | Post office                     |
     *       | pinCode                | eg., "695001" (integer)                | pinCode                         |
     *       | userID                 | eg., "12" (integer)                    | User ID                         |
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         schema:
     *            type: string
     *         required: true
     *       - in: path
     *         name: organizationID
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
     *               organizationName:
     *                  type: string
     *               organizationEmail:
     *                  type: string 
     *               organizationTypeID:
     *                  type: integer
     *               registrationNumber:
     *                  type: string
     *               registrationValidFrom:
     *                  type: string
     *               registrationValidTo:
     *                  type: string
     *               inchargeName:
     *                  type: string
     *               inchargePhone:
     *                  type: integer
     *               inchargeEmail:
     *                  type: string
     *               website:
     *                  type: string
     *               phoneNumber:
     *                  type: integer 
     *               country:
     *                  type: string
     *               city:
     *                  type: string
     *               district:
     *                  type: string 
     *               state:
     *                  type: string 
     *               localBodyType:
     *                  type: string
     *               localBodyName:
     *                  type: string
     *               wardName:
     *                  type: string
     *               about:
     *                  type: string
     *               postOffice:
     *                  type: string
     *               pinCode:
     *                  type: integer
     *            example: # Sample object
     *               organizationName: "test6"
     *               organizationEmail: "test6@gmail.com"
     *               organizationTypeID: 12
     *               registrationNumber: "123456"
     *               registrationValidFrom: "2023-01-01"
     *               registrationValidTo: "2024-01-01"
     *               inchargeName: "John"
     *               inchargePhone: 9876543210
     *               inchargeEmail: "john@gmail.com"
     *               website: "http://example.com"
     *               phoneNumber: 7445678902
     *               country: "1"
     *               city: "14"
     *               district: "13"
     *               state: "2"
     *               localBodyType: "5"
     *               localBodyName: "15"
     *               wardName: "1"
     *               about: "some about"
     *               postOffice: "2"
     *               pinCode: 695001
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
Author     : Abhijith JS
Date       : 6 June 2024
Purpose    : route for updating organization 
parameter  : organizationData
return type: organizationID int
*/
router.put("/api/organization/:organizationID", (request, response) => {
  const {
    organizationName,
    organizationEmail,
    organizationTypeID,
    registrationNumber,
    registrationValidFrom,
    registrationValidTo,
    inchargeName,
    inchargePhone,
    inchargeEmail,
    website,
    phoneNumber,
    country,
    city,
    district,
    state,
    localBodyType,
    localBodyName,
    wardName,
    postOffice,
    about,
    pinCode,
  } = request.body;

  const userID = request.headers.userID;
  const organizationID = request.params.organizationID;

  const updateOrganizationData = {
    organizationName,
    organizationEmail,
    organizationTypeID,
    registrationNumber,
    registrationValidFrom,
    registrationValidTo,
    inchargeName,
    inchargePhone,
    inchargeEmail,
    website,
    phoneNumber,
    country,
    city,
    district,
    state,
    localBodyType,
    localBodyName,
    wardName,
    postOffice,
    pinCode,
    about,
    userID,
    organizationID,
  };

  if (validator.isNullOrEmpty(organizationID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOORGANIZATION_ID,
    });
  } else if (
    validator.isNullOrEmpty(organizationName) ||
    validator.isNullOrEmpty(organizationEmail)
  ) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ALLFIELDMISSING,
    });
  }
  if (
    !validator.isNullOrEmpty(organizationEmail) &&
    !validator.isEmail(organizationEmail)
  ) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_INVALID_EMAIL,
    });
  }

  organizationServices.updateOrganization(
    updateOrganizationData,
    (updateOrganizationID, errMsg) => {
      //If an error occured during the update
      if (errMsg) {
        console.error(errorMessages.ERROR_UPDATINGUSERS, errMsg);
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
        //if organization updated
      } else {
        if (updateOrganizationID) {
          return response.status(200).json({
            success: true,
            data: updateOrganizationID,
            errMsg: null,
          });
        } else {
          // If organization not updated
          return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_NOUSER_FOUND,
          });
        }
      }
    }
  );
});



/**
     * @swagger
     * /api/organization/{id}:
     *   delete:
     *     tags:
     *       - : "Organization"
     *     summary: "delete Organization"
     *     description: |
     *       To delete Organization
     *       | Key            | Value                          | Description                          |
     *       |----------------|--------------------------------|--------------------------------------|
     *       | id             | eg.,"2"(ID)                    | ID to match and delete organization   |
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
     *         description: ID of the Organization to delete
     *     responses:
     *       200:
     *         description: Successfully deleted Organization
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
     *                   example: null or ERROR_NO_ORGANIZATIONFOUND
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
     *         description: OrganizationID not found
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
 */
/*
Author     : Abhijith JS
Date       : 5 June 2024
Purpose    : route for deleting organization 
parameter  : id - int
return type: boolean- true/false
*/
router.delete("/api/organization/:id", (request, response) => {
  const organizationID = request.params.id;

  if (validator.isNullOrEmpty(organizationID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOORGANIZATION_ID,
    });
  } else {
    organizationServices.deleteOrganization(
      organizationID,
      (success, errMsg) => {
        if (errMsg) {
          // If any error occurs while deleting organization
          console.error(
            errorMessages.ERROR_FETCHING_ORGANIZATIONDETAILS,
            errMsg
          );
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else if (success) {
          //organization deleted successfully
          return response.status(200).json({
            success: true,
            data: true,
            errMsg: null,
          });
        } else {
          //No organization found
          return response.status(200).json({
            success: false,
            data: false,
            errMsg: errorMessages.ERROR_NO_ORGANIZATIONFOUND,
          });
        }
      }
    );
  }
});



/*
Author     : ABHIJITH JS
Date       : 28 October 2024
Purpose    : Function for saving organization Avatar/profile photo 
Steps      : 
1. Upload the function in cloudinary
2. Validate input details are empty or not
3. Insert the data in database
*/
/**
 * @swagger
 * /api/organization/avatar:
 *   post:
 *     tags:
 *       - : "Organization"
 *     summary: "Save Organization Avatar"
 *     description: |
 *       Saves the avatar for an organization. Requires a file upload and the organization ID.
 *       | Key            | Value                           | Description           |
 *       |----------------|---------------------------------|-----------------------|
 *       | organizationID | eg., "12345" (String)           | Unique Organization ID|
 *       | uploads        | File to be uploaded             | Avatar image(s)       |
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: organizationID
 *         description: Unique identifier of the organization
 *         required: true
 *         schema:
 *           type: string
 *       - in: formData
 *         name: uploads
 *         type: file
 *         description: The file(s) to upload
 *         required: false
 *     responses:
 *       201:
 *         description: Successfully saved organization avatar
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
 *                   description: Document ID of the saved avatar
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
 *                   type: object
 *                   example: null
 *                 errMsg:
 *                   type: string
 *                   example: ERROR_NOORGANIZATION_ID
 *       500:
 *         description: Server error during file upload or configuration
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
 *                   example: ERROR_FAILED_FILEUPLOAD or ERROR_FAILED_CONFIGURE_CLOUDINARY
 */
router.post("/api/organization/avatar", (request, response) => {

  getUploadMiddleware()
    .then(upload => {

      upload(request, response, (err) => {
        if (err) {
          return response.status(500).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_FAILED_FILEUPLOAD + ` ${err.message}`,
          });
        }

        let uploadsInfo = [];

        if (request.files) {
          // Extracting paths, file types, and file names
          uploadsInfo = request.files.map(upload => ({
            path: upload.path,
            fileType: upload.mimetype,
            fileName: upload.originalname
          }));

          request.body.uploads = uploadsInfo;
        }

        let { organizationID } = request.body;

        if (validator.isNullOrEmpty(organizationID)) {
          if (request.files.length > 0 && request.files[0].filename) {
            deleteMultipleImages(request.files, (result, errMsg) => {
              if (errMsg) {
                return response.status(500).json({
                  success: false,
                  data: null,
                  errMsg: errorMessages.ERROR_FAILED_DELETING_IMAGE + ` ${errMsg}`,
                });
              } else {
                return response.status(400).json({
                  success: false,
                  data: null,
                  errMsg: errorMessages.ERROR_NOORGANIZATION_ID,
                });
              }
            });
          }
        } else {

          const organizationEnteredDetails = { organizationID, uploadsInfo };

          organizationServices.saveOrganizationAvatar(
            organizationEnteredDetails,
            (documentID, errMsg) => {
              if (errMsg) {
                console.error(errorMessages.ERROR_SAVING_AVATAR, errMsg);
                return response.status(400).json({
                  success: false,
                  data: null,
                  errMsg: errMsg,
                });
              } else {
                return response.status(201).json({
                  success: true,
                  data: documentID,
                  errMsg: null,
                });
              }
            }
          );
        }
      });
    }).catch(err => {
      return response.status(500).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_FAILED_CONFIGURE_CLOUDINARY + `, ${err.message}`,
      });
    });
});


/*
Author     : Abhijith JS
Date       : 28 October 2024
Purpose    : Function for updating organization Avatar/profile photo 
parameter  : organizationEnteredDetails 
return type: number 
*/
/**
     * @swagger
     * /api/organizationAvatar:
     *   put:
     *     tags:
     *       - : "Organization"
     *     summary: "Update Organization Avatar"
     *     description: |
     *       Updates the avatar for an organization. Requires a file upload and the organization ID.
     *       | Key            | Value                           | Description           |
     *       |----------------|---------------------------------|-----------------------|
     *       | organizationID | eg., "12345" (String)           | Unique Organization ID|
     *       | documentID     | eg., "67890" (String)           | Unique Document ID    |
     *       | uploads        | File to be uploaded             | Avatar image(s)       |
     *     consumes:
     *       - multipart/form-data
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         schema:
     *            type: string
     *         required: true
     *       - in: formData
     *         name: organizationID
     *         description: Unique identifier of the organization
     *         required: true
     *         schema:
     *           type: string
     *       - in: formData
     *         name: documentID
     *         description: Unique identifier of the document to be updated
     *         required: true
     *         schema:
     *           type: string
     *       - in: formData
     *         name: uploads
     *         type: file
     *         description: The file to upload
     *         required: false
     *     responses:
     *       200:
     *         description: Successfully updated organization avatar
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
     *                   description: Document ID of the updated avatar
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
     *                   type: object
     *                   example: null
     *                 errMsg:
     *                   type: string
     *                   example: ERROR_ALLFIELDMISSING
     *       500:
     *         description: Server error during file upload or configuration
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
     *                   example: ERROR_FAILED_FILEUPLOAD or ERROR_FAILED_CONFIGURE_CLOUDINARY
 */
router.put("/api/organizationAvatar", (request, response) => {

  getUploadMiddleware()
    .then(upload => {
      upload(request, response, (err) => {
        if (err) {
          return response.status(500).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_FAILED_FILEUPLOAD + ` ${err.message}`,
          });
        }

        let uploadsInfo = [];
        if (request.files) {
          // Extracting paths, file types, and file names
          uploadsInfo = request.files.map(upload => ({
            path: upload.path,
            fileType: upload.mimetype,
            fileName: upload.originalname
          }));
        }

        let {
          organizationID,
          documentID
        } = request.body;

        // Validate organizationID and documentID
        if (validator.isNullOrEmpty(organizationID) ||
            validator.isNullOrEmpty(documentID)
        ) {
          if (request.files.length > 0 && request.files[0].filename) {
            deleteMultipleImages(request.files, (result, errMsg) => {
              if (errMsg) {
                return response.status(500).json({
                  success: false,
                  data: null,
                  errMsg: errorMessages.ERROR_FAILED_DELETING_IMAGE + ` ${errMsg}`,
                });
              } else {
                return response.status(400).json({
                  success: false,
                  data: null,
                  errMsg: errorMessages.ERROR_ALLFIELDMISSING,
                })
              }
            });
          } else {
            return response.status(400).json({
              success: false,
              data: null,
              errMsg: errorMessages.ERROR_ALLFIELDMISSING,
            });
          }
        }

        let organizationEnteredDetails = { organizationID, uploadsInfo, documentID };

        if (validator.isNullOrEmpty(documentID) && validator.isNullOrEmpty(organizationID)) {
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_ALLFIELDMISSING,
          });
        }

        organizationServices.updateOrganizationAvatar(organizationEnteredDetails, (documentID, errMsg) => {
          // If an error occurred during the update
          if (errMsg) {
            console.error(errorMessages.ERROR_UPDATING_AVATAR, errMsg);
            return response.status(400).json({
              success: false,
              data: null,
              errMsg: errMsg,
            });
          } else {
            // If avatar updated
            if (documentID) {
              return response.status(200).json({
                success: true,
                data: documentID,
                errMsg: null,
              });
            } else {
              // If avatar not updated
              return response.status(200).json({
                success: false,
                data: null,
                errMsg: errorMessages.ERROR_AVATAR_NOTFOUND,
              });
            }
          }
        });
      });
    })
    .catch(err => {
      return response.status(500).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_FAILED_CONFIGURE_CLOUDINARY + `, ${err.message}`,
      });
    });
});



/*
Author     : Abhijith JS
Date       : 20 November 2024
Purpose    : Route for Searching array of Organizations matching ANY user input details.
parameter  : keywordSearchText 
return type: response object 
*/
/**
 * @swagger
 * /api/key/search/organization:
 *   post:
 *     tags:
 *       - : "Organization"
 *     summary: "Search Organization"
 *     description: |
 *       Searches for organizations based on the provided keyword and pagination parameters.
 *       Returns organization details along with pagination info.
 *       | In       | Name              | Type   | Description                           | Required |
 *       |----------|-------------------|--------|---------------------------------------|----------|
 *       | query    | page              | integer| Page number for pagination            | false    |
 *       | query    | pageSize          | integer| Number of organizations per page      | false    |
 *       | body     | keywordSearchText | string | The keyword to search for             | true     |
 *       | body     | type              | string | search Type                           | true     |
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
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
 *         description: Number of organizations per page
 *         required: false
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           required:
 *             - keywordSearchText
 *             - type
 *           properties:
 *             keywordSearchText:
 *               type: string
 *               example: "Tech"
 *               description: The keyword to search for
 *             type:
 *               type: string
 *               enum: [O, M]
 *               example: "O"
 *               description: Type of organization search. Use "O" or "M".
 *     responses:
 *       200:
 *         description: Successfully retrieved organization search results
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
 *                     organizationDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           total_count:
 *                             type: integer
 *                             example: 50
 *                           organizationDetails:
 *                             type: array
 *                             items:
 *                               type: object
 *                             description: List of organization details
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
 *       400:
 *         description: Invalid input parameters
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
 *                   example: ERROR_INVALID_INPUT
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
router.post("/api/key/search/organization", (request, response) => {
  // Store data from request.body to the variables
  const { keywordSearchText } = request.body;
  const type = request.body.type;
  const userID = request.headers.userID;
  const { page, pageSize } = request.query;

  // Call the service function for searching organizations
  organizationServices.keySearchOrganization(
    keywordSearchText,
    {userID,type},
    page,
    pageSize,
    (organizationDetails, errMsg) => {
      // If an error occurred during the search
      if (errMsg) {
        console.error(errorMessages.ERROR_NO_ORGANIZATIONFOUND, errMsg);
        return response.status(500).json({
          success: false,
          data: [],
          errMsg: errMsg,
        });
      } else {
        // If organization details are found
        if (organizationDetails && organizationDetails.length > 0) {
          const totalCount = organizationDetails[0].total_count || 0;
          const count = organizationDetails.length;
          const totaldata = { organizationDetails, page, pageSize, totalCount, count };

          return response.status(200).json({
            success: true,
            data: totaldata,
            errMsg: null,
          });
        } else {
          // If no organization details were found
          return response.status(200).json({
            success: false,
            data: [],
            errMsg: errorMessages.ERROR_ORGANIZATION_NOTFOUND,
          });
        }
      }
    }
  );
});




module.exports = router;
