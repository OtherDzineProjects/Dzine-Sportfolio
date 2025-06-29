const express = require('express');
const router = express.Router();
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const userContactDetailServices = require("../services/userContactDetail");




/**
     * @swagger
     * /api/user/contactdetail:
     *   post:
     *     tags:
     *       - : "User contactdetail"
     *     summary: "Add new contactdetail"
     *     description: |
     *       Add new contactdetail
     *       contactdetail user data:
     *       | Key                  | Value                            | Description                |
     *       |----------------------|----------------------------------|----------------------------|
     *       | userID               | eg.,"1"(String)                  | userID                 |
     *       | addressType          | eg.,"2"(String)                  | addressType                 |
     *       | country              | eg.,"1"(ID)                      | country                    |
     *       | state                | eg.,"2"(ID)                      | state                      |
     *       | district             | eg.,"13"(ID)                     | district                   |
     *       | city                 | eg.,"14"(ID)                     | city                       |
     *       | houseName            | eg.,"anyhousenamee"(String)      | houseName                  |
     *       | streetName           | eg.,"streetss"(String)           | streetName                 |
     *       | place                | eg.,"someplacess"(String)        | place                      |
     *       | localBodyType        | eg.,"50"(ID)                     | localBodyType              |
     *       | localBodyName        | eg.,"50"(ID)                     | localBodyName              |
     *       | wardName             | eg.,"1"(ID)                      | wardName                   |
     *       | postOffice           | eg.,"2"(ID)                      | postOffice                 |
     *       | pinCode              | eg.,"695587"(Pincode)            | pinCode                    |
     *       | communicationDetails | eg.,[{"communicationTypeId":"HomePhone","value": "1234567890"},{"communicationTypeId":"EmailID","value": "some123@gmail"}](Pincode) | communicationDetails       |
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
     *               userID:
     *                  type: string
     *               addressType:
     *                  type: string 
     *               country:
     *                  type: string 
     *               state:
     *                  type: string 
     *               district:
     *                  type: string
     *               city:
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
     *               communicationDetails:
     *                  type: array      
     *            example: # Sample object
     *               userID: "1"
     *               addressType: "2"
     *               country: "1"
     *               state: "2"
     *               district: "13"
     *               city: "14"
     *               houseName: "anyhousename"
     *               streetName: "streets"
     *               place: "someplacess"
     *               localBodyType: "50"
     *               localBodyName: "50"
     *               wardName: "50"
     *               postOffice: "chempazhanthy"
     *               pinCode: "695587"
     *               communicationDetails: [{"communicationTypeId":"1","value": "1234567890"},{"communicationTypeId":"2","value": "some123@gmail"}]
     *     responses:
     *       201:
     *         description: Successfully saved user contact detail
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
     *                   description: userContactDetailID
     *                 errMsg:
     *                   type: string
     *                   example: null
     *       400:
     *         description: Error saving data
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
     *                   example: ERROR_SAVING_USER_CONTACTDETAILS
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
Date       : 14 August 2024
Purpose    : Route for saving user contact details.
parameter  :  userEnteredDetails
return type: response object 
*/
router.post("/api/user/contactdetail", (request, response) => {
    //getting new USER CONTACT DETAILS details from request body
    const { 
        addressType, country, state, district, city, houseName, streetName, place
        ,localBodyType, localBodyName, wardName, postOffice, pinCode, userID, communicationDetails, sameAsBasicDetail 
    } = request.body;

    //passing user contact details into an object
    const userEnteredDetails = { 
        userID, addressType, country, state, district, city, houseName,streetName
        ,place, localBodyType, localBodyName, wardName, postOffice, pinCode, communicationDetails, sameAsBasicDetail, 
    };
    userContactDetailServices.saveUserContactDetail(
        userEnteredDetails,
      (userContactDetailID, errMsg) => {
        if (errMsg) {
          console.error(errorMessages.ERROR_SAVING_USER_CONTACTDETAILS, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else if(validator.isNullOrEmpty(userContactDetailID)){
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_USER_CONTACTDETAILEXISTS,
          });
        }else{
          return response.status(201).json({
            success: true,
            data: userContactDetailID,
            errMsg: null,
          });
        }
      }
    );
  });



