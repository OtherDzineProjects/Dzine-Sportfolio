const express = require("express");
const router = express.Router();
const validator = require("../common/validation");
const errorMessages = require("../common/errorMessages");
const regionMastersServices = require("../services/regionMasters");


/**
 * @swagger
 * /api/region/master/{ID}:
 *   get:
 *     tags:
 *       - Region
 *     summary: Get region master details
 *     description: |
 *       Retrieve region master details for a specific region ID
 *       | Key            | Value                          | Description                          |
 *       |----------------|--------------------------------|--------------------------------------|
 *       | id             | eg.,"2"(ID)                    | ID to match and fetch organization   |
 *     parameters:
 *       - in: path
 *         name: ID
 *         required: true
 *         description: Unique identifier of the region
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
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
 *                   description: Region master details
 *                 errMsg:
 *                   type: null
 *       404:
 *         description: Region not found or error occurred
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
 *                   description: Error message
 *                   example: "Region ID is required"
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
 *                   type: null
 *                 errMsg:
 *                   type: string
 *                   description: Error message
 *                   example: "Unauthorized access"
 */
/*
Author     : Abhijith JS
Date       : 6 August 2024
Purpose    : route for fetching region
parameter  : regionID 
return type: callback
*/
router.get("/api/region/master/:ID", (request, response) => {
  const regionID = request.params.ID;
  if (validator.isNullOrEmpty(regionID)) {
    return response.status(404).json({
      success: false,
      data: null,
      errMsg: errorMessages.ERROR_NOREGIONID,
    });
  }

  regionMastersServices.getRegionMasters(regionID, (regionData, errMsg) => {
    if (errMsg) {
      // If any error occurs while finding region
      console.error(errorMessages.ERROR_FETCHING_REGIONDETAILS, errMsg);
      return response.status(404).json({
        success: false,
        data: null,
        errMsg: errMsg,
      });
    } else {
      // If region details fetched successfully
      return response.status(200).json({
        success: true,
        data: regionData,
        errMsg: null,
      });
    }
  });
});

module.exports = router;
