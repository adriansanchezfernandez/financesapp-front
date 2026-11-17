-- MySQL dump 10.13  Distrib 26.10.0, for Linux (x86_64)
--
-- Host: localhost    Database: financesapp
-- ------------------------------------------------------
-- Server version	26.10.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `movements`
--

DROP TABLE IF EXISTS `movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movements` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cantidad` decimal(12,2) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `fecha` date NOT NULL,
  `tipo` enum('gasto','ingreso') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movements`
--

LOCK TABLES `movements` WRITE;
/*!40000 ALTER TABLE `movements` DISABLE KEYS */;
INSERT INTO `movements` VALUES (1,2000.00,'Nomina','2026-10-23','ingreso'),(2,890.00,'Alquiler','2026-10-23','gasto'),(53,400.00,'sofa','2026-10-29','gasto'),(103,40.00,'Comida','2026-10-29','gasto'),(105,840.00,'Alquiler','2026-11-01','gasto'),(154,400.00,'Acciones dividendo','2026-11-05','ingreso'),(155,300.00,'Regalos reyes','2026-12-02','gasto'),(156,200.00,'Loterias','2026-12-01','gasto'),(205,80.00,'gta VI','2026-11-17','gasto');
/*!40000 ALTER TABLE `movements` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-17 12:11:17
