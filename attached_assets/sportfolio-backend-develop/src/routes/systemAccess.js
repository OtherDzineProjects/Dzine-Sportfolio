const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const systemServices = require("../services/systemAccess");
const validator = require("../common/validation");
const { encryptPassword } = require("../common/commonFunctions");
const errorMessages = require('../common/errorMessages');

/*
Author     : Abhijith JS
Date       : 29 May 2024
Purpose    : Route for Login  
parameter  : loginCredentials and a callback
return type: response object containing json data   
*/
/**
     * @swagger
     * /api/user/login:
     *   post:
     *     tags:
     *       - : "System Access"
     *     summary: "Login"
     *     description: |
     *       User Login
     *       | Key            | Value                          | Description                          |
     *       |----------------|--------------------------------|--------------------------------------|
     *       | email          | eg.,"test123@gmail.com"(email) | EmailID to match and Login user      |
     *       | password       | eg.,"password"(password)       | password to match and Login user     |
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: body
     *         name: body
     *         description: Login object
     *         required: true
     *         schema:
     *            type: object
     *            properties:
     *               email:
     *                  type: string
     *               password:
     *                  type: string           
     *            example: # Sample object
     *               email: "test123@gmail.com"
     *               password: "password"
     *     responses:
     *       201:
     *         description: Successfully logged in
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
     *                   description: Login response data
     *                 errMsg:
     *                   type: string
     *                   example: null
     *       400:
     *         description: Invalid input or login failed
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
     *                   example: ERROR_INVALID_INPUT_OR_LOGIN_FAILED
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
    

router.post("/api/user/login", (request, response) => {
  //storing email and password from request body to variables
  const { email, password } = request.body;
  //validation to check if login credentials are missing
  if (validator.isNullOrEmpty(email) || validator.isNullOrEmpty(password)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_LOGINFIELDMISSING,
    });
  }
  //password is encrypted and stored with email into user's object
  const encryptedPassword = encryptPassword(password);
  const loginCredentials = { email, encryptedPassword };

  systemServices.loginUser(loginCredentials, (loginResponse, errMsg) => {
    //if any error occur during login
    if (errMsg) {
      console.error(errorMessages.ERROR_LOGINFAIL, errMsg);
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errMsg,
      });
      //if login is successfull
    } else {
      return response.status(201).json({
        success: true,
        data: loginResponse,
        errMsg: null,
      });
    }
  });
});

/*
Author     : Abhijith JS
Date       : 29 May 2024
Purpose    : Route for SignUp
parameter  : signUpData and a callback
return type: userID      
*/
/**
     * @swagger
     * /api/user/signup:
     *   post:
     *     tags:
     *       - : "System Access"
     *     summary: "signup"
     *     description: |
     *       User signupdata
     *       | Key         | Value                            | Description   |
     *       |-------------|----------------------------------|---------------|
     *       | firstName   | eg., "someone" (String)          | First name    |
     *       | lastName    | eg., "person" (String)           | Last name     |
     *       | phoneNumber | eg., "1234567890" (String)       | Phone number  |
     *       | email       | eg., "sample@gmail.com" (String) | Email         |
     *       | password    | eg., "password" (String)         | Password      |
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: body
     *         name: body
     *         description: signup object
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
     *               firstName: "someone"
     *               lastName: "person"
     *               phoneNumber: "1234567890"
     *               email: "sample@gmail.com"
     *               password: "password"
     *     responses:
     *       201:
     *         description: Successfully signed up
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
     *                   description: Signup response data
     *                 errMsg:
     *                   type: string
     *                   example: null
     *       400:
     *         description: Invalid input or signup failed
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
     *                   example: ERROR_MISSINGFIELDS or ERROR_SAVINGUSER
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
router.post("/api/user/signup", (request, response) => {
  //storing signup data from request body to variables
  const { firstName, lastName, phoneNumber, email, password } = request.body;

  //validation to check if signup credentials are missing
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
  //password is encrypted
  const encryptedPassword = encryptPassword(password);
  //unique password key created
  const passwordKey = uuidv4();
  //storing signup user's data into user's object
  const signUpData = {
    firstName,
    lastName,
    phoneNumber,
    email,
    encryptedPassword,
    passwordKey,
  };

  systemServices.signUpUser(signUpData, (userID, errMsg) => {
    //if any error occur during signing up user
    if (errMsg) {
      console.error(errorMessages.ERROR_SAVINGUSER, errMsg);
      return response.status(400).json({
        success: false,
        data: null,
        errMsg: errMsg,
      });
      //if signup is successfull
    } else {
      return response.status(201).json({
        success: true,
        data: userID,
        errMsg: null,
      });
    }
  });
});

module.exports = router;
