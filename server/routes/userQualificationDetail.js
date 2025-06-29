const express = require('express');
const router = express.Router();
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const userQualificationDetailServices = require("../services/userQualificationDetail");
const { getUploadMiddleware, deleteMultipleImages  } = require("../common/commonFunctions");


/**
     * @swagger
     * /api/user/qualificationdetail:
     *   post:
     *     tags:
     *       - : "User Qualification Detail"
     *     summary: "Adding user qualification details"
     *     description: |
     *       Adding user qualification details
     *       | In       | Name                | Type   | Description               | Required |
     *       |----------|---------------------|--------|---------------------------|----------|
     *       | header   | Authorization       | string | Authorization token       | true     |
     *       | formData | uploads             | file   | The file to upload        | false    |
     *       | formData | qualificationTypeID | string | Qualification type ID     | false    |
     *       | formData | userID              | string | User ID                   | false    |
     *       | formData | enrollmentNumber    | string | Enrollment number         | false    |
     *       | formData | organizationID      | string | Organization ID           | false    |
     *       | formData | notes               | string | Additional notes          | false    |
     *       | formData | certificateNumber   | string | certificateNumber         | false    |
     *       | formData | certificateDate     | string | certificateDate           | false    |
     *       | formData | localBodytype       | string | localBodytype             | false    |
     *       | formData | localBodyName       | string | localBodyName             | false    |
     *       | formData | country             | string | country                   | false    |
     *       | formData | state               | string | state                     | false    |
     *       | formData | district            | string | district                  | false    |
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         schema:
     *            type: string
     *         required: true
     *       - in: formData
     *         name: uploads
     *         type: file
     *         description: The file to upload
     *         required: false
     *       - in: formData
     *         name: qualificationTypeID
     *         type: string
     *         description: qualificationTypeID
     *         required: false
     *       - in: formData
     *         name: userID
     *         type: string
     *         description: userID
     *         required: false 
     *       - in: formData
     *         name: enrollmentNumber
     *         type: string
     *         description: enrollmentNumber
     *         required: false     
     *       - in: formData
     *         name: organizationID
     *         type: string
     *         description: organizationID
     *         required: false
     *       - in: formData
     *         name: notes
     *         type: string
     *         description: notes
     *         required: false  
     *       - in: formData
     *         name: certificateNumber
     *         type: string
     *         description: certificateNumber
     *         required: false  
     *       - in: formData
     *         name: certificateDate
     *         type: string
     *         description: certificateDate
     *         required: false  
     *       - in: formData
     *         name: country
     *         type: string
     *         description: country
     *         required: false     
     *       - in: formData
     *         name: state
     *         type: string
     *         description: state
     *         required: false
     *       - in: formData
     *         name: district
     *         type: string
     *         description: district
     *         required: false  
     *       - in: formData
     *         name: localBodyType
     *         type: string
     *         description: localBodyType
     *         required: false  
     *       - in: formData
     *         name: localBodyName
     *         type: string
     *         description: localBodyName
     *         required: false 
     *     responses:
     *       201:
     *         description: Successfully created user qualification detail
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
     *                   description: User qualification detail response data
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

/*
Author     : Varun H M
Date       : 06 August 2024
Purpose    : Function for saving qualification  details 
Steps      : 
1. Upload the function in cloudinary
2. Validate input details are empty or not
3. If validation failed delete uploaded images else check for duplicate validation for enrollment number
4. Insert the data in database
*/

