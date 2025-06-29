const express = require("express");
const router = express.Router();
const notificationServices = require("../services/notification");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const { getUploadMiddleware, deleteMultipleImages  } = require("../common/commonFunctions");





/*
Author     : Abhijith JS
Date       : 28 November 2024
Purpose    : route for saving Notification details
parameter  : notificationDetails
return type: notificationID int
*/
/**
 * @swagger
 * /api/user/notification:
 *   post:
 *     tags:
 *       - : "Notification"
 *     summary: "Adding user notification details"
 *     description: |
 *       Adding user notification details.
 *       | In       | Name                 | Type   | Description                                      | Required |
 *       |----------|----------------------|--------|--------------------------------------------------|----------|
 *       | header   | Authorization        | string | Authorization token                              | true     |
 *       | formData | notificationType     | string | Type of the notification                         | true     |
 *       | formData | subject              | string | Subject of the notification                      | true     |
 *       | formData | body                 | string | Body of the notification                         | true     |
 *       | formData | date                 | string | Date of the notification                         | true     |
 *       | formData | country              | string | Country where notification is relevant           | true     |
 *       | formData | state                | string | State where notification is relevant             | true     |
 *       | formData | district             | string | District where notification is relevant          | true     |
 *       | formData | uploads              | file   | Optional image for the notification              | false    |
 *       | formData | address              | string | Address for the notification                     | false    |
 *       | formData | organizationID       | string | Organization ID associated with the notification | true     |
 *       | formData | notificationCreated  | string | ID of user by whom notification was created      | true     |
 *       | formData | notifyAll            | string | Date and time when the notification was created  | true     |
 *       | formData | notifyOrganizationIDs| string | Date and time when the notification was created  | true     |
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *            type: string
 *         required: true
 *       - in: formData
 *         name: notificationType
 *         type: string
 *         description: The type of the notification
 *         required: true
 *       - in: formData
 *         name: subject
 *         type: string
 *         description: The subject of the notification
 *         required: true
 *       - in: formData
 *         name: body
 *         type: string
 *         description: The body of the notification
 *         required: true
 *       - in: formData
 *         name: date
 *         type: string
 *         description: The date of the notification
 *         required: true
 *       - in: formData
 *         name: country
 *         type: string
 *         description: The country for the notification
 *         required: false
 *       - in: formData
 *         name: state
 *         type: string
 *         description: The state for the notification
 *         required: true
 *       - in: formData
 *         name: district
 *         type: string
 *         description: The district for the notification
 *         required: true
 *       - in: formData
 *         name: uploads
 *         type: file
 *         description: Optional image for the notification
 *         required: false
 *       - in: formData
 *         name: address
 *         type: string
 *         description: Address related to the notification
 *         required: false
 *       - in: formData
 *         name: organizationID
 *         type: string
 *         description: The organization associated with the notification
 *         required: true
 *       - in: formData
 *         name: notificationCreated
 *         type: string
 *         description: The date and time when the notification was created
 *         required: true
 *       - in: formData
 *         name: notifyAll
 *         type: string
 *         description: to notify all
 *         required: true
 *       - in: formData
 *         name: notifyOrganizationIDs
 *         type: string
 *         description: organizationIDs to notify
 *         required: true
 *     responses:
 *       201:
 *         description: Successfully created notification
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
 *                   description: Notification response data
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
router.post("/api/user/notification", (request, response) => {
  getUploadMiddleware()
    .then((upload) => {
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
          uploadsInfo = request.files.map((upload) => ({
            path: upload.path,
            fileType: upload.mimetype,
            fileName: upload.originalname,
          }));

          // Assuming only one file is uploaded for `uploads`
          request.body.uploads = uploadsInfo.length > 0 ? uploadsInfo[0].path : null;
        }

        // Extracting notification details from request body
        const {
          notificationType,
          subject,
          body,
          date,
          country,
          state,
          district,
          uploads,
          address,
          organizationID,
          notificationCreated,
          notifyOrganizationIDs ,
          notifyAll,
        } = request.body;        

        const userID = request.headers.userID;

        if (validator.isNullOrEmpty(userID)) {
            return response.status(400).json({
              success: false,
              data: null,
              errMsg: errorMessages.ERROR_NOUSERID,
            });
        }
        // Validate required fields
        if (
          validator.isNullOrEmpty(notificationType) ||
          validator.isNullOrEmpty(subject) ||
          validator.isNullOrEmpty(body) ||
          validator.isNullOrEmpty(date) ||
          validator.isNullOrEmpty(country) ||
          validator.isNullOrEmpty(state) ||
          validator.isNullOrEmpty(district) ||
          validator.isNullOrEmpty(organizationID) ||
          validator.isNullOrEmpty(userID)
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
                });
              }
            });
          }
        } else {
          // Construct the notification details object
          const notificationDetails = {
            notificationType,
            subject,
            body,
            date,
            country,
            state,
            district,
            uploadsInfo, // This now holds the uploaded image path
            address,
            organizationID,
            notificationCreated,
            userID,
            notifyOrganizationIDs ,
            notifyAll,
          };

          // Save the notification details
          notificationServices.saveNotificationDetails(
            notificationDetails,
            (notificationID, errMsg) => {
              if (errMsg) {
                console.error(
                  errorMessages.ERROR_SAVING_NOTIFICATION,
                  errMsg
                );
                return response.status(400).json({
                  success: false,
                  data: null,
                  errMsg: errMsg,
                });
              } else {
                return response.status(201).json({
                  success: true,
                  data: notificationID,
                  errMsg: null,
                });
              }
            }
          );
        }
      });
    })
    .catch((err) => {
      return response.status(500).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_FAILED_CONFIGURE_CLOUDINARY + `, ${err.message}`,
      });
    });
});




/*
Author     : Abhijith JS
Date       : 28 November 2024
Purpose    : route for fetching Notification by notificationID
parameter  : getNotificationData
return type: notificationDetails object
*/
/**
 * @swagger
 * /api/get/notification/{id}:
 *   get:
 *     tags:
 *       - : "Notification"
 *     summary: "Fetch Notification Details"
 *     description: |
 *       Retrieve the details of a specific notification by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the notification.
 *         schema:
 *           type: integer
 *           example: 123
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <token>
 *     responses:
 *       200:
 *         description: Successfully retrieved the notification details.
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
 *                   description: Notification details.
 *                   properties:
 *                     notificationID:
 *                       type: integer
 *                       example: 123
 *                     notificationType:
 *                       type: string
 *                       example: "Alert"
 *                     subject:
 *                       type: string
 *                       example: "System Maintenance"
 *                     body:
 *                       type: string
 *                       example: "The system will undergo maintenance on Saturday."
 *                     status:
 *                       type: string
 *                       example: "Active"
 *                     startDate:
 *                       type: string
 *                       example: "2024-01-01"
 *                     endDate:
 *                       type: string
 *                       example: "2024-01-02"
 *                     createdDate:
 *                       type: string
 *                       example: "2023-12-25T10:30:00Z"
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Missing or invalid notification ID.
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
 *                   example: "ERROR_NOTIFICATION_ID_MISSING"
 *       404:
 *         description: Notification not found.
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
 *                   example: "ERROR_FETCHING_NOTIFICATION_DETAILS"
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
 *                   example: "ERROR_INTERNAL_SERVER_ERROR"
 */
