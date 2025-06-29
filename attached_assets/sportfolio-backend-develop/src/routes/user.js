const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const userServices = require("../services/user");
const validator = require("../common/validation");
const { encryptPassword } = require("../common/commonFunctions");
const errorMessages = require("../common/errorMessages");
const { getUploadMiddleware, deleteMultipleImages  } = require("../common/commonFunctions");



/**
     * @swagger
     * /api/user:
     *   post:
     *     tags:
     *       - : "User"
     *     summary: "Add new user"
     *     description: |
     *       Add new user
     *       User data:
     *       | Key         | Value                             | Description          |
     *       |-------------|-----------------------------------|----------------------|
     *       | firstName   | eg., "test6" (String)             | First name           |
     *       | lastName    | eg., "test67" (String)            | Last name            |
     *       | phoneNumber | eg., "1234567890" (String)        | Phone number         |
     *       | email       | eg., "mail123@gmail.com" (String) | Email                |
     *       | password    | eg., "159456" (String)            | Password             |
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
     *         description: user object
     *         required: true
     *         schema:
     *            type: object
     *            properties:
     *               firstName:
     *                  type: string
     *               lastName:
     *                  type: string 
     *               phoneNumber:
     *                  type: integer 
     *               email:
     *                  type: string 
     *               password:
     *                  type: string
     *            example: # Sample object
     *               firstName: "test6"
     *               lastName: "test67"
     *               phoneNumber: "1234567890"
     *               email: "mail123@gmail.com"
     *               password: "159456"
     *     responses:
     *       201:
     *         description: Successfully created user
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
     *                   description: User detail response data
     *                 errMsg:
     *                   type: string
     *                   example: null
     *       400:
     *         description: Error saving user
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
Date       : 17 May 2024
Purpose    : Route for user signup.
parameter  : signUpData 
return type: number //userID
*/
router.post("/api/user", (request, response) => {
  const { firstName, lastName, phoneNumber, email, password } = request.body;

  if (
    validator.isNullOrEmpty(firstName) ||
    validator.isNullOrEmpty(lastName) ||
    validator.isNullOrEmpty(phoneNumber) ||
    validator.isNullOrEmpty(email) ||
    validator.isNullOrEmpty(password)
  ) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_MISSINGFIELDS,
    });
  }
  // Encrypting the password
  const encryptedPassword = encryptPassword(password);

  // Values parameters to be inserted into the query
  const userEnteredDetails = {
    firstName,
    lastName,
    phoneNumber,
    email,
    encryptedPassword,
  };

  userServices.saveUser(userEnteredDetails, (userID, errMsg) => {
    if (errMsg) {
      console.error(errorMessages.ERROR_SAVINGUSER, errMsg);
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errMsg,
      });
    } else {
      return response.status(201).json({
        success: true,
        data: userID,
        errMsg: null,
      });
    }
  });
});



/**
     * @swagger
     * /api/get/user/{id}:
     *   get:
     *     tags:
     *       - : "User"
     *     summary: "get User details"
     *     description: |
     *       To get User details
     *       | Key           | Value           | Description                 |
     *       |---------------|-----------------|-----------------------------|
     *       | UserID        | eg.,"2"(ID)     | ID to match and fetch user  |
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
     *         description: ID of the User to retrieve
     *     responses:
     *       200:
     *         description: Successfully fetched User
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
     *                   description: User details
     *                 errMsg:
     *                   type: string
     *                   example: null
     *       400:
     *         description: UserID not found
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
     *                   example: ERROR_NOUSERID
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
Date       : 17 May 2024
Purpose    : Route for getting user by input id.
parameter  : userID 
return type: response object
*/
router.get("/api/get/user/:userID", (request, response) => {
  const userID = request.params.userID;

  if (validator.isNullOrEmpty(userID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOUSERID,
    });
  }
  userServices.getUserById(userID, (user, errMsg) => {
    if (errMsg) {
      // If any error occurs while finding user
      console.error(errorMessages.ERROR_FETCHING_USERDETAILS, errMsg);
      return response.status(404).json({
        success: false,
        data: null,
        errMsg: errMsg,
      });
    } else {
      // If user details fetched successfully
      return response.status(200).json({
        success: true,
        data: user,
        errMsg: null,
      });
    }
  });
});

