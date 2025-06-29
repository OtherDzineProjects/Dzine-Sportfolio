const express = require('express');
const router = express.Router();
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const basicUserDetailServices = require("../services/basicUserDetail");



/*
Author     : Abhijith JS
Date       : 4 july 2024
Purpose    : route for saving userBasicDetails
parameter  : userEnteredDetails
return type:  int
*/
/**
     * @swagger
     * /api/user/basicdetail:
     *   post:
     *     tags:
     *       - : "basicUserDetail"
     *     summary: "Add new userBasicDetail"
     *     description: |
     *       Add new userBasicDetail
     *       Basic user data:
     *       | Key            | Value                            | Description                |
     *       |----------------|----------------------------------|----------------------------|
     *       | firstName      | eg.,"test6"(String)              | firstName                  |
     *       | middleName     | eg.,"te"(String)                 | middleName                 |
     *       | lastName       | eg.,"test6"(String)              | lastName                   |
     *       | nickName       | eg.,"tet"(String)                | nickName                   |
     *       | userID         | eg.,"74"(ID)                     | userID                     |
     *       | emailID        | eg.,"testmail12256@gmail.com"(String) |  emailID              |
     *       | phoneNumber    | eg.,"1234567890"(number)         | phoneNumber                |
     *       | alternativePhoneNumber | eg.,"7894561235"(number) | alternativePhoneNumber     |
     *       | gender         | eg.,"1"(String)                  | gender                     |
     *       | dateOfBirth    | eg.,"1995/06/23"(date)           | dateOfBirth                |
     *       | bio            | eg.,"some bio text"(String)      | bio                        |
     *       | bloodGroup     | eg.,"3"(String)                  | bloodGroup                 |
     *       | country        | eg.,"1"(ID)                      | country                    |
     *       | state          | eg.,"2"(ID)                      | state                      |
     *       | district       | eg.,"13"(ID)                     | district                   |
     *       | city           | eg.,"14"(ID)                     | city ID                    |
     *       | locationID     | eg.,"1"(ID)                      | locationID                 |
     *       | representing districts | eg.,[131,132,133](array of district IDs)|  representing districts  |
     *       | houseName      | eg.,"anyhousenamee"(String)      | houseName                  |
     *       | streetName     | eg.,"streetss"(String)           | streetName                 |
     *       | place          | eg.,"someplacess"(String)        | place                      |
     *       | localBodyType  | eg.,"4"(ID)                      | localBodyType              |
     *       | localBodyName  | eg.,"14"(ID)                     | localBodyName              |
     *       | wardName       | eg.,"1"(ID)                      | wardName                   |
     *       | postOffice     | eg.,"2"(String)                  | postOffice                 |
     *       | pinCode        | eg.,"695587"(Pincode)            | pinCode                    |
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
     *         description: userBasicDetail object
     *         required: true
     *         schema:
     *            type: object
     *            properties:
     *               firstName:
     *                  type: string
     *               middleName:
     *                  type: string
     *               lastName:
     *                  type: string
     *               nickName:
     *                  type: string 
     *               userID:
     *                  type: integer 
     *               emailID:
     *                  type: string
     *               phoneNumber:
     *                  type: string 
     *               alternativePhoneNumber:
     *                  type: string 
     *               gender:
     *                  type: string 
     *               dateOfBirth:
     *                  type: date
     *               bloodGroup:
     *                  type: string 
     *               country:
     *                  type: string 
     *               state:
     *                  type: string 
     *               district:
     *                  type: string
     *               city:
     *                  type: string 
     *               locationID:
     *                  type: integer  
     *               representing districts:
     *                  type: string
     *               houseName:
     *                  type: string 
     *               streetName:
     *                  type: string 
     *               place:
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
     *                  type: string        
     *            example: # Sample object
     *               firstName: "test6"
     *               middleName: "te"
     *               lastName: "test6"
     *               nickName: "tet"
     *               userID: "74"
     *               emailID: "testmail12256@gmail.com"
     *               phoneNumber: "1231356"
     *               alternativePhoneNumber: "4567891320"
     *               gender: "1"
     *               dateOfBirth: "1901/02/06"
     *               bio: "some bio"
     *               bloodGroup: "3"
     *               country: "1"
     *               state: "2"
     *               district: "13"
     *               city: "14"
     *               locationID: "1"
     *               representingDistricts: [131,132,133]
     *               houseName: "anyhousenamee"
     *               streetName: "streetss"
     *               place: "someplacess"
     *               localBodyType: "4"
     *               localBodyName: "14"
     *               wardName: "1"
     *               postOffice: "2"
     *               pinCode: "695587"
     *     responses:
     *       201:
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
     *                   example: ERROR_MISSINGFIELDS or ERROR_INVALID_EMAIL
     *       401:
     *         description: Unauthorized
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
     *                   example: ERROR_UNAUTHORIZED
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
    

router.post("/api/user/basicdetail", (request, response) => {
    //getting new USER BASIC DETAILS details from request body
    const {firstName, middleName, lastName, nickName, emailID,phoneNumber, alternativePhoneNumber, 
        gender,dateOfBirth,bio, bloodGroup,country,state,district,city,locationID,
        houseName,streetName,place,representingDistricts,
        localBodyType,localBodyName,wardName,postOffice,pinCode    
    } = request.body;

    if(!validator.isNullOrEmpty(emailID)){
      if (!validator.isEmail(emailID)) {
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_INVALID_EMAIL,
        });
        }
    }else{
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_INVALID_EMAIL,
      });
    }
  
    const userID = request.body.userID;
    if(validator.isNullOrEmpty(userID)){
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_NOUSERID,
      });
    }
  
    //passing basic user details into an object
    const userEnteredDetails = {
        userID, firstName, middleName, lastName, nickName, emailID,phoneNumber, alternativePhoneNumber,
        gender,dateOfBirth,bio, bloodGroup,country,state,district,city,locationID,
        representingDistricts,houseName,streetName,place,
        localBodyType,localBodyName,wardName,postOffice,pinCode 
    };
  
    basicUserDetailServices.saveBasicUserDetail(
        userEnteredDetails,
      (userBasicDetailID, errMsg) => {
        if (errMsg) {
          console.error(errorMessages.ERROR_SAVING_BASIC_USERDETAILS, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else {
          return response.status(201).json({
            success: true,
            data: userBasicDetailID,
            errMsg: null,
          });
        }
      }
    );
  });

  /*
Author     : Abhijith JS
Date       : 4 july 2024
Purpose    : Route for getting user by input id.
parameter  : id
return type: response object
*/
/**
     * @swagger
     * /api/get/user/basicdetail/{id}:
     *   get:
     *     tags:
     *       - : "basicUserDetail"
     *     summary: "get basicUserDetails"
     *     description: |
     *       get basicUserDetails
     *       | Key            | Value                          | Description           |
     *       |----------------|--------------------------------|-----------------------|
     *       | ID             | eg.,"2"(ID)                    | ID to match data      |
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
     *         description: ID of the user basic detail to retrieve
     *     responses:
     *       200:
     *         description: Successfully fetched user
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
     *                   description: user response data
     *                 errMsg:
     *                   type: string
     *                   example: null
     *       400:
     *         description: userBasicDetailID not found
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
     *                   example: ERROR_NOUSER_BASICDETAILID
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
     *                   example: ERROR_FETCHING_USERDETAILS
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
router.get("/api/get/user/basicdetail/:id", (request, response) => {
    const userBasicDetailID = request.params.id;
  
    if (validator.isNullOrEmpty(userBasicDetailID)) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_NOUSER_BASICDETAILID,
      });
    }
    basicUserDetailServices.getBasicUserDetailByID(userBasicDetailID, (userBasicDetail, errMsg) => {
      if (errMsg) {
        // If any error occurs while finding userBasicDetail
        console.error(errorMessages.ERROR_FETCHING_USERDETAILS, errMsg);
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If userBasicDetail details fetched successfully
        return response.status(200).json({
          success: true,
          data: userBasicDetail,
          errMsg: null,
        });
      }
    });
  });


  /*
Author     : Abhijith JS
Date       : 5 july 2024
Purpose    : Route for Searching array of users matching the user input details.
parameter  : userEnteredDetails
return type: response object 
*/