router.get("/api/get/notification/:id", (request, response) => {
  const notificationID = request.params.id;

  if (validator.isNullOrEmpty(notificationID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOTIFICATION_ID_MISSING,
    });
  }
  const userID = request.headers.userID;

  // Validate userID
  if (validator.isNullOrEmpty(userID)) {
    return response.status(400).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOUSERID,
    });
  }

  const getNotificationData = { notificationID, userID}

  notificationServices.getNotificationByID(
    getNotificationData,
    (notification, errMsg) => {
      if (errMsg) {
        // If any error occurs while finding the notification
        console.error(errorMessages.ERROR_FETCHING_NOTIFICATION_DETAILS, errMsg);
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // If notification details fetched successfully
        return response.status(200).json({
          success: true,
          data: notification,
          errMsg: null,
        });
      }
    }
  );
});



/*
Author     : Abhijith JS
Date       : 29 November 2024
Purpose    : route for searching Notification by entered keyword
parameter  : keywordSearchText
return type: totaldata object
*/
/**
 * @swagger
 * /api/key/search/notification:
 *   post:
 *     tags:
 *       - : "Notification"
 *     summary: "Search Notification by entered keyword"
 *     description: |
 *       Searches for notifications based on the provided keyword and pagination parameters.
 *       Returns notification details along with pagination info.
 *       | In       | Name              | Type   | Description                           | Required |
 *       |----------|-------------------|--------|---------------------------------------|----------|
 *       | query    | page              | integer| Page number for pagination            | false    |
 *       | query    | pageSize          | integer| Number of notifications per page      | false    |
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
 *         description: User's authorization token
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
 *         description: Number of notifications per page
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
 *               example: "Reminder"
 *               description: The keyword to search for
 *             type:
 *               type: string
 *               enum: [I, S, A]
 *               example: "A"
 *               description: Type of notification search. 
 *     responses:
 *       200:
 *         description: Successfully retrieved notification search results
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
 *                     notificationDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           NotificationID:
 *                             type: integer
 *                             example: 1
 *                           NotificationTitle:
 *                             type: string
 *                             example: "Meeting Reminder"
 *                           NotificationDescription:
 *                             type: string
 *                             example: "Team meeting scheduled at 3 PM."
 *                           NotificationType:
 *                             type: string
 *                             example: "General"
 *                           CreatedDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-11-27T10:30:00Z"
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
router.post("/api/key/search/notification", (request, response) => {
  // Store data from request.body to the variables
  const { keywordSearchText } = request.body;
  const type = request.body.type;
  const userID = request.headers.userID;
  const { page, pageSize } = request.query;
  const fetchTypes = { userID, type };

  // Call the service function for searching notifications
  notificationServices.keySearchNotification(
    keywordSearchText,
    fetchTypes,
    page,
    pageSize,
    (notificationDetails, errMsg) => {
      // If an error occurred during the search
      if (errMsg) {
        console.error(errorMessages.ERROR_NO_NOTIFICATIONFOUND, errMsg);
        return response.status(500).json({
          success: false,
          data: [],
          errMsg: errMsg,
        });
      } else {
        // If notification details are found
        if (notificationDetails && notificationDetails.length > 0) {
          const totalCount = notificationDetails[0].total_count || 0;
          const count = notificationDetails.length;
          const totaldata = { notificationDetails, page, pageSize, totalCount, count };

          return response.status(200).json({
            success: true,
            data: totaldata,
            errMsg: null,
          });
        } else {
          // If no notification details were found
          return response.status(200).json({
            success: false,
            data: [],
            errMsg: errorMessages.ERROR_NOTIFICATION_NOTFOUND,
          });
        }
      }
    }
  );
});



/*
Author     : Abhijith JS
Date       : 29 November 2024
Purpose    : route for updating Notification by entered keyword
parameter  : notificationDetails
return type: notificationID int
*/
/**
 * @swagger
 * /api/update/notification:
 *   put:
 *     tags:
 *       - : "Notification"
 *     summary: "Update user notification details"
 *     description: |
 *       Update user notification details by providing the notification ID and updated data.
 *       | In       | Name                 | Type   | Description                                      | Required |
 *       |----------|----------------------|--------|--------------------------------------------------|----------|
 *       | header   | Authorization        | string | Authorization token                              | true     |
 *       | formData | notificationID       | string | ID of the notification to update                 | true     |
 *       | formData | notificationType     | string | Type of the notification                         | true     |
 *       | formData | subject              | string | Subject of the notification                      | true     |
 *       | formData | body                 | string | Body of the notification                         | true     |
 *       | formData | date                 | string | Date of the notification                         | true     |
 *       | formData | country              | string | Country where notification is relevant           | true     |
 *       | formData | state                | string | State where notification is relevant             | true     |
 *       | formData | district             | string | District where notification is relevant          | true     |
 *       | formData | uploads              | file   | Optional image for the notification              | false    |
 *       | formData | removedFiles         | string | [1,2], uploaded files to be removed/added        | false    |
 *       | formData | address              | string | Address for the notification                     | false    |
 *       | formData | organizationID       | string | Organization ID associated with the notification | true     |
 *       | formData | notificationCreated  | string | notification was created by                      | false    |
 *       | formData | notifyAll            | string | Flag to notify all                               | false    |
 *       | formData | notifyOrganizationIDs| string | Comma-separated organization IDs to notify       | false    |
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *            type: string
 *         required: true
 *       - in: formData
 *         name: notificationID
 *         type: string
 *         description: The ID of the notification to update
 *         required: true
 *       - in: formData
 *         name: notificationType
 *         type: string
 *         description: The type of the notification
 *         required: true
 *       - in: formData
 *         name: subject
 *         type: string
 *         description: The subject of the notification
 *         required: true
 *       - in: formData
 *         name: body
 *         type: string
 *         description: The body of the notification
 *         required: true
 *       - in: formData
 *         name: date
 *         type: string
 *         description: The date of the notification
 *         required: true
 *       - in: formData
 *         name: country
 *         type: string
 *         description: The country for the notification
 *         required: true
 *       - in: formData
 *         name: state
 *         type: string
 *         description: The state for the notification
 *         required: true
 *       - in: formData
 *         name: district
 *         type: string
 *         description: The district for the notification
 *         required: true
 *       - in: formData
 *         name: uploads
 *         type: file
 *         description: Optional image for the notification
 *         required: false
 *       - in: formData
 *         name: removedFiles
 *         type: string
 *         description: removedFiles
 *         required: false 
 *       - in: formData
 *         name: address
 *         type: string
 *         description: Address related to the notification
 *         required: false
 *       - in: formData
 *         name: organizationID
 *         type: string
 *         description: The organization associated with the notification
 *         required: true
 *       - in: formData
 *         name: notificationCreated
 *         type: string
 *         description: The date and time when the notification was created
 *         required: false
 *       - in: formData
 *         name: notifyAll
 *         type: string
 *         description: Flag to notify all
 *         required: false
 *       - in: formData
 *         name: notifyOrganizationIDs
 *         type: string
 *         description: Comma-separated organization IDs to notify
 *         required: false
 *     responses:
 *       200:
 *         description: Successfully updated notification
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
 *                   example: "123456"
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
router.put("/api/update/notification", (request, response) => {
  getUploadMiddleware()
    .then((upload) => {
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
          uploadsInfo = request.files.map((upload) => ({
            path: upload.path,
            fileType: upload.mimetype,
            fileName: upload.originalname,
          }));

          // Assuming only one file is uploaded for `uploads`
          request.body.uploads = uploadsInfo.length > 0 ? uploadsInfo[0].path : null;
        }

        // Extracting notification details from request body
        const {
          notificationID, // New field for identifying the notification to update
          notificationType,
          subject,
          body,
          date,
          country,
          state,
          district,
          uploads,
          removedFiles,
          address,
          organizationID,
          notificationCreated,
          notifyOrganizationIDs,
          notifyAll,
        } = request.body;        

        const userID = request.headers.userID;

        // Validate userID
        if (validator.isNullOrEmpty(userID)) {
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errorMessages.ERROR_NOUSERID,
          });
        }

        // Validate required fields
        if (
          validator.isNullOrEmpty(notificationID) || // Validation for notificationID
          validator.isNullOrEmpty(notificationType) ||
          validator.isNullOrEmpty(subject) ||
          validator.isNullOrEmpty(body) ||
          validator.isNullOrEmpty(date) ||
          validator.isNullOrEmpty(country) ||
          validator.isNullOrEmpty(state) ||
          validator.isNullOrEmpty(district) ||
          validator.isNullOrEmpty(organizationID) ||
          validator.isNullOrEmpty(userID)
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
                });
              }
            });
          }
        } else {
          // Construct the notification details object
          const notificationDetails = {
            notificationID, // Include notificationID for update
            notificationType,
            subject,
            body,
            date,
            country,
            state,
            district,
            uploadsInfo, // This now holds the uploaded image path
            removedFiles,
            address,
            organizationID,
            notificationCreated,
            userID,
            notifyOrganizationIDs,
            notifyAll,
          };

          // Update the notification details
          notificationServices.updateNotificationDetails(
            notificationDetails,
            (updatedNotificationID, errMsg) => {
              if (errMsg) {
                console.error(
                  errorMessages.ERROR_UPDATING_NOTIFICATION,
                  errMsg
                );
                return response.status(400).json({
                  success: false,
                  data: null,
                  errMsg: errMsg,
                });
              } else {
                return response.status(200).json({
                  success: true,
                  data: updatedNotificationID,
                  errMsg: null,
                });
              }
            }
          );
        }
      });
    })
    .catch((err) => {
      return response.status(500).json({
        success: false,
        data: null,
        errMsg: errorMessages.ERROR_FAILED_CONFIGURE_CLOUDINARY + `, ${err.message}`,
      });
    });
});



/*
Author     : Abhijith JS
Date       : 03 December 2024
Purpose    : Route for fetching Notification Status count
parameter  : NotificationID
return type: notificationStatusData array
*/
/**
 * @swagger
 * /api/get/notification/status/count:
 *   get:
 *     tags:
 *       - : "Notification"
 *     summary: "Get Notification Status counts by Notification ID"
 *     description: Retrieves the status counts of notifications based on the specified notification ID.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved notification status data.
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
 *                   description: The notification status counts.
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       404:
 *         description: Notification status data not found or an error occurred.
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
 *                   example: ERROR_FETCHING_NOTIFICATION_STATUS_DETAILS
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
 *                   example: ERROR_INTERNAL_SERVER_ERROR
 */