/**
     * @swagger
     * /api/get/user/contactdetail/{id}:
     *   get:
     *     tags:
     *       - : "User contactdetail"
     *     summary: "get contact Details"
     *     description: |
     *       get contact Details based on matching userContactDetailID
     *       | Key                  | Value                | Description               |
     *       |----------------------|----------------------|---------------------------|
     *       | userContactDetailID  | eg.,"1"(ID)   | ID of the userContactDetailID   |
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
     *         description: userContactDetailID of the region to match
     *     responses:
     *       200:
     *         description: Successfully fetched contact data
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
     *                   description: contact response data
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
     *                   example: ERROR_FETCHING_USERDETAILS
     *       400:
     *         description: ContactdetailID missing
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
     *                   example: ERROR_NOUSER_CONTACTDETAILID
 */
/*
Author     : Abhijith JS
Date       : 14 August 2024
Purpose    : Route for fetching user contact details by matching id.
parameter  :  userContactDetailID
return type: response object 
*/
  router.get("/api/get/user/contactdetail/:id", (request, response) => {
    const userContactDetailID = request.params.id;
  
    if (validator.isNullOrEmpty(userContactDetailID)) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_NOUSER_CONTACTDETAILID,
      });
    }
    userContactDetailServices.getUserContactDetailByID(userContactDetailID, (userContactDetail, errMsg) => {
      if (errMsg) {
        // If any error occurs while finding user contact details
        console.error(errorMessages.ERROR_FETCHING_USERDETAILS, errMsg);
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If user contact details fetched successfully
        return response.status(200).json({
          success: true,
          data: userContactDetail,
          errMsg: null,
        });
      }
    });
  });



