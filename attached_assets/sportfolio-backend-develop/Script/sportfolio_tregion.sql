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
-- Table structure for table `tregion`
--

DROP TABLE IF EXISTS `tregion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tregion` (
  `RegionID` int(11) NOT NULL,
  `RegionName` varchar(255) NOT NULL,
  `Hierarchy` int(11) DEFAULT NULL,
  `RegionCode` varchar(200) DEFAULT NULL,
  `RegionTypeID` int(11) DEFAULT NULL,
  `ParentRegionID` int(11) DEFAULT NULL,
  `OrderIndex` int(11) DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `CreatedDate` date DEFAULT NULL,
  `UpdatedBy` varchar(255) DEFAULT NULL,
  `UpdatedDate` date DEFAULT NULL,
  PRIMARY KEY (`RegionID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tregion`
--

LOCK TABLES `tregion` WRITE;
/*!40000 ALTER TABLE `tregion` DISABLE KEYS */;
INSERT INTO `tregion` VALUES (1,'India',0,'IN',1,0,1,'1',NULL,NULL,NULL),(2,'Kerala',1,'KL',2,1,1,'1',NULL,NULL,NULL),(3,'Varkala',6,'',7,13,1,'1',NULL,NULL,NULL),(4,'Kilimanoor',6,'',7,13,2,'1',NULL,NULL,NULL),(5,'Chirayinkeezhu',6,'',7,13,3,'1',NULL,NULL,NULL),(6,'Vamanapuram',6,'',7,13,4,'1',NULL,NULL,NULL),(7,'Vellanad',6,'',7,13,5,'1',NULL,NULL,NULL),(8,'Nedumangad',6,'',7,13,6,'1',NULL,NULL,NULL),(9,'Nemom',6,'',7,13,7,'1',NULL,NULL,NULL),(10,'Perumkadavila',6,'',7,13,8,'1',NULL,NULL,NULL),(11,'Athiyannoor',6,'',7,13,9,'1',NULL,NULL,NULL),(12,'Parassala',6,'',7,13,10,'1',NULL,NULL,NULL),(13,'Thiruvananthapuram',2,'TVP',3,2,1,'1',NULL,NULL,NULL),(14,'Thiruvananthapuram',3,'',4,13,1,'1',NULL,NULL,NULL),(15,'Varkala',4,'',5,13,1,'1',NULL,NULL,NULL),(16,'Attingal',4,'',5,13,2,'1',NULL,NULL,NULL),(17,'Nedumangad',4,'',5,13,3,'1',NULL,NULL,NULL),(18,'Neyyattinkara',4,'',5,13,4,'1',NULL,NULL,NULL),(19,'Chemmaruthy',5,'',6,13,1,'1',NULL,NULL,NULL),(20,'Edava',5,'',6,13,2,'1',NULL,NULL,NULL),(21,'Elakamon',5,'',6,13,3,'1',NULL,NULL,NULL),(22,'Manamboor',5,'',6,13,4,'1',NULL,NULL,NULL),(23,'Ottoor',5,'',6,13,5,'1',NULL,NULL,NULL),(24,'Cherunniyoor',5,'',6,13,6,'1',NULL,NULL,NULL),(25,'Vettoor',5,'',6,13,7,'1',NULL,NULL,NULL),(26,'Kilimanoor',5,'',6,13,8,'1',NULL,NULL,NULL),(27,'Pazhayakunnummel',5,'',6,13,9,'1',NULL,NULL,NULL),(28,'Karavaram',5,'',6,13,10,'1',NULL,NULL,NULL),(29,'Madavoor',5,'',6,13,11,'1',NULL,NULL,NULL),(30,'Pallickal',5,'',6,13,12,'1',NULL,NULL,NULL),(31,'Nagaroor',5,'',6,13,13,'1',NULL,NULL,NULL),(32,'Navaikulam',5,'',6,13,14,'1',NULL,NULL,NULL),(33,'Pulimath',5,'',6,13,15,'1',NULL,NULL,NULL),(34,'Azhoor',5,'',6,13,16,'1',NULL,NULL,NULL),(35,'Anjuthengu',5,'',6,13,17,'1',NULL,NULL,NULL),(36,'Vakkom',5,'',6,13,18,'1',NULL,NULL,NULL),(37,'Chirayinkeezhu',5,'',6,13,19,'1',NULL,NULL,NULL),(38,'Kizhuvilam',5,'',6,13,20,'1',NULL,NULL,NULL),(39,'Mudakkal',5,'',6,13,21,'1',NULL,NULL,NULL),(40,'Kadakkavoor',5,'',6,13,22,'1',NULL,NULL,NULL),(41,'Kallara',5,'',6,13,23,'1',NULL,NULL,NULL),(42,'Nellanad',5,'',6,13,24,'1',NULL,NULL,NULL),(43,'Pullampara',5,'',6,13,25,'1',NULL,NULL,NULL),(44,'Vamanapuram',5,'',6,13,26,'1',NULL,NULL,NULL),(45,'Pangode',5,'',6,13,27,'1',NULL,NULL,NULL),(46,'Nanniyode',5,'',6,13,28,'1',NULL,NULL,NULL),(47,'Peringammala',5,'',6,13,29,'1',NULL,NULL,NULL),(48,'Manickal',5,'',6,13,30,'1',NULL,NULL,NULL),(49,'Aryanad',5,'',6,13,31,'1',NULL,NULL,NULL),(50,'Poovachal',5,'',6,13,32,'1',NULL,NULL,NULL),(51,'Vellanad',5,'',6,13,33,'1',NULL,NULL,NULL),(52,'Vithura',5,'',6,13,34,'1',NULL,NULL,NULL),(53,'Uzhamalakkal',5,'',6,13,35,'1',NULL,NULL,NULL),(54,'Kuttichal',5,'',6,13,36,'1',NULL,NULL,NULL),(55,'Tholicode',5,'',6,13,37,'1',NULL,NULL,NULL),(56,'Kattakkada',5,'',6,13,38,'1',NULL,NULL,NULL),(57,'Anad',5,'',6,13,39,'1',NULL,NULL,NULL),(58,'Aruvikkara',5,'',6,13,40,'1',NULL,NULL,NULL),(59,'Panavoor',5,'',6,13,41,'1',NULL,NULL,NULL),(60,'Karakulam',5,'',6,13,42,'1',NULL,NULL,NULL),(61,'Vembayam',5,'',6,13,43,'1',NULL,NULL,NULL),(62,'Andoorkonam',5,'',6,13,44,'1',NULL,NULL,NULL),(63,'Kadinamkulam',5,'',6,13,45,'1',NULL,NULL,NULL),(64,'Mangalapuram',5,'',6,13,46,'1',NULL,NULL,NULL),(65,'Pothencode',5,'',6,13,47,'1',NULL,NULL,NULL),(66,'Balaramapuram',5,'',6,13,48,'1',NULL,NULL,NULL),(67,'Pallichal',5,'',6,13,49,'1',NULL,NULL,NULL),(68,'Maranalloor',5,'',6,13,50,'1',NULL,NULL,NULL),(69,'Malayinkeezh',5,'',6,13,51,'1',NULL,NULL,NULL),(70,'Vilappil',5,'',6,13,52,'1',NULL,NULL,NULL),(71,'Vilavoorkkal',5,'',6,13,53,'1',NULL,NULL,NULL),(72,'Kalliyoor',5,'',6,13,54,'1',NULL,NULL,NULL),(73,'Perumkadavila',5,'',6,13,55,'1',NULL,NULL,NULL),(74,'Kollayil',5,'',6,13,56,'1',NULL,NULL,NULL),(75,'Ottasekharamangalam',5,'',6,13,57,'1',NULL,NULL,NULL),(76,'Aryancode',5,'',6,13,58,'1',NULL,NULL,NULL),(77,'Kallikkadu',5,'',6,13,59,'1',NULL,NULL,NULL),(78,'Kunnathukal',5,'',6,13,60,'1',NULL,NULL,NULL),(79,'Vellarada',5,'',6,13,61,'1',NULL,NULL,NULL),(80,'Amboori',5,'',6,13,62,'1',NULL,NULL,NULL),(81,'Athiyannoor',5,'',6,13,63,'1',NULL,NULL,NULL),(82,'Kanjiramkulam',5,'',6,13,64,'1',NULL,NULL,NULL),(83,'Karumkulam',5,'',6,13,65,'1',NULL,NULL,NULL),(84,'Kottukal',5,'',6,13,66,'1',NULL,NULL,NULL),(85,'Venganoor',5,'',6,13,67,'1',NULL,NULL,NULL),(86,'Chenkal',5,'',6,13,68,'1',NULL,NULL,NULL),(87,'Karode',5,'',6,13,69,'1',NULL,NULL,NULL),(88,'Kulathoor',5,'',6,13,70,'1',NULL,NULL,NULL),(89,'Parassala',5,'',6,13,71,'1',NULL,NULL,NULL),(90,'thirupuram',5,'',6,13,72,'1',NULL,NULL,NULL),(91,'Poovar',5,'',6,13,73,'1',NULL,NULL,NULL),(92,'Pothencode',6,'',7,13,11,'1',NULL,NULL,NULL),(93,'DummyWard1',7,'',8,13,1,'1','2024-08-27',NULL,NULL),(94,'DummyWard2',7,'',8,13,2,'1','2024-08-27',NULL,NULL),(95,'DummyPostoffice1',8,'',9,13,1,'1','2024-08-27',NULL,NULL),(96,'DummyPostoffice2',8,'',9,13,2,'1','2024-08-27',NULL,NULL);
/*!40000 ALTER TABLE `tregion` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-31 15:38:46
