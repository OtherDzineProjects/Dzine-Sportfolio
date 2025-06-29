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
-- Table structure for table `tuserbasicdetail`
--

DROP TABLE IF EXISTS `tuserbasicdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tuserbasicdetail` (
  `UserBasicDetailID` int(11) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(100) DEFAULT NULL,
  `MiddleName` varchar(255) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `NickName` varchar(255) DEFAULT NULL,
  `EmailID` varchar(100) DEFAULT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `AlternativePhoneNumber` varchar(20) DEFAULT NULL,
  `Gender` varchar(20) DEFAULT NULL,
  `BloodGroup` int(11) DEFAULT NULL,
  `UserID` int(11) NOT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Bio` text,
  `CountryID` varchar(255) DEFAULT NULL,
  `StateID` int(11) DEFAULT NULL,
  `DistrictID` int(11) DEFAULT NULL,
  `City` varchar(255) DEFAULT NULL,
  `RegionTypeID` int(11) DEFAULT NULL,
  `PermanantLocationID` int(11) DEFAULT NULL,
  `WardID` int(11) DEFAULT NULL,
  `PostOffice` varchar(200) DEFAULT NULL,
  `RepresentingDistrictID` varchar(500) DEFAULT NULL,
  `HouseName` varchar(200) DEFAULT NULL,
  `StreetName` varchar(200) DEFAULT NULL,
  `Place` varchar(200) DEFAULT NULL,
  `LocalBodyType` varchar(255) DEFAULT NULL,
  `LocalBodyName` varchar(255) DEFAULT NULL,
  `Pincode` varchar(20) DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `CreatedDate` date DEFAULT NULL,
  `UpdatedBy` varchar(255) DEFAULT NULL,
  `UpdatedDate` date DEFAULT NULL,
  PRIMARY KEY (`UserBasicDetailID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tuserbasicdetail`
--

LOCK TABLES `tuserbasicdetail` WRITE;
/*!40000 ALTER TABLE `tuserbasicdetail` DISABLE KEYS */;
INSERT INTO `tuserbasicdetail` VALUES (1,'Sportfolio  ',NULL,'Admin',NULL,'deeprajd@gmail.com','9447891683',NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,'1','2024-12-24',NULL,NULL),(2,'Reeba',NULL,'Alexander',NULL,'reeba.a@stackontech.com','9544963170',NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,'2','2024-12-24',NULL,NULL),(3,'Saranya','A','S','Saru','saranya@gmail.com','9826725772','9788455483','2',3,3,'2024-11-20',NULL,'1',2,13,'Vazhuthakkadu ',NULL,NULL,93,'95','[\"Thiruvananthapuram\"]','Gshh','Csgg','Gahhs','4','15','836276',3,'3','2024-12-24','3','2024-12-31'),(4,'Ram','F','A','Fdx','ram@gmail.com','8367352766','8855578947','2',5,4,'2024-11-11',NULL,'1',2,13,NULL,NULL,NULL,93,'95','[\"Thiruvananthapuram\"]',NULL,NULL,NULL,'4','15','646367',3,'4','2024-12-24','4','2024-12-24'),(5,'Reeba','Elias','Nisin','Eden','reeba.a1@stackontech.com','9544963107','9544963107','2',3,5,'2024-12-30',NULL,'1',2,13,'kollam',NULL,NULL,93,'95','[\"Thiruvananthapuram\"]','kollam','kollam','kollam','4','14','689052',3,'5','2024-12-24','5','2024-12-30'),(6,'Arjun',NULL,'PJ',NULL,'arjun.p@stackontech.com','9446975529',NULL,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,'6','2024-12-24',NULL,NULL),(7,'Ethan','Harris','Hunt','Jonas','alan.a@stackontech.com','9775674422','2368096558','2',5,7,'2010-12-20',NULL,'1',2,13,'Pathanamthitta ',NULL,NULL,93,'95','[\"Thiruvananthapuram\"]','House no 466','House Street 57','Kochi ','7','17','567899',3,'7','2024-12-24','7','2024-12-30'),(8,'Anjali',NULL,'V',NULL,'anjaliv@gmail.com','9496335514',NULL,NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,'8','2024-12-26',NULL,NULL),(9,'anandhu',NULL,'s',NULL,'anandhus@gmail.com','9496335513',NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,'9','2024-12-27',NULL,NULL),(10,'Varun',NULL,'H M',NULL,'varunhm@gmail.com','8674536274',NULL,NULL,NULL,10,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,'10','2024-12-27',NULL,NULL),(11,'Ahammed ',NULL,'Sukarno B',NULL,'ahammedsukarnob@gmail.com','9895972363',NULL,NULL,NULL,11,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,'11','2024-12-31',NULL,NULL),(12,'Arjun',NULL,'PJ',NULL,'arjun.pj@stackontech.com','9446975529',NULL,NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,'12','2024-12-31',NULL,NULL),(13,'Stephen',NULL,'Jermey',NULL,'alanabraham5671@gmail.com','9766746678',NULL,NULL,NULL,13,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,'13','2024-12-31',NULL,NULL);
/*!40000 ALTER TABLE `tuserbasicdetail` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-31 15:39:47