/**
     * @swagger
     * /api/search/user:
     *   post:
     *     tags:
     *       - : "User"
     *     summary: "Search User"
     *     description: |
     *       To Search User/ user's
     *       | Key         | Value                           | Description   |
     *       |-------------|---------------------------------|---------------|
     *       | firstName   | eg., "test6" (String)           | First name    |
     *       | lastName    | eg., "test65" (String)          | Last name     |
     *       | phoneNumber | eg., "1234567890" (String)      | Phone number  |
     *       | email       | eg., "test6@gmail.com" (String) | Email         |
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
     *         description: User object
     *         required: true
     *         schema:
     *            type: object
     *            properties:
     *               firstName:
     *                  type: string
     *               lastName:
     *                  type: string 
     *               phoneNumber:
     *                  type: integer 
     *               email:
     *                  type: string
     *            example: # Sample object
     *               firstName: "test6"
     *               lastName: "test65"
     *               phoneNumber: "1234567890"
     *               email: "test6@gmail.com"
     *     responses:
     *       200:
     *         description: Successfully fetched users
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
     *                   description: User detail response data
     *                 errMsg:
     *                   type: string
     *                   example: null or ERROR_NOUSER_FOUND
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
     *                   example: errMsg
 */
/*
Author     : Abhijith JS
Date       : 20 May 2024
Purpose    : Route for Searching array of users matching the user input details.
parameter  : userEnteredDetails 
return type: response object 
*/

router.post("/api/search/user", (request, response) => {
  //Store data from request.body to the variables
  const { firstName, lastName, phoneNumber, email } = request.body;
  const userEnteredDetails = { firstName, lastName, phoneNumber, email };
  const { page, pageSize } = request.query;

  userServices.searchUser(
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
        //if users found
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
          // If no users were found
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


/**
 * @swagger
 * /api/key/search/user:
 *   post:
 *     tags:
 *       - : User
 *     summary: "Search User"
 *     description: |
 *       Searches for users based on the provided keyword and pagination parameters.
 *       Returns user details along with pagination info.
 *       | In       | Name              | Type   | Description                           | Required |
 *       |----------|-------------------|--------|---------------------------------------|----------|
 *       | query    | page              | integer| Page number for pagination            | false    |
 *       | query    | pageSize          | integer| Number of users per page              | false    |
 *       | body     | keywordSearchText | string | The keyword to search for             | true     |
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
 *         description: Number of users per page
 *         required: false
 *       - in: body
 *         name: keywordSearchText
 *         schema:
 *           type: object
 *           properties:
 *             keywordSearchText:
 *               type: string
 *               example: "John"
 *               description: The keyword to search for
 *         required:
 *           - keywordSearchText
 *     responses:
 *       200:
 *         description: Successfully retrieved user search results
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
 *                     keywordSearchuserDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           total_count:
 *                             type: integer
 *                             example: 100
 *                           userDetails:
 *                             type: array
 *                             items:
 *                               type: object
 *                             description: List of user details
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

/*
Author     : Abhijith JS
Date       : 27 September 2024
Purpose    : Route for Searching array of users matching ANY user input details.
parameter  : keywordSearchText 
return type: response object 
*/
router.post("/api/key/search/user", (request, response) => {
  //Store data from request.body to the variables
  const { keywordSearchText } = request.body;
  const { page, pageSize } = request.query;
  const userID = request.headers.userID;

  userServices.keySearchUser(
    keywordSearchText,
    userID,
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
        //if users found
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
          // If no users were found
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



/**
     * @swagger
     * /api/user/{userID}:
     *   put:
     *     tags:
     *       - : "User"
     *     summary: "Update User"
     *     description: |
     *       To update the User
     *       | Key         | Value                           | Description   |
     *       |-------------|---------------------------------|---------------|
     *       | firstName   | eg., "test6" (String)           | First name    |
     *       | lastName    | eg., "test65" (String)          | Last name     |
     *       | phoneNumber | eg., "1234567890" (String)      | Phone number  |
     *       | email       | eg., "test6@gmail.com" (String) | Email         |
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         schema:
     *            type: string
     *         required: true
     *       - in: path
     *         name: userID
     *         required: true
     *         schema:
     *           type: string
     *       - in: body
     *         name: body
     *         description: User object
     *         required: true
     *         schema:
     *            type: object
     *            properties:
     *               firstName:
     *                  type: string
     *               lastName:
     *                  type: string 
     *               phoneNumber:
     *                  type: integer 
     *               email:
     *                  type: string
     *            example: # Sample object
     *               firstName: "test6"
     *               lastName: "test65"
     *               phoneNumber: "1234567890"
     *               email: "test6@gmail.com"
     *     responses:
     *       200:
     *         description: Successfully updated User details
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
     *                   description: User details response data
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
     *                   example: errMsg or ERROR_ALLFIELDMISSING or ERROR_NOUSERID
 */
/*
Author     : Abhijith JS
Date       : 21 May 2024
Purpose    : Route for updating user details.
parameter  : userEnteredDetails 
return type: number //userID
*/
router.put("/api/user/:userID", (request, response) => {
  const { firstName, lastName, phoneNumber, email, password } = request.body;

  const userID = request.params.userID;
  const userEnteredDetails = {
    firstName,
    lastName,
    phoneNumber,
    email,
    userID,
  };

  if (validator.isNullOrEmpty(userID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOUSERID,
    });
  } else if (
    validator.isNullOrEmpty(firstName) &&
    validator.isNullOrEmpty(lastName) &&
    validator.isNullOrEmpty(phoneNumber) &&
    validator.isNullOrEmpty(email)
  ) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ALLFIELDMISSING,
    });
  }

  userServices.updateUser(userEnteredDetails, (updatedUserID, errMsg) => {
    //If an error occured during the update
    if (errMsg) {
      console.error(errorMessages.ERROR_UPDATINGUSERS, errMsg);
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errMsg,
      });
      //if user updated
    } else {
      if (updatedUserID) {
        return response.status(200).json({
          success: true,
          data: updatedUserID,
          errMsg: null,
        });
      } else {
        // If user not updated
        return response.status(200).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_NOUSER_FOUND,
        });
      }
    }
  });
});



