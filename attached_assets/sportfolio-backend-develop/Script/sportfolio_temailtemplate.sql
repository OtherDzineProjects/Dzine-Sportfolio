-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: sportfolio
-- ------------------------------------------------------
-- Server version	5.7.34-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `temailtemplate`
--

DROP TABLE IF EXISTS `temailtemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `temailtemplate` (
  `EmailTemplateID` int(11) NOT NULL AUTO_INCREMENT,
  `TemplateName` varchar(255) NOT NULL,
  `Subject` varchar(500) DEFAULT NULL,
  `Body` longtext,
  `PlaceHolder` varchar(255) DEFAULT NULL,
  `FromAddress` varchar(500) DEFAULT NULL,
  `AliasName` varchar(255) DEFAULT NULL,
  `IsHtml` varchar(10) DEFAULT NULL,
  `CreatedBy` varchar(255) NOT NULL,
  `CreatedDate` date NOT NULL,
  `UpdatedBy` varchar(255) DEFAULT NULL,
  `UpdatedDate` date DEFAULT NULL,
  PRIMARY KEY (`EmailTemplateID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temailtemplate`
--

LOCK TABLES `temailtemplate` WRITE;
/*!40000 ALTER TABLE `temailtemplate` DISABLE KEYS */;
INSERT INTO `temailtemplate` VALUES (1,'Forgot Password','Forgot Credentials','<!DOCTYPE html>\n <html>\n <head>\n     <meta charset=\"UTF-8\">\n     <title>OTP Email</title>\n     <style>\n         body {\n             font-family: Arial, sans-serif;\n             line-height: 1.6;\n             margin: 0;\n             padding: 0;\n             background-color: #f4f4f9;\n             color: #333;\n         }\n         .email-container {\n             max-width: 600px;\n             margin: 20px auto;\n             background: #fff;\n             padding: 20px;\n             border: 1px solid #ddd;\n             border-radius: 8px;\n             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n         }\n         .header {\n             background-color: #4CAF50;\n             color: #fff;\n             padding: 10px 15px;\n             border-radius: 8px 8px 0 0;\n             text-align: center;\n         }\n         .content {\n             padding: 20px;\n         }\n         .content p {\n             margin: 10px 0;\n         }\n         .footer {\n             font-size: 0.9em;\n             color: #888;\n             text-align: center;\n             margin-top: 20px;\n         }\n     </style>\n </head>\n <body>\n     <div class=\"email-container\">\n         <div class=\"header\">\n             <h2>Sportfolio- Password Reset</h2>\n         </div>\n         <div class=\"content\">\n             <p>Dear User,</p>\n             <p>Your One-Time Password (OTP) is:</p>\n             <h1 style=\"text-align: center; color: #4CAF50;\">{{OTP}}</h1>\n             <p>Please use this OTP Within 10 minutes <strong>{{Date}}</strong> to complete your password reset process.</p>\n             <p>If you did not request this, please ignore this email or contact support if you have any concerns.</p>\n         </div>\n         <div class=\"footer\">\n             <p>Thank you for using our service!</p>\n         </div>\n     </div>\n </body>\n </html>','OTP,Date','sportfoliotest123@gmail.com','Stackon Technologies','1','1','2024-12-17',NULL,NULL);
/*!40000 ALTER TABLE `temailtemplate` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-31 15:42:00
