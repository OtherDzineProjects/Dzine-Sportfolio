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
-- Table structure for table `tlookupdetail`
--

DROP TABLE IF EXISTS `tlookupdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tlookupdetail` (
  `LookupDetailID` int(11) NOT NULL AUTO_INCREMENT,
  `LookupDetailName` varchar(100) DEFAULT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `LookupDetailCode` varchar(100) DEFAULT NULL,
  `LookupHeaderID` int(11) NOT NULL,
  `RoleID` varchar(255) DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `CreatedDate` date DEFAULT NULL,
  `UpdatedBy` varchar(255) DEFAULT NULL,
  `UpdatedDate` date DEFAULT NULL,
  PRIMARY KEY (`LookupDetailID`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tlookupdetail`
--

LOCK TABLES `tlookupdetail` WRITE;
/*!40000 ALTER TABLE `tlookupdetail` DISABLE KEYS */;
INSERT INTO `tlookupdetail` VALUES (1,'Male','Male','M',1,NULL,'1','2024-07-05',NULL,NULL),(2,'Female','Female','F',1,NULL,'1','2024-07-05',NULL,NULL),(3,'O+','O positive','O+',2,NULL,'1','2024-07-05',NULL,NULL),(4,'O-','O negative','O-',2,NULL,'1','2024-07-05',NULL,NULL),(5,'A+','A positive','A+',2,NULL,'1','2024-07-05',NULL,NULL),(6,'A-','A negative','A-',2,NULL,'1','2024-07-05',NULL,NULL),(7,'B+','B positive','B+',2,NULL,'1','2024-07-05',NULL,NULL),(8,'B-','B negative','B-',2,NULL,'1','2024-07-05',NULL,NULL),(9,'AB+','AB positive','AB+',2,NULL,'1','2024-07-05',NULL,NULL),(10,'AB-','AB negative','AB-',2,NULL,'1','2024-07-05',NULL,NULL),(11,'School','School','M',3,NULL,'1','2024-08-09',NULL,NULL),(12,'College','College','F',3,NULL,'1','2024-08-09',NULL,NULL),(13,'Temporary','Temporary','Temporary',4,NULL,'1','2024-08-22',NULL,NULL),(14,'Permanent','Permanent','Permanent',4,NULL,'1','2024-08-22',NULL,NULL),(15,'EmailID','EmailID','EmailID',5,NULL,'1','2024-08-22',NULL,NULL),(16,'HomePhone','HomePhone','HomePhone',5,NULL,'1','2024-08-22',NULL,NULL),(17,'WorkPhone','WorkPhone','WorkPhone',5,NULL,'1','2024-08-22',NULL,NULL),(18,'Active','Active','Active',6,NULL,'1','2024-08-28',NULL,NULL),(19,'Inactive','Inactive','Inactive',6,NULL,'1','2024-08-28',NULL,NULL),(20,'Hold','Hold','Hold',6,NULL,'1','2024-08-28',NULL,NULL),(21,'Suspended','Suspended','Suspended',6,NULL,'1','2024-08-28',NULL,NULL),(22,'Pending','Pending','Pending',6,NULL,'1','2024-08-28',NULL,NULL),(23,'Grade 1','Grade 1','Grade 1',7,NULL,'1','2024-09-03',NULL,NULL),(24,'Grade 2','Grade 2','Grade 2',7,NULL,'1','2024-09-03',NULL,NULL),(25,'Grade 3','Grade 3','Grade 3',7,NULL,'1','2024-09-03',NULL,NULL),(26,'Grade 4','Grade 4','Grade 4',7,NULL,'1','2024-09-03',NULL,NULL),(27,'Grade 5','Grade 5','Grade 5',7,NULL,'1','2024-09-03',NULL,NULL),(28,'User','User','User',8,NULL,'1','2024-09-12',NULL,NULL),(29,'Organization','Organization','Organization',8,NULL,'1','2024-09-12',NULL,NULL),(30,'Pending','Pending','Pending',9,NULL,'1','2024-09-12',NULL,NULL),(31,'Verified','Verified','Verified',9,NULL,'1','2024-09-12',NULL,NULL),(32,'Declined','Declined','Declined',9,NULL,'1','2024-09-12',NULL,NULL),(33,'Deleted','Deleted','Deleted',9,NULL,'1','2024-09-12',NULL,NULL),(34,'PendingApproval','PendingApproval','PendingApproval',10,NULL,'1','2024-09-12',NULL,NULL),(35,'Approved','Approved','Approved',10,NULL,'1','2024-09-12',NULL,NULL),(36,'OnHold','OnHold','OnHold',10,NULL,'1','2024-09-12',NULL,NULL),(37,'Deleted','Deleted','Deleted',10,NULL,'1','2024-09-12',NULL,NULL),(38,'UserQualification','UserQualification','UserQualification',8,NULL,'1','2024-09-18',NULL,NULL),(39,'Deleted','Deleted','Deleted',6,NULL,'1','2024-10-11',NULL,NULL),(40,'Active','Active','Active',11,NULL,'1','2024-10-11',NULL,NULL),(41,'Inactive','Inactive','Inactive',11,NULL,'1','2024-10-11',NULL,NULL),(42,'Hold','Hold','Hold',11,NULL,'1','2024-10-11',NULL,NULL),(43,'Suspended','Suspended','Suspended',11,NULL,'1','2024-10-11',NULL,NULL),(44,'Deleted','Deleted','Deleted',11,NULL,'1','2024-10-11',NULL,NULL),(45,'Pending','Pending','P',11,NULL,'1','2024-11-06',NULL,NULL),(46,'Rejected','Rejected','R',11,NULL,'1','2024-11-06',NULL,NULL),(47,'Under16','Under16','U16',12,NULL,'1','2024-11-05',NULL,NULL),(48,'Under17','Under17','U17',12,NULL,'1','2024-11-05',NULL,NULL),(49,'Under18','Under18','U18',12,NULL,'1','2024-11-05',NULL,NULL),(50,'Open','Open','Open',13,NULL,'1','2024-11-14',NULL,NULL),(51,'Closed','Closed','Closed',13,NULL,'1','2024-11-14',NULL,NULL),(52,'Temporarily Closed','Temporarily Closed','Temporarily Closed',13,NULL,'1','2024-11-14',NULL,NULL),(53,'Cancel','Cancel','Cancel',11,NULL,'1','2024-11-15',NULL,NULL),(54,'Active','Active notification','A',14,NULL,'1','2024-11-28',NULL,NULL),(55,'Closed','Closed notification','C',14,NULL,'1','2024-11-28',NULL,NULL),(56,'Rejected','Rejected notification','R',14,NULL,'1','2024-11-28',NULL,NULL),(57,'OnHold','Onhold notification','O',14,NULL,'1','2024-11-28',NULL,NULL),(58,'Anouncement','Anouncement','Anouncement',15,NULL,'1','2024-11-28',NULL,NULL),(59,'Advertisement','Advertisement','Advertisement',15,NULL,'1','2024-11-28',NULL,NULL),(60,'Notification','Notification','Notification',8,NULL,'1','2024-12-03',NULL,NULL),(61,'Deleted','Deleted','Deleted',14,NULL,'1','2024-12-05',NULL,NULL),(62,'Password','Password','Password',16,NULL,'1','2024-12-23',NULL,NULL),(63,'Cancel','Cancel','Cancel',10,NULL,'1','2024-12-31',NULL,NULL),(64,'Accounts','Accounts Department','ACCD',17,NULL,'1','2024-12-31',NULL,NULL),(65,'HR','Human Resource Department','HRD',17,NULL,'1','2024-12-31',NULL,NULL);
/*!40000 ALTER TABLE `tlookupdetail` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-31 15:40:24
