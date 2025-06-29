const express = require('express');
const router = express.Router();
const { getUploadMiddleware  } = require("../common/commonFunctions");
const { deleteCloudinaryImage } = require("../common/commonFunctions");
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const recordsupdateServices = require("../services/records");


/**
 * @swagger
 * /api/records/update:
 *   post:
 *     tags:
 *       - updateRecords
 *     summary: Update records and upload file
 *     description: Handles file uploads and updates records with provided details.
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         required: true
 *         description: The authorization token
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: The file to upload.
 *       - in: formData
 *         name: id
 *         type: string
 *         required: true
 *         description: Unique identifier for the record.
 *         example: "12345"
 *       - in: formData
 *         name: type
 *         type: string
 *         required: true
 *         description: Type of the record.
 *         example: "document"
 *       - in: formData
 *         name: transactiontype
 *         type: string
 *         required: true
 *         description: Type of transaction.
 *         example: "purchase"
 *       - in: formData
 *         name: recordtype
 *         type: string
 *         required: true
 *         description: Type of record.
 *         example: "invoice"
 *     responses:
 *       '200':
 *         description: Successful file upload
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'File uploaded successfully'
 *             file:
 *               type: object
 *               description: Uploaded file details.
 *               properties:
 *                 filename:
 *                   type: string
 *                   example: 'file.jpg'
 *                 mimetype:
 *                   type: string
 *                   example: 'image/jpeg'
 *                 size:
 *                   type: integer
 *                   example: 123456
 *       '400':
 *         description: Bad Request
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             data:
 *               type: null
 *             errMsg:
 *               type: string
 *               example: 'ERROR_ALLFIELDMISSING'
 *       '500':
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Failed to configure Cloudinary storage'
 *             error:
 *               type: string
 *               example: 'Error message'
 */

router.post("/api/records/update", (request, response) => {

  getUploadMiddleware()
  .then(upload => {
    upload(request, response, (err) => {
      if (err) {
        return response.status(500).json({ message: 'File upload failed', error: err.message });
      }

      const { id, type, transactiontype, recordtype } = request.body;
      if (validator.isNullOrEmpty(id) || validator.isNullOrEmpty(type) || validator.isNullOrEmpty(transactiontype) || validator.isNullOrEmpty(recordtype)) {
        // Delete the uploaded image
        if (request.files && request.files.filename) {
          deleteCloudinaryImage(request.files.filename)
          .then(()=>{
            return response.status(400).json({
              success: false,
              data: null,
              errMsg: errorMessages.ERROR_ALLFIELDMISSING,
            })
          })
          .catch(deleteErr => {
            return response.status(500).json({
              success: false,
              data: null,
              errMsg: `Failed to delete image: ${deleteErr.message}`,
            });
          });
      }else {
        return response.status(400).json({
          success: false,
          data: null,
          errMsg: errorMessages.ERROR_ALLFIELDMISSING,
        });
      }
    } else if (request.files) {
        response.json({
          message: 'File uploaded successfully',
          file: request.files,
        });
      } else {
        response.status(400).json({ message: 'No file uploaded' });
}  
});
  })
  .catch(err => {
    console.error("Failed to initialize upload middleware: ", err);
    response.status(500).json({ message: 'Failed to configure Cloudinary storage', error: err.message });
  });
});

 
  // const recordsData = { id, type,transactionType, recordType, data };
  // console.log("recordsData: ",recordsData);


  //   recordsupdateServices.recordsUpdate(recordsData, (fileData, errMsg) => {
  //     //If an error occured during the process
  //     if (errMsg) {
  //       console.error(errorMessages.ERROR_OCCURRED, errMsg);
  //       return response.status(400).json({
  //         success: false,
  //         data: null,
  //         errMsg: errMsg,
  //       });
  //       //if user updated
  //     } else {
  //       if (fileData) {
  //         return response.status(200).json({
  //           success: true,
  //           data: "File uploaded successfully",
  //           errMsg: null,
  //         });
  //       } else {
  //         // If user not updated
  //         return response.status(200).json({
  //           success: false,
  //           data: null,
  //           errMsg: errorMessages.ERROR_OCCURRED,
  //         });
  //       }
  //     }
  //   });
//   });
  
  module.exports = router;