/**
     * @swagger
     * /api/search/user/basicdetail:
     *   post:
     *     tags:
     *       - : "basicUserDetail"
     *     summary: "search userBasicDetail"
     *     description: |
     *       Search userBasicDetails
     *       Basic user data:
     *       | Key                   | Value                                  | Description                |
     *       |-----------------------|----------------------------------------|----------------------------|
     *       | userID                | eg., "1" (ID)                          | userID                     |
     *       | firstName             | eg., "test6" (String)                  | firstName                  |
     *       | middleName            | eg., "te" (String)                     | middleName                 |
     *       | lastName              | eg., "test6" (String)                  | lastName                   |
     *       | nickName              | eg., "tet" (String)                    | nickName                   |
     *       | emailID               | eg., "testmail12256@gmail.com" (String)| emailID                    |
     *       | phoneNumber           | eg., "1231356" (number)                | phoneNumber                |
     *       | alternativePhoneNumber| eg., "4567891320" (number)             | alternativePhoneNumber     |
     *       | dateOfBirth           | eg., "1901/02/06" (date)               | dateOfBirth                |
     *       | bloodGroup            | eg., "B+" (String)                     | bloodGroup                 |
     *       | houseName             | eg., "anyhousenamee" (String)          | houseName                  |
     *       | streetName            | eg., "streetss" (String)               | streetName                 |
     *       | country               | eg., "India" (String)                  | country                    |
     *       | district              | eg., "Thiruvananthapuram" (String)     | district                   |
     *       | state                 | eg., "Kerala" (String)                 | state                      |
     *       | postOffice            | eg., "chempazhanthy" (String)          | postOffice                 |
     *       | pinCode               | eg., "695587" (Pincode)                | pinCode                    |
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
     *         description: userBasicDetail object
     *         required: false
     *         schema:
     *            type: object
     *            properties:
     *               userID:
     *                  type: string
     *               firstName:
     *                  type: string
     *               middleName:
     *                  type: string
     *               lastName:
     *                  type: string
     *               nickName:
     *                  type: string 
     *               emailID:
     *                  type: string
     *               phoneNumber:
     *                  type: string 
     *               alternativePhoneNumber:
     *                  type: string 
     *               dateOfBirth:
     *                  type: date
     *               bloodGroup:
     *                  type: string 
     *               houseName:
     *                  type: string 
     *               streetName:
     *                  type: string 
     *               district:
     *                  type: string
     *               state:
     *                  type: string
     *               postOffice:
     *                  type: string 
     *               pinCode:
     *                  type: string      
     *            example: # Sample object
     *               userID: "1"
     *               firstName: "test6"
     *               middleName: "te"
     *               lastName: "test6"
     *               nickName: "tet"
     *               emailID: "testmail12256@gmail.com"
     *               phoneNumber: "1231356"
     *               alternativePhoneNumber: "4567891320"
     *               dateOfBirth: "1901/02/06"
     *               bloodGroup: "B+"
     *               houseName: "anyhousenamee"
     *               streetName: "streetss"
     *               country: "India"
     *               district: "Thiruvananthapuram"
     *               state: "Kerala"
     *               postOffice: "chempazhanthy"
     *               pinCode: "695587"
     *     responses:
     *       200:
     *         description: Successfully fetched user details
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
     *                   example: ERROR_NOUSER or ERROR_INTERNAL_SERVER_ERROR
 */