/**
     * @swagger
     * /api/user/contactdetail:
     *   put:
     *     tags:
     *       - : "User contactdetail"
     *     summary: "Update User contactdetail"
     *     description: |
     *       Update User contactdetail:
     *       | Key                  | Value                            | Description                |
     *       |----------------------|----------------------------------|----------------------------|
     *       | userID               | eg.,"1"(String)                  | userID                 |
     *       | addressType          | eg.,"2"(String)                  | addressType                |
     *       | country              | eg.,"1"(ID)                      | country                    |
     *       | state                | eg.,"2"(ID)                      | state                      |
     *       | district             | eg.,"13"(ID)                     | district                   |
     *       | city                 | eg.,"14"(ID)                     | city                       |
     *       | houseName            | eg.,"anyhousenamee"(String)      | houseName                  |
     *       | streetName           | eg.,"streetss"(String)           | streetName                 |
     *       | place                | eg.,"thiruvananthapuram"(String)        | place                      |
     *       | localBodyType        | eg.,"5"(ID)                     | localBodyType              |
     *       | localBodyName        | eg.,"15"(ID)                     | localBodyName              |
     *       | wardName             | eg.,"1"(ID)                     | wardName                   |
     *       | postOffice           | eg.,"2"(String)      | postOffice                 |
     *       | pinCode              | eg.,"695587"(Pincode)            | pinCode                    |
     *       | communicationDetails | eg.,[{"communicationTypeId":"16","value": "1234567890"},{"communicationTypeId":"15","value": "some123@gmail"}](json Array) | communicationDetails       |
     *       | userContactDetailID  | eg.,"1"(userContactDetailID)     | userContactDetailID        |
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
     *               userID:
     *                  type: string
     *               addressType:
     *                  type: string 
     *               country:
     *                  type: string 
     *               state:
     *                  type: string 
     *               district:
     *                  type: string
     *               city:
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
     *               communicationDetails:
     *                  type: array      
     *               userContactDetailID:
     *                  type: string
     *            example: # Sample object
     *               userID: "1"
     *               addressType: "2"
     *               country: "1"
     *               state: "2"
     *               district: "13"
     *               city: "14"
     *               houseName: "anyhousename"
     *               streetName: "streets"
     *               place: "someplacess"
     *               localBodyType: "5"
     *               localBodyName: "15"
     *               wardName: "1"
     *               postOffice: "2"
     *               pinCode: "695587"
     *               communicationDetails: [{"communicationTypeId":"16","value": "1234567890"},{"communicationTypeId":"15","value": "some123@gmail.com"}]
     *               userContactDetailID: "1"
     *     responses:
     *       200:
     *         description: Successfully updated user contact detail
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
     *                   description: userContactDetailID
     *                 errMsg:
     *                   type: string
     *                   example: null or ERROR_NOUSER_FOUND
     *       400:
     *         description: Error saving data
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
     *                   example: ERROR_UPDATINGUSERCONTACT or ERROR_ALLFIELDMISSING or ERROR_NOUSER_CONTACTDETAILID
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
Date       : 15 August 2024
Purpose    : Route for updating user contact details.
parameter  :  userEnteredDetails
return type: response object 
*/
  router.put("/api/user/contactdetail", (request, response) => {
    const { 
      addressType, country, state, district, city, houseName, streetName, place
      ,localBodyType, localBodyName, wardName, postOffice, pinCode, communicationDetails, userContactDetailID, sameAsBasicDetail, 
  } = request.body;

  const userID = request.body.userID;
    if (validator.isNullOrEmpty(userContactDetailID)) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_NOUSER_CONTACTDETAILID,
      });
    } else if (validator.isNullOrEmpty(
      addressType) && validator.isNullOrEmpty(country) && validator.isNullOrEmpty(state) && validator.isNullOrEmpty(district) && validator.isNullOrEmpty(city)
        && validator.isNullOrEmpty(houseName) && validator.isNullOrEmpty(streetName) && validator.isNullOrEmpty(place) && validator.isNullOrEmpty(localBodyType) 
          && validator.isNullOrEmpty(localBodyName) && validator.isNullOrEmpty(wardName) && validator.isNullOrEmpty(postOffice) 
            && validator.isNullOrEmpty(pinCode ) && validator.isNullOrEmpty(communicationDetails)
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
      });}
    const userEnteredDetails = { 
      addressType, country, state, district, city, houseName, streetName, place
      ,localBodyType, localBodyName, wardName, postOffice, pinCode, communicationDetails, userContactDetailID, userID, sameAsBasicDetail, 
  };

    userContactDetailServices.updateUserContactDetail(userEnteredDetails, (userContactDetailID, errMsg) => {
      //If an error occured during the update
      if (errMsg) {
        console.error(errorMessages.ERROR_UPDATINGUSERCONTACT, errMsg);
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
        //if user contact info updated
      } else {
        if (userContactDetailID) {
          return response.status(200).json({
            success: true,
            data: userContactDetailID,
            errMsg: null,
          });
        } else {
          // If user contact details not updated
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_NOUSER_CONTACTDETAILS_FOUND,
          });
        }
      }
    });
  });



/**
     * @swagger
     * /api/search/user/contactdetail:
     *   post:
     *     tags:
     *       - : "User contactdetail"
     *     summary: "search User contactdetail"
     *     description: |
     *       To search User contactdetail by userID
     *       Basic user data:
     *       | Key                   | Value                                  | Description                |
     *       |-----------------------|----------------------------------------|----------------------------|
     *       | userID                | eg., "1" (ID)                          | userID                     |
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         schema:
     *            type: string
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
     *         description: Number of records per page
     *         required: false
     *       - in: body
     *         name: body
     *         description: User contactdetail object
     *         required: false
     *         schema:
     *            type: object
     *            properties:
     *               userID:
     *                  type: string      
     *            example: # Sample object
     *               userID: "1"
     *     responses:
     *       200:
     *         description: Successfully fetched user contact details
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
     *                   description: User contact detail response data
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
     *                   example: ERROR_NOUSER_CONTACTDETAILS_FOUND
 */
