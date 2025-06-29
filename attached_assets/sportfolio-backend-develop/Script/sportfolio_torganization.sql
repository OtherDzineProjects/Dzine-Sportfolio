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
-- Table structure for table `torganization`
--

DROP TABLE IF EXISTS `torganization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `torganization` (
  `OrganizationID` int(11) NOT NULL AUTO_INCREMENT,
  `OrganizationName` varchar(255) NOT NULL,
  `OrganizationEmail` varchar(100) NOT NULL,
  `OrganizationTypeID` int(11) DEFAULT NULL,
  `RegistrationNumber` varchar(255) DEFAULT NULL,
  `RegistrationValidFrom` date DEFAULT NULL,
  `RegistrationValidTo` date DEFAULT NULL,
  `InchargeName` varchar(255) DEFAULT NULL,
  `InchargePhone` varchar(20) DEFAULT NULL,
  `InchargeEmail` varchar(255) DEFAULT NULL,
  `PhoneNumber` varchar(20) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Website` varchar(500) DEFAULT NULL,
  `CountryID` int(11) DEFAULT NULL,
  `StateID` int(11) DEFAULT NULL,
  `DistrictID` int(11) DEFAULT NULL,
  `CityID` varchar(20) DEFAULT NULL,
  `LocalBodyType` int(11) DEFAULT NULL,
  `LocalBodyName` varchar(255) DEFAULT NULL,
  `WardName` int(11) DEFAULT NULL,
  `PostOffice` int(11) DEFAULT NULL,
  `Pincode` varchar(10) DEFAULT NULL,
  `ParentOrganizationID` int(11) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `About` longtext,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `CreatedDate` date DEFAULT NULL,
  `UpdatedBy` varchar(255) DEFAULT NULL,
  `UpdatedDate` date DEFAULT NULL,
  PRIMARY KEY (`OrganizationID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `torganization`
--

LOCK TABLES `torganization` WRITE;
/*!40000 ALTER TABLE `torganization` DISABLE KEYS */;
INSERT INTO `torganization` VALUES (1,'Org Arjun','arjun.p@stackontech.com',11,NULL,NULL,NULL,NULL,NULL,NULL,'9446975529',12,NULL,1,2,13,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'22',NULL,'12','2024-12-31',NULL,'2024-12-31'),(2,'Hockey & Cricket Ball Organizational Federation ','hockey1cricketfed@gmail.com',11,NULL,NULL,NULL,NULL,NULL,NULL,'8675435667',13,'https://www.hockey1cricketfedorg.com',1,2,13,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'22',NULL,'13','2024-12-31',NULL,'2024-12-31');
/*!40000 ALTER TABLE `torganization` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-31 15:42:53
