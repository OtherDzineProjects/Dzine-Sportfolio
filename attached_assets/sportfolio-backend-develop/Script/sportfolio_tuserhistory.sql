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
-- Table structure for table `tuserhistory`
--

DROP TABLE IF EXISTS `tuserhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tuserhistory` (
  `UserHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `ActionCodeID` int(11) DEFAULT NULL,
  `ActionNote` varchar(3000) DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `CreatedDate` date DEFAULT NULL,
  `UpdatedBy` varchar(255) DEFAULT NULL,
  `UpdatedDate` date DEFAULT NULL,
  PRIMARY KEY (`UserHistoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tuserhistory`
--

LOCK TABLES `tuserhistory` WRITE;
/*!40000 ALTER TABLE `tuserhistory` DISABLE KEYS */;
INSERT INTO `tuserhistory` VALUES (1,1,1,'User created.','1','2024-12-24',NULL,NULL),(2,2,1,'User created.','2','2024-12-24',NULL,NULL),(3,3,1,'User created.','3','2024-12-24',NULL,NULL),(4,4,1,'User created.','4','2024-12-24',NULL,NULL),(5,5,1,'User created.','5','2024-12-24',NULL,NULL),(6,6,1,'User created.','6','2024-12-24',NULL,NULL),(7,7,1,'User created.','7','2024-12-24',NULL,NULL),(8,8,1,'User created.','8','2024-12-26',NULL,NULL),(9,9,1,'User created.','9','2024-12-27',NULL,NULL),(10,10,1,'User created.','10','2024-12-27',NULL,NULL),(11,6,5,NULL,NULL,'2024-12-30',NULL,NULL),(12,11,1,'User created.','11','2024-12-31',NULL,NULL),(13,12,1,'User created.','12','2024-12-31',NULL,NULL),(14,13,1,'User created.','13','2024-12-31',NULL,NULL);
/*!40000 ALTER TABLE `tuserhistory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-31 15:42:44