router.post("/api/search/user/basicdetail", (request, response) => {
    //Store data from request.body to the variables
    const { userID, firstName, middleName, lastName, nickName, emailID, phoneNumber, alternativePhoneNumber, dateOfBirth,bloodGroup,houseName,streetName,district, country, state,postOffice,pinCode }  = request.body;
    const userEnteredDetails = { userID, firstName, middleName, lastName, nickName, emailID, phoneNumber, alternativePhoneNumber,dateOfBirth,bloodGroup,houseName,streetName,district,country, state,postOffice,pinCode };
    const { page, pageSize } = request.query;
  
    basicUserDetailServices.searchBasicUserDetail(
      userEnteredDetails,
      page,
      pageSize,
      (userDetails, errMsg) => {
        //If an error occured during the search
        if (errMsg) {
          console.error(errorMessages.ERROR_NOUSER, errMsg);
          return response.status(500).json({
            success: false,
            data: [],
            errMsg: errMsg,
          });
          //if userBasicDetails found
        } else {
          if (userDetails) {
            const totalCount = userDetails.length > 0 ? userDetails[0].total_count : 0;
            const count = userDetails.length;
            const totaldata = {userDetails, page, pageSize, totalCount, count };
  
            return response.status(200).json({
              success: true,
              data: totaldata,
              errMsg: null,
            });
          } else {
            // If no userBasicDetails were found
            return response.status(200).json({
              success: false,
              data: [],
              errMsg: errorMessages.ERROR_NOUSER_FOUND,
            });
          }
        }
      }
    );
  });



  /*
Author     : Abhijith JS
Date       : 5 july 2024
Purpose    : Route for updating user basic details.
parameter  : userEnteredDetails 
return type: number 
*/
/**
     * @swagger
     * /api/user/basicdetail:
     *   put:
     *     tags:
     *       - : "basicUserDetail"
     *     summary: "Update userBasicDetail"
     *     description: |
     *       Update Basic user data:
     *       | Key                    | Value                                  | Description                |
     *       |------------------------|----------------------------------------|----------------------------|
     *       | firstName              | eg., "test6" (String)                  | firstName                  |
     *       | middleName             | eg., "te" (String)                     | middleName                 |
     *       | lastName               | eg., "test6" (String)                  | lastName                   |
     *       | nickName               | eg., "tet" (String)                    | nickName                   |
     *       | userID                 | eg., "74" (ID)                         | userID                     |
     *       | emailID                | eg., "testmail12256@gmail.com" (String)| emailID                    |
     *       | phoneNumber            | eg., "1231356" (number)                | phoneNumber                |
     *       | alternativePhoneNumber | eg., "4561327890" (number)             | alternativePhoneNumber     |
     *       | gender                 | eg., "1" (String)                      | gender                     |
     *       | dateOfBirth            | eg., "1901/02/06" (date)               | dateOfBirth                |
     *       | bloodGroup             | eg., "5" (String)                      | bloodGroup                 |
     *       | country                | eg., "1" (String)                      | country                    |
     *       | state                  | eg., "2" (String)                      | state                      |
     *       | district               | eg., "13" (String)                     | district                   |
     *       | city                   | eg., "14" (String)                     | city                       |
     *       | locationID             | eg., "1" (ID)                          | locationID                 |
     *       | representingDistricts  | eg., [131,132,133](districtIDs array)  | representingDistricts      |
     *       | houseName              | eg., "anyhousenamee" (String)          | houseName                  |
     *       | streetName             | eg., "streetss" (String)               | streetName                 |
     *       | place                  | eg., "someplacess" (String)            | place                      |
     *       | bio                    | eg., "<p>someone's bio</p>" (String)   | bio                        |
     *       | localBodyType          | eg., "4" (ID)                          | localBodyType              |
     *       | localBodyName          | eg., "14" (ID)                         | localBodyName              |
     *       | wardName               | eg., "2" (ID)                          | wardName                   |
     *       | postOffice             | eg., "1" (ID)                          | postOffice                 |
     *       | pinCode                | eg., "695587" (Pincode)                | pinCode                    |
     *       | userBasicDetailID      | eg., "146" (ID)                        | userBasicDetailID          |
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
     *         description: userBasicDetail object
     *         required: true
     *         schema:
     *            type: object
     *            properties:
     *               firstName:
     *                  type: string
     *               middleName:
     *                  type: string
     *               lastName:
     *                  type: string
     *               nickName:
     *                  type: string 
     *               userID:
     *                  type: integer 
     *               emailID:
     *                  type: string
     *               phoneNumber:
     *                  type: string 
     *               alternativePhoneNumber:
     *                  type: string
     *               gender:
     *                  type: string 
     *               dateOfBirth:
     *                  type: date
     *               bloodGroup:
     *                  type: string 
     *               country:
     *                  type: string
     *               state:
     *                  type: string 
     *               district:
     *                  type: string
     *               city:
     *                  type: string 
     *               locationID:
     *                  type: integer  
     *               representing districts:
     *                  type: string
     *               houseName:
     *                  type: string 
     *               streetName:
     *                  type: string 
     *               place:
     *                  type: string
     *               bio:
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
     *                  type: string      
     *               userBasicDetailID:
     *                  type: integer       
     *            example: # Sample object
     *               firstName: "test6"
     *               middlename: "te"
     *               lastName: "test6"
     *               nickName: "tet"
     *               userID: "74"
     *               emailID: "testmail12256@gmail.com"
     *               phoneNumber: "1231356"
     *               alternativePhoneNumber: "4561327890"
     *               gender: "1"
     *               dateOfBirth: "1901/02/06"
     *               bloodGroup: "5"
     *               country: "1"
     *               state: "2"
     *               district: "13"
     *               city: "14"
     *               locationID: "1"
     *               representingDistricts: [131,132,133]
     *               houseName: "anyhousenamee"
     *               streetName: "streetss"
     *               place: "someplacess"
     *               bio: "<p>someone's bio</p>"
     *               localBodyType: "4"
     *               localBodyName: "14"
     *               wardName: "1"
     *               postOffice: "2"
     *               pinCode: "695587"
     *               userBasicDetailID: "146"
     *     responses:
     *       200:
     *         description: Successfully updated user basic detail
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
     *                   example: ERROR_ALLFIELDMISSING or ERROR_INVALID_EMAIL or ERROR_INVALID_EMAIL
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
router.put("/api/user/basicdetail", (request, response) => {
    const { firstName,middleName, lastName, nickName, userID, userBasicDetailID,emailID,phoneNumber, alternativePhoneNumber, gender,dateOfBirth, bio,bloodGroup, country,state,district,
        city, locationID ,representingDistricts,houseName,streetName,place,localBodyType,localBodyName,wardName,postOffice,pinCode
         } = request.body;
  
    const userEnteredDetails = {
        firstName, middleName, lastName, nickName ,emailID,phoneNumber, alternativePhoneNumber, gender,dateOfBirth, bio,bloodGroup, country, state,district,userID,userBasicDetailID,
        city,locationID, representingDistricts,houseName,streetName,place,localBodyType,localBodyName,wardName,postOffice,pinCode
    };

    if (validator.isNullOrEmpty(userID)) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_NOUSERID,
      });
    } else if (validator.isNullOrEmpty(
        firstName) && validator.isNullOrEmpty(lastName) && validator.isNullOrEmpty(emailID) && validator.isNullOrEmpty(phoneNumber) && validator.isNullOrEmpty(gender) && 
          validator.isNullOrEmpty(dateOfBirth) && validator.isNullOrEmpty(bio) && validator.isNullOrEmpty(bloodGroup) && validator.isNullOrEmpty(state) &&
            validator.isNullOrEmpty(district) && validator.isNullOrEmpty(userBasicDetailID) && validator.isNullOrEmpty(city) && validator.isNullOrEmpty(locationID) && 
              validator.isNullOrEmpty(representingDistricts) && validator.isNullOrEmpty(houseName) && validator.isNullOrEmpty(streetName) && validator.isNullOrEmpty(place) && 
                validator.isNullOrEmpty(localBodyType) && validator.isNullOrEmpty(localBodyName) && validator.isNullOrEmpty(wardName) && validator.isNullOrEmpty(postOffice) && 
                  validator.isNullOrEmpty(pinCode ) && validator.isNullOrEmpty(country)&& validator.isNullOrEmpty(middleName)&& validator.isNullOrEmpty(nickName)&& validator.isNullOrEmpty(alternativePhoneNumber)
    ) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_ALLFIELDMISSING,
      });
    }
    if (
      !validator.isNullOrEmpty(emailID) &&
      !validator.isEmail(emailID)
    ) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_INVALID_EMAIL,
      });
    }
    basicUserDetailServices.updateBasicUserDetail(userEnteredDetails, (userBasicDetailID, errMsg) => {
      //If an error occured during the update
      if (errMsg) {
        console.error(errorMessages.ERROR_UPDATINGUSERS, errMsg);
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
        //if userBasicDetail updated
      } else {
        if (userBasicDetailID) {
          return response.status(200).json({
            success: true,
            data: userBasicDetailID,
            errMsg: null,
          });
        } else {
          // If userBasicDetail not updated
          return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_NOUSER_FOUND,
          });
        }
      }
    });
  });
  
  /*
Author     : Abhijith JS
Date       : 5 july 2024
Purpose    : Route for deleting user by input basicUserDetailID.
parameter  : dataPassed 
return type: boolean 
*/
/**
     * @swagger
     * /api/user/basicdetail/{id}:
     *   delete:
     *     tags:
     *       - : "basicUserDetail"
     *     summary: "delete basicUserDetails"
     *     description: |
     *       delete basicUserDetails
     *       | Key            | Value                          | Description                    |
     *       |----------------|--------------------------------|--------------------------------|
     *       | id             | eg.,"2"(ID)                    | ID to match and delete user    |
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
     *         description: ID of the user basic detail to retrieve
     *     responses:
     *       200:
     *         description: Successfully deleted user
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
     *                   description: userBasicDetailID
     *                 errMsg:
     *                   type: string
     *                   example: null
     *       400:
     *         description: userBasicDetailID not found
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
     *                   example: ERROR_FETCHING_USERDETAILS
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
router.delete("/api/user/basicdetail/:id", (request, response) => {
  const basicUserDetailID = request.params.id;
  // const actionCode = request.params.action;

  if (validator.isNullOrEmpty(basicUserDetailID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOUSER_BASICDETAILID,
    });
  }
  // if (validator.isNullOrEmpty(actionCode)) {
  //   return response.status(404).json({
  //     success: false,
  //     data: null,
  //     errMsg: errorMessages.ERROR_ACTIONCODEMISSING,
  //   });
  // }
   else {
    // const dataPassed = { basicUserDetailID, actionCode };
    const dataPassed =   basicUserDetailID ;

    basicUserDetailServices.deleteBasicUserDetail (dataPassed, (success, errMsg) => {
      if (errMsg) {
        // If any error occurs while deleting
        console.error(errorMessages.ERROR_FETCHING_USERDETAILS, errMsg);
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else if (success) {
        //userBasicDetail deleted successfully
        return response.status(200).json({
          success: true,
          data: true,
          errMsg: null,
        });
      } else {
        //No userBasicDetail found
        return response.status(200).json({
          success: false,
          data: false,
          errMsg: errorMessages.ERROR_NOUSER_FOUND,
        });
      }
    });
  }
});

module.exports = router;