/*
Author     : Abhijith JS
Date       : 22 August 2024
Purpose    : Route for searching user contact details by matching userid.
parameter  :  userID
return type: response object 
*/
router.post("/api/search/user/contactdetail", (request, response) => {

  const {userID}  = request.body;
  const { page, pageSize } = request.query;

  userContactDetailServices.searchUserContactDetail(
    userID,
    page,
    pageSize,
    (userDetailsResult, errMsg) => {
      //If an error occured during the search
      if (errMsg) {
        console.error(errorMessages.ERROR_NOUSER_CONTACTDETAILS_FOUND, errMsg);
        return response.status(500).json({
          success: false,
          data: [],
          errMsg: errMsg,
        });
        //if user contact details found
      } else {
        if (userDetailsResult) {

          const userDetails = userDetailsResult.map(userData => ({
            ...userData,
            sameAsBasicDetail: !!userData.sameAsBasicDetail // Convert non-zero values to `true`, zero to `false`
          }));
          

          const totalCount = userDetailsResult.length > 0 ? userDetailsResult[0].total_count : 0;
          const count = userDetailsResult.length;
          const totaldata = {userDetails, page, pageSize, totalCount, count };

          return response.status(200).json({
            success: true,
            data: totaldata,
            errMsg: null,
          });
        } else {
          // If no user contact details were found
          return response.status(200).json({
            success: false,
            data: [],
            errMsg: errorMessages.ERROR_NOUSER_CONTACTDETAILS_FOUND,
          });
        }
      }
    }
  );
});




/**
     * @swagger
     * /api/user/contactdetail/{id}:
     *   delete:
     *     tags:
     *       - : "User contactdetail"
     *     summary: "delete user contactdetail"
     *     description: |
     *       delete User contactdetail
     *       | Key            | Value                          | Description                                |
     *       |----------------|--------------------------------|--------------------------------------------|
     *       | id             | eg.,"2"(ID)                    | ID to match and delete User contactdetail  |
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
     *         description: ID of the User contactdetail to retrieve and delete
     *     responses:
     *       200:
     *         description: Successfully deleted User contactdetail
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
     *                   description: userContactDetailID
     *                 errMsg:
     *                   type: string
     *                   example: null or ERROR_NOUSER_CONTACTDETAILS_FOUND
     *       400:
     *         description: userContactDetailID not found
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
     *                   example: ERROR_NOUSER_CONTACTDETAILS_FOUND
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
Date       : 22 August 2024
Purpose    : Route for deleting user contact details by matching id.
parameter  :  userContactDetailID
return type: boolean 
*/
  router.delete("/api/user/contactdetail/:id", (request, response) => {
    const userContactDetailID = request.params.id;
    if (validator.isNullOrEmpty(userContactDetailID)) {
      return response.status(404).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_NOUSER_CONTACTDETAILID,
      });
    }
      // const dataPassed =   userContactDetailID ;
  
      userContactDetailServices.deleteUserContactDetail (userContactDetailID, (success, errMsg) => {
        if (errMsg) {
          // If any error occurs while deleting
          console.error(errorMessages.ERROR_NOUSER_CONTACTDETAILS_FOUND, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else if (success) {
          //user contact details deleted successfully
          return response.status(200).json({
            success: true,
            data: true,
            errMsg: null,
          });
        } else {
          //No user contact found
          return response.status(200).json({
            success: false,
            data: false,
            errMsg: errorMessages.ERROR_NOUSER_CONTACTDETAILS_FOUND,
          });
        }
      });
    
  });




    module.exports = router;