/**
     * @swagger
     * /api/user/{id}/action/{action}:
     *   delete:
     *     tags:
     *       - : "User"
     *     summary: "delete User"
     *     description: |
     *       To delete User
     *       | Key           | Value           | Description                 |
     *       |---------------|-----------------|-----------------------------|
     *       | UserID        | eg.,"2"(ID)     | ID to match and delete user |
     *       | Action code   | eg.,"D"(ID)     | Actioncode to be saved      |
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
     *         description: ID of the User to delete
     *       - in: path
     *         name: action
     *         required: true
     *         schema:
     *           type: string
     *         description: action code for the User to delete
     *     responses:
     *       200:
     *         description: Successfully deleted User
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
     *                   description: UserID
     *                 errMsg:
     *                   type: string
     *                   example: null or ERROR_NOUSER_FOUND
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
     *                   example: ERROR_ACTIONCODEMISSING or ERROR_USERIDMISSING
 */
/*
Author     : Abhijith JS
Date       : 20 May 2024
Purpose    : Route for deleting user by input userID.
parameter  : userID 
return type: boolean 
*/
router.delete("/api/user/:id/action/:action", (request, response) => {
  const userID = request.params.id;
  const actionCode = request.params.action;

  if (validator.isNullOrEmpty(userID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_USERIDMISSING,
    });
  }
  if (validator.isNullOrEmpty(actionCode)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ACTIONCODEMISSING,
    });
  } else {
    const dataPassed = { userID, actionCode };
    userServices.deleteUser(dataPassed, (success, errMsg) => {
      if (errMsg) {
        // If any error occurs while deleting
        console.error(errorMessages.ERROR_FETCHING_USERDETAILS, errMsg);
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
          errMsg: errorMessages.ERROR_NOUSER_FOUND,
        });
      }
    });
  }
});


