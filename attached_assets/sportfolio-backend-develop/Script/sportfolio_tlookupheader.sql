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
-- Table structure for table `tlookupheader`
--

DROP TABLE IF EXISTS `tlookupheader`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tlookupheader` (
  `LookupHeaderID` int(11) NOT NULL AUTO_INCREMENT,
  `LookupTypeName` varchar(100) DEFAULT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `CreatedDate` date DEFAULT NULL,
  `UpdatedBy` varchar(255) DEFAULT NULL,
  `UpdatedDate` date DEFAULT NULL,
  PRIMARY KEY (`LookupHeaderID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tlookupheader`
--

LOCK TABLES `tlookupheader` WRITE;
/*!40000 ALTER TABLE `tlookupheader` DISABLE KEYS */;
INSERT INTO `tlookupheader` VALUES (1,'Gender','Gender of user','1','2024-07-05',NULL,NULL),(2,'BloodGroup','Blood group of user','1','2024-07-05',NULL,NULL),(3,'InstitutionType','Type of Institution','1','2024-08-22',NULL,NULL),(4,'AddressType','Type of address','1','2024-08-22',NULL,NULL),(5,'CommunicationType','Type of communication data','1','2024-08-22',NULL,NULL),(6,'OrganizationStatus','Status of the organization','1','2024-08-28',NULL,NULL),(7,'QualificationType','Type of qualification','1','2024-09-03',NULL,NULL),(8,'OwnerType','Type of document owner','1','2024-09-12',NULL,NULL),(9,'DocumentStatus','Status of document','1','2024-09-12',NULL,NULL),(10,'UserStatus','Status of the user','1','2024-09-12',NULL,NULL),(11,'OrganizationMemberStatus','Status of organization member','1','2024-10-11',NULL,NULL),(12,'TeamCategory','Category of Team','1','2024-11-05',NULL,NULL),(13,'FacilityStatus','Status of facility','1','2024-11-14',NULL,NULL),(14,'NotificationStatus','Status of notification','1','2024-11-28',NULL,NULL),(15,'NotificationType','Type of notification','1','2024-11-28',NULL,NULL),(16,'UserSettingsType','User setting type','1','2024-12-23',NULL,NULL),(17,'DepartmentType','Type or Work of that department','1','2024-12-23',NULL,NULL);
/*!40000 ALTER TABLE `tlookupheader` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-31 15:41:16