router.post("/api/user/qualificationdetail", (request, response) => {

  getUploadMiddleware()
    .then(upload => {

      upload(request, response, (err) => {
        if (err) {
          return response.status(500).json({success: false,
            data: null,
            errMsg: errorMessages.ERROR_FAILED_FILEUPLOAD+` ${err.message}`,});
        }

        // if (request.files) {
        //   const paths = request.files.map(upload => upload.path).join(', ');
        //   request.body.uploads = paths
        // }
        let uploadsInfo = []; // Define uploadsInfo in the correct scope

        if (request.files) {
          // Extracting paths, file types, and file names
          uploadsInfo = request.files.map(upload => ({
            path: upload.path,
            fileType: upload.mimetype,
            fileName: upload.originalname
          }));

          request.body.uploads = uploadsInfo.map(info => info.path).join(', ');
        }


        //getting new qualification details from request body
        let { qualificationTypeID, userID, enrollmentNumber, organizationID, notes, uploads, certificateNumber, certificateDate, country, state, district, localBodyType, localBodyName } = request.body;

        if (validator.isNullOrEmpty(qualificationTypeID) ||
          validator.isNullOrEmpty(userID) ||
          validator.isNullOrEmpty(enrollmentNumber) ||
          validator.isNullOrEmpty(organizationID) ||
          validator.isNullOrEmpty(certificateNumber) ||
          validator.isNullOrEmpty(certificateDate) ||
          validator.isNullOrEmpty(localBodyType) ||
          validator.isNullOrEmpty(localBodyName) ||
          validator.isNullOrEmpty(country) ||
          validator.isNullOrEmpty(state) ||
          validator.isNullOrEmpty(district)
        ) {
          if (request.files.length > 0 && request.files[0].filename) {
            deleteMultipleImages(request.files, (result, errMsg) => {
              if (errMsg) {
                return response.status(500).json({
                  success: false,
                  data: null,
                  errMsg: errorMessages.ERROR_FAILED_DELETING_IMAGE+` ${errMsg}`,
                });
              } else {
                return response.status(400).json({
                  success: false,
                  data: null,
                  errMsg: errorMessages.ERROR_ALLFIELDMISSING,
                })
              }
            })

          }
        }else{

        //passing qualification details into an object
        const userEnteredDetails = { qualificationTypeID, userID, enrollmentNumber, organizationID, notes, uploadsInfo, certificateNumber, certificateDate, country, state, district, localBodyType, localBodyName };

        userQualificationDetailServices.saveUserQualificationDetail(
          userEnteredDetails,
          (userQualificationDetailID, errMsg) => {
            if (errMsg) {
              console.error(errorMessages.ERROR_SAVING_BASIC_QUALIFICATIONDETAILS, errMsg);
              return response.status(400).json({
                success: false,
                data: null,
                errMsg: errMsg,
              });
            } else {
              return response.status(201).json({
                success: true,
                data: userQualificationDetailID,
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
        errMsg: errorMessages.ERROR_FAILED_CONFIGURE_CLOUDINARY+ `, ${err.message}`,
      });
    });
});

/**
 * @swagger
 * /api/search/user/qualificationdetail:
 *   post:
 *     tags:
 *       - : "User Qualification Detail"
 *     summary: "Searching user qualification details"
 *     description: |
 *       Searching user qualification details
 *       User data:
 *       | Key           | Value                                    | Description     |
 *       |---------------|------------------------------------------|-----------------|
 *       | firstName     | eg., "test6" (String)                    | First name      |
 *       | lastName      | eg., "test6" (String)                    | Last name       |
 *       | emailID       | eg., "testmail12256@gmail.com" (String)  | Email ID        |
 *       | phoneNumber   | eg., "1231356" (String)                  | Phone number    |
 *       | dateOfBirth   | eg., "1901/02/06" (String)               | Date of birth   |
 *       | bloodGroup    | eg., "B+" (String)                       | Blood group     |
 *       | houseName     | eg., "anyhousenamee" (String)            | House name      |
 *       | streetName    | eg., "streetss" (String)                 | Street name     |
 *       | district      | eg., "Thiruvananthapuram" (String)       | District        |
 *       | state         | eg., "Kerala" (String)                   | State           |
 *       | postOffice    | eg., "chempazhanthy" (String)            | Post office     |
 *       | pinCode       | eg., "695587" (String)                   | Pin code        |
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
 *         description: userBasicDetail object
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             emailID:
 *               type: string
 *             phoneNumber:
 *               type: string
 *             dateOfBirth:
 *               type: string  # Changed to string to match the example format
 *             bloodGroup:
 *               type: string
 *             houseName:
 *               type: string
 *             streetName:
 *               type: string
 *             district:
 *               type: string
 *             state:
 *               type: string
 *             postOffice:
 *               type: string
 *             pinCode:
 *               type: string
 *             userID:
 *               type: string
 *           example:  # Sample object
 *             firstName: "test6"
 *             lastName: "test6"
 *             emailID: "testmail12256@gmail.com"
 *             phoneNumber: "1231356"
 *             dateOfBirth: "1901/02/06"
 *             bloodGroup: "B+"
 *             houseName: "anyhousenamee"
 *             streetName: "streetss"
 *             district: "Thiruvananthapuram"
 *             state: "Kerala"
 *             postOffice: "chempazhanthy"
 *             pinCode: "695587"
 *             userID: "42"
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


/*
Author     : Varun H M
Date       : 06 August 2024
Purpose    : Function for seaching the data in qualification  details 
Steps      : 
1. Search for the matching details depends on key passed in payload
2. If no keys passed in payload then get all the datas from table
*/

router.post("/api/search/user/qualificationdetail", (request, response) => {
  //Store data from request.body to the variables
  const { firstName, lastName, emailID, phoneNumber,dateOfBirth,bloodGroup,houseName,streetName,district,state,postOffice,pinCode,userID }  = request.body;
  const userEnteredDetails = { firstName, lastName, emailID, phoneNumber,dateOfBirth,bloodGroup,houseName,streetName,district,state,postOffice,pinCode,userID };
  const { page, pageSize } = request.query;

  userQualificationDetailServices.searchUserQualificationDetail(
    userEnteredDetails,
    page,
    pageSize,
    (userDetails, errMsg) => {
      //If an error occured during the search
      if (errMsg) {
        console.error(errorMessages.ERROR_NOUSERQUALIFICATION_FOUND, errMsg);
        return response.status(200).json({
          success: true,
          data: [],
          errMsg: errorMessages.ERROR_NOUSERQUALIFICATION_FOUND,
        });
        //if user qualifications found
      } else {
        if (userDetails) {
          const totalCount = userDetails.length > 0 ? userDetails[0].total_count : 0;
          
          let canCreateQualification = true;
              canCreateQualification = userDetails.length > 0 ? userDetails[0].canCreateQualification == 1 ? false : canCreateQualification : false;

          const count = userDetails.length;
          const totaldata = {userDetails, page, pageSize, canCreateQualification, totalCount, count };

          return response.status(200).json({
            success: true,
            data: totaldata,
            errMsg: null,
          });
        } else {
          // If no user qualifications were found
          return response.status(500).json({
            success: false,
            data: [],
            errMsg: errorMessages.ERROR_NOUSERQUALIFICATION_FOUND,
          });
        }
      }
    }
  );
});



  
/*
Author     : Abhijith JS
Date       : 6 August 2024
Purpose    : Route for getting user qualification details by input userQualificationDetailID.
parameter  : userQualificationDetailID
return type: response object
*/
/**
     * @swagger
     * /api/get/user/qualificationdetail/{id}:
     *   get:
     *     tags:
     *       - : "User Qualification Detail"
     *     summary: "get User qualification details"
     *     description: |
     *       To get user Qualification details
     *       | Key            | Value                          | Description                          |
     *       |----------------|--------------------------------|--------------------------------------|
     *       | id             | eg.,"2"(ID)                    | ID to match and fetch Qualification  |     
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
     *         description: ID of the user qualification detail to retrieve
     *     responses:
     *       200:
     *         description: Successfully fetched Qualification
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
     *                   description: User Qualification details
     *                 errMsg:
     *                   type: string
     *                   example: null
     *       400:
     *         description: userQualificationDetailID not found
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
     *                   example: ERROR_NOUSER_QUALIFCATIONDETAILID
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
     *                   example: ERROR_NOUSERQUALIFICATIONS_FOUND
 */
  router.get("/api/get/user/qualificationdetail/:id", (request, response) => {
    const userQualificationDetailID = request.params.id;
  
    if (validator.isNullOrEmpty(userQualificationDetailID)) {
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_NOUSER_QUALIFCATIONDETAILID,
      });
    }
    userQualificationDetailServices.getUserQualificationDetailByID(userQualificationDetailID, (userQualificationDetail, errMsg) => {
      if (errMsg) {
        // If any error occurs while finding user qualification
        console.error(errorMessages.ERROR_NOUSERQUALIFICATIONS_FOUND, errMsg);
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If user qualification details fetched successfully
        return response.status(200).json({
          success: true,
          data: userQualificationDetail,
          errMsg: null,
        });
      }
    });
  });


  /*
Author     : Abhijith JS
Date       : 6 August 2024
Purpose    : Route for updating user qualification details.
parameter  : userEnteredDetails 
return type: number 
*/
/**
     * @swagger
     * /api/user/qualificationdetail:
     *   put:
     *     tags:
     *       - : "User Qualification Detail"
     *     summary: "Update user qualification"
     *     description: |
     *       Updating user qualification details
     *       | In       | Name                | Type   | Description               | Required |
     *       |----------|---------------------|--------|---------------------------|----------|
     *       | header   | Authorization       | string | Authorization token       | true     |
     *       | formData | uploads             | file   | The file to upload        | false    |
     *       | formData | qualificationTypeID | string | Qualification type ID     | false    |
     *       | formData | userID              | string | User ID                   | false    |
     *       | formData | enrollmentNumber    | string | Enrollment number         | false    |
     *       | formData | organizationID      | string | Organization ID           | false    |
     *       | formData | notes               | string | Additional notes          | false    |
     *       | formData | certificateNumber   | string | certificateNumber         | false    |
     *       | formData | certificateDate     | string | certificateDate           | false    |
     *       | formData | localBodytype       | string | localBodytype             | false    |
     *       | formData | localBodyName       | string | localBodyName             | false    |
     *       | formData | country             | string | country                   | false    |
     *       | formData | state               | string | state                     | false    |
     *       | formData | district            | string | district                  | false    |
     *       | formData | userQualificationDetailID| string | userQualificationDetailID| false    |
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         schema:
     *            type: string
     *         required: true
     *       - in: formData
     *         name: uploads
     *         type: file
     *         description: The file to upload
     *         required: false
     *       - in: formData
     *         name: qualificationTypeID
     *         type: string
     *         description: qualificationTypeID
     *         required: false
     *       - in: formData
     *         name: userID
     *         type: string
     *         description: userID
     *         required: false 
     *       - in: formData
     *         name: enrollmentNumber
     *         type: string
     *         description: enrollmentNumber
     *         required: false     
     *       - in: formData
     *         name: organizationID
     *         type: string
     *         description: organizationID
     *         required: false
     *       - in: formData
     *         name: notes
     *         type: string
     *         description: notes
     *         required: false  
     *       - in: formData
     *         name: certificateNumber
     *         type: string
     *         description: certificateNumber
     *         required: false  
     *       - in: formData
     *         name: certificateDate
     *         type: string
     *         description: certificateDate
     *         required: false  
     *       - in: formData
     *         name: country
     *         type: string
     *         description: country
     *         required: false     
     *       - in: formData
     *         name: state
     *         type: string
     *         description: state
     *         required: false
     *       - in: formData
     *         name: district
     *         type: string
     *         description: district
     *         required: false  
     *       - in: formData
     *         name: localBodyType
     *         type: string
     *         description: localBodyType
     *         required: false  
     *       - in: formData
     *         name: localBodyName
     *         type: string
     *         description: localBodyName
     *         required: false 
     *       - in: formData
     *         name: userQualificationDetailID
     *         type: string
     *         description: userQualificationDetailID
     *         required: false 
     *     responses:
     *       200:
     *         description: Successfully updated user qualification detail
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
     *                   description: User qualification detail response data
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
     *                   example: ERROR_ALLFIELDMISSING or ERROR_UPDATINGQUALIFICATION
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
  router.put("/api/user/qualificationdetail", (request, response) => {

    getUploadMiddleware()
    .then(upload => {
      upload(request, response, (err) => {
        if (err) {
          return response.status(500).json({success: false,
            data: null,
            errMsg: errorMessages.ERROR_FAILED_FILEUPLOAD+` ${err.message}`,});
        }

        let uploadsInfo = []; // Define uploadsInfo in the correct scope
        if (request.files) {
          // Extracting paths, file types, and file names
          uploadsInfo = request.files.map(upload => ({
            path: upload.path,
            fileType: upload.mimetype,
            fileName: upload.originalname
          }));
        }

        //getting new qualification details from request body
        let { qualificationTypeID,
          userID, 
          userQualificationDetailID,
          enrollmentNumber,
          organizationID,
          notes,
          removedFiles,
          certificateNumber,
          certificateDate,
          country,
          state,
          district,
          localBodyType,
          localBodyName,
           } = request.body;

        if (validator.isNullOrEmpty(qualificationTypeID) &&
          validator.isNullOrEmpty(userID) &&
          validator.isNullOrEmpty(enrollmentNumber) &&
          validator.isNullOrEmpty(organizationID) &&
          validator.isNullOrEmpty(certificateNumber) &&
          validator.isNullOrEmpty(certificateDate) &&
          validator.isNullOrEmpty(localBodyType) &&
          validator.isNullOrEmpty(localBodyName) &&
          validator.isNullOrEmpty(country) &&
          validator.isNullOrEmpty(state) &&
          validator.isNullOrEmpty(district)
        ) {
          if (request.files.length > 0 && request.files[0].filename) {
            deleteMultipleImages(request.files, (result, errMsg) => {
              if (errMsg) {
                return response.status(500).json({
                  success: false,
                  data: null,
                  errMsg: errorMessages.ERROR_FAILED_DELETING_IMAGE+` ${errMsg}`,
                });
              } else {
                return response.status(400).json({
                  success: false,
                  data: null,
                  errMsg: errorMessages.ERROR_ALLFIELDMISSING,
                })
              }
            })
          }else{
            return response.status(400).json({
              success: false,
              data: null,
              errMsg: errorMessages.ERROR_ALLFIELDMISSING,
            });
          }
        }

    let userEnteredDetails = { qualificationTypeID,
      userID, 
      userQualificationDetailID,
      enrollmentNumber,
      organizationID,
      notes,
      uploadsInfo,
      removedFiles,
      certificateNumber,
      certificateDate,
      country,
      state,
      district,
      localBodyType,
      localBodyName,
       };

    if (validator.isNullOrEmpty(qualificationTypeID) && validator.isNullOrEmpty(userQualificationDetailID) 
      && validator.isNullOrEmpty(enrollmentNumber)&& validator.isNullOrEmpty(organizationID) && validator.isNullOrEmpty(notes) 
    && validator.isNullOrEmpty(certificateNumber) && validator.isNullOrEmpty(certificateDate)&& validator.isNullOrEmpty(localBodyType) && validator.isNullOrEmpty(localBodyName)
    && validator.isNullOrEmpty(country)&& validator.isNullOrEmpty(state) && validator.isNullOrEmpty(district)) {
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

    userQualificationDetailServices.updateUserQualificationDetail(userEnteredDetails, (userQualificationDetailID, errMsg) => {
      //If an error occured during the update
      if (errMsg) {
        console.error(errorMessages.ERROR_UPDATINGQUALIFICATION, errMsg);
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
        //if userqualification updated
      } else {
        if (userQualificationDetailID) {
          return response.status(200).json({
            success: true,
            data: userQualificationDetailID,
            errMsg: null,
          });
        } else {
          // If userqualification not updated
          return response.status(200).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_NOUSERQUALIFICATIONS_FOUND,
          });
        }
      }
    });
})}).catch(err => {
  return response.status(500).json({
    success: false,
    data: null,
    errMsg: errorMessages.ERROR_FAILED_CONFIGURE_CLOUDINARY+ `, ${err.message}`,
  });
    });
  });




/*
Author     : Abhijith JS
Date       : 6 August 2024
Purpose    : Route to delete a userqualification by matching userQualificationDetailID.
parameter  : userQualificationDetailID 
return type: callback
*/
/**
     * @swagger
     * /api/user/qualificationdetail/{id}:
     *   delete:
     *     tags:
     *       - : "User Qualification Detail"
     *     summary: "delete User qualification"
     *     description: |
     *       To delete User qualification Details
     *       | Key            | Value                          | Description                                        |
     *       |----------------|--------------------------------|----------------------------------------------------|
     *       | id             | eg.,"2"(ID)                    | ID to match and delete User Qualification Detail   |
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
     *         description: ID of the User qualification detail to delete
     *     responses:
     *       200:
     *         description: Successfully deleted User qualification
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
     *                   description: userQualificationDetailID
     *                 errMsg:
     *                   type: string
     *                   example: null
     *       400:
     *         description: user Qualification Details not found
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
     *                   example: ERROR_NOUSERQUALIFICATION_FOUND
     *       404:
     *         description: userQualificationDetailID not found
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
     *                   example: ERROR_NOUSER_QUALIFCATIONDETAILID
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
     *                   example: ERROR_NOUSERQUALIFICATIONS_FOUND
 */
  router.delete("/api/user/qualificationdetail/:id", (request, response) => {
    const userQualificationDetailID = request.params.id;
  
    if (validator.isNullOrEmpty(userQualificationDetailID)) {
      return response.status(404).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_NOUSER_QUALIFCATIONDETAILID,
      });
    }else {
  
      userQualificationDetailServices.deleteUserQualificationDetail (userQualificationDetailID, (success, errMsg) => {
        if (errMsg) {
          // If any error occurs while deleting
          console.error(errorMessages.ERROR_NOUSERQUALIFICATION_FOUND, errMsg);
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else if (success) {
          //user qualification deleted successfully
          return response.status(200).json({
            success: true,
            data: true,
            errMsg: null,
          });
        } else {
          //No user qualifications found
          return response.status(500).json({
            success: false,
            data: false,
            errMsg: errorMessages.ERROR_NOUSERQUALIFICATIONS_FOUND,
          });
        }
      });
    }
  });




module.exports = router;