/*
Author     : ABHIJITH JS
Date       : 30 September 2024
Purpose    : Function for saving user Avatar/profile photo 
Steps      : 
1. Upload the function in cloudinary
2. Validate input details are empty or not
3. Insert the data in database
*/
/**
 * @swagger
 * /api/user/avatar:
 *   post:
 *     tags:
 *       - : "User"
 *     summary: Upload user avatar
 *     description: |
 *       Allows users to upload an avatar image. The uploaded file is stored and associated with the user.
 *       | Key       | Value                 | Description                         |
 *       |-----------|-----------------------|-------------------------------------|
 *       | userID    | eg., "123" (integer)  | ID of the user uploading the avatar |
 *       | uploads   | Image file (binary)   | Avatar image file to upload         |
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
 *         description: Bearer token for authentication
 *       - in: formData
 *         name: userID
 *         type: string
 *         required: true
 *         description: ID of the user uploading the avatar
 *       - in: formData
 *         name: uploads
 *         type: file
 *         required: true
 *         description: The avatar image file to be uploaded
 *     responses:
 *       201:
 *         description: Avatar uploaded successfully
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
 *                   description: Document ID of the uploaded avatar
 *                   example: 12345
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
 *                   example: "ERROR_USERIDMISSING"
 *       500:
 *         description: Internal server error or file upload failure
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
 *                   example: "ERROR_FAILED_FILEUPLOAD: File size too large"
 */
router.post("/api/user/avatar", (request, response) => {

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

          request.body.uploads = uploadsInfo;
        }

        let { userID } = request.body;

        if ( validator.isNullOrEmpty(userID) ) {
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
                  errMsg: errorMessages.ERROR_USERIDMISSING,
                })
              }
            })

          }
        }else{

        //passing avatar data into an object
        const userEnteredDetails = { userID, uploadsInfo };

        userServices.saveUserAvatar(
          userEnteredDetails,
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
        errMsg: errorMessages.ERROR_FAILED_CONFIGURE_CLOUDINARY+ `, ${err.message}`,
      });
    });
});


/*
Author     : Abhijith JS
Date       : 30 September 2024
Purpose    : Route for updating user Avatar/profile photo.
parameter  : userEnteredDetails 
return type: number 
*/
/**
 * @swagger
 * /api/useravatar:
 *   put:
 *     tags:
 *       - : "User"
 *     summary: Update user avatar
 *     description: |
 *       Updates the avatar of a user. The user ID and document ID are required.
 *       | Key         | Value                 | Description                                   |
 *       |-------------|-----------------------|-----------------------------------------------|
 *       | userID      | eg., "123" (integer)  | ID of the user whose avatar is being updated |
 *       | documentID  | eg., "456" (integer)  | ID of the existing avatar document           |
 *       | file        | Image file (binary)   | New avatar image file to update              |
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
 *         description: Bearer token for authentication
 *       - in: formData
 *         name: userID
 *         type: string
 *         required: true
 *         description: ID of the user whose avatar is being updated
 *       - in: formData
 *         name: documentID
 *         type: string
 *         required: true
 *         description: ID of the existing avatar document
 *       - in: formData
 *         name: uploads
 *         type: file
 *         required: true
 *         description: The new avatar image file to upload
 *     responses:
 *       200:
 *         description: Avatar updated successfully
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
 *                   description: Document ID of the updated avatar
 *                   example: 12345
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
 *         description: Internal server error or file upload failure
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
 *                   example: "ERROR_FAILED_FILEUPLOAD: File size too large"
 */
router.put("/api/useravatar", (request, response) => {

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

      let { 
        userID, 
        documentID
         } = request.body;

      if (validator.isNullOrEmpty(userID) ||
          validator.isNullOrEmpty(documentID)
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

  let userEnteredDetails = { userID, uploadsInfo, documentID };

  if (validator.isNullOrEmpty(documentID) && validator.isNullOrEmpty(userID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_ALLFIELDMISSING,
    });
  }

  userServices.updateUserAvatar(userEnteredDetails, (documentID, errMsg) => {
    //If an error occured during the update
    if (errMsg) {
      console.error(errorMessages.ERROR_UPDATING_AVATAR, errMsg);
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errMsg,
      });
      //if avatar updated
    } else {
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
})}).catch(err => {
return response.status(500).json({
  success: false,
  data: null,
  errMsg: errorMessages.ERROR_FAILED_CONFIGURE_CLOUDINARY+ `, ${err.message}`,
});
  });
});







module.exports = router;
