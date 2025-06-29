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
-- Table structure for table `tactivity`
--

DROP TABLE IF EXISTS `tactivity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tactivity` (
  `ActivityID` int(11) NOT NULL AUTO_INCREMENT,
  `ActivityName` varchar(255) DEFAULT NULL,
  `ActivityDescription` varchar(255) DEFAULT NULL,
  `ParentID` int(11) DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `CreatedDate` date DEFAULT NULL,
  `UpdatedBy` varchar(255) DEFAULT NULL,
  `UpdatedDate` date DEFAULT NULL,
  PRIMARY KEY (`ActivityID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tactivity`
--

LOCK TABLES `tactivity` WRITE;
/*!40000 ALTER TABLE `tactivity` DISABLE KEYS */;
INSERT INTO `tactivity` VALUES (1,'Sports','Sports',NULL,'1','2024-10-24',NULL,NULL),(2,'Games','Games',NULL,'1','2024-10-24',NULL,NULL),(3,'Football','Football',1,'1','2024-10-24',NULL,NULL),(4,'Cricket','Cricket',1,'1','2024-10-24',NULL,NULL),(5,'Volley Ball','Volley Ball',1,'1','2024-10-24',NULL,NULL),(6,'Test cricket','Test cricket',4,'1','2024-10-24',NULL,NULL),(7,'One Day International (ODI)','One Day International (ODI)',4,'1','2024-10-24',NULL,NULL),(8,'Twenty20 (T20)','Twenty20 (T20)',4,'1','2024-10-24',NULL,NULL),(9,'IPL','IPL',4,'1','2024-10-24',NULL,NULL),(10,'Association football','Association football',3,'1','2024-10-24',NULL,NULL),(11,'Gaelic football','Gaelic football',3,'1','2024-10-24',NULL,NULL),(12,'Chess','Chess',2,'1','2024-10-24',NULL,NULL),(13,'Sudoku','Sudoku',2,'1','2024-10-24',NULL,NULL),(14,'CSK','CSK',9,'1','2024-10-24',NULL,NULL),(15,'caroms','caroms',2,'1','2024-10-29',NULL,NULL);
/*!40000 ALTER TABLE `tactivity` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-31 15:41:07