router.get("/api/get/notification/status/count", (request, response) => {
  const userID = request.headers.userID; // Extract userID from the request headers

  notificationServices.getNotificationStatusData(
    userID,
    (notificationStatusData, errMsg) => {

      if (errMsg) {
        // Log the error and send a response with the error message
        console.error("Error fetching notification status details:", errMsg);
        return response.status(404).json({
          success: false,
          data: null,
          errMsg: errMsg,
        });
      } else {
        // Send a response with the fetched notification status data
        return response.status(200).json({
          success: true,
          data: notificationStatusData,
          errMsg: null,
        });
      }
    }
  );
});



/*
Author     : Abhijith JS
Date       : 05 December 2024
Purpose    : Route for deleting Notification
parameter  : NotificationID
return type: Boolean
*/
/**
 * @swagger
 * /api/notification/{notificationID}:
 *   delete:
 *     tags:
 *       - : "Notification"
 *     summary: Delete Notification
 *     description: Deletes a specific notification based on the provided `notificationID`.
 *     parameters:
 *       - in: path
 *         name: notificationID
 *         schema:
 *           type: string
 *           example: "12345"
 *         required: true
 *         description: The unique ID of the notification to be deleted.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authorization.
 *     responses:
 *       200:
 *         description: Notification deletion status.
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
 *                   example: true
 *                 errMsg:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Error occurred while deleting the notification.
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
 *                   example: "ERROR_DELETING_NOTIFICATION"
 *       404:
 *         description: Missing or invalid notification ID.
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
 *                   example: "ERROR_NO_NOTIFICATION_ID"
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
router.delete("/api/notification/:notificationID", (request, response) => {
  const notificationID = request.params.notificationID;
  // Check if notificationID is missing
  if (validator.isNullOrEmpty(notificationID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOTIFICATION_ID_MISSING,
    });
  } else {
    notificationServices.deleteNotification(
      notificationID,
      (success, errMsg) => {
        if (errMsg) {
          // If any error occurs while deleting
          console.error(
            errorMessages.ERROR_DELETING_NOTIFICATION,
            errMsg
          );
          return response.status(400).json({
            success: false,
            data: null,
            errMsg: errMsg,
          });
        } else if (success) {
          // Notification deleted successfully
          return response.status(200).json({
            success: true,
            data: true,
            errMsg: null,
          });
        } else {
          // No notification found
          return response.status(200).json({
            success: false,
            data: false,
            errMsg: errorMessages.ERROR_FETCHING_NOTIFICATION_DETAILS,
          });
        }
      }
    );
  }
});





module.exports = router;  