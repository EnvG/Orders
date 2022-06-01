-- MySQL dump 10.13  Distrib 8.0.29, for Linux (x86_64)
--
-- Host: localhost    Database: Orders
-- ------------------------------------------------------
-- Server version	8.0.29

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
-- Table structure for table `Client`
--

DROP TABLE IF EXISTS `Client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Client` (
  `ClientId` int NOT NULL AUTO_INCREMENT,
  `INN` varchar(12) NOT NULL,
  PRIMARY KEY (`ClientId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Client`
--

LOCK TABLES `Client` WRITE;
/*!40000 ALTER TABLE `Client` DISABLE KEYS */;
INSERT INTO `Client` VALUES (1,'1748295892'),(2,'174885938001'),(3,'103272138148'),(4,'324238423892'),(5,'3283298942');
/*!40000 ALTER TABLE `Client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `Clients`
--

DROP TABLE IF EXISTS `Clients`;
/*!50001 DROP VIEW IF EXISTS `Clients`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `Clients` AS SELECT 
 1 AS `ClientId`,
 1 AS `INN`,
 1 AS `Fullname`,
 1 AS `Name`,
 1 AS `KPP`,
 1 AS `OGRN`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `Contract`
--

DROP TABLE IF EXISTS `Contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Contract` (
  `ClientId` int NOT NULL,
  `ContractId` int NOT NULL,
  `UserId` int NOT NULL,
  `StatusId` int NOT NULL,
  `Number` varchar(50) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  PRIMARY KEY (`ClientId`,`ContractId`),
  KEY `FK_Contract_Client1_idx` (`ClientId`),
  KEY `FK_Contract_Status1_idx` (`StatusId`),
  KEY `FK_Contract_User1_idx` (`UserId`),
  CONSTRAINT `FK_Contract_Client1` FOREIGN KEY (`ClientId`) REFERENCES `Client` (`ClientId`),
  CONSTRAINT `FK_Contract_Status1` FOREIGN KEY (`StatusId`) REFERENCES `Status` (`StatusId`),
  CONSTRAINT `FK_Contract_User1` FOREIGN KEY (`UserId`) REFERENCES `User` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Contract`
--

LOCK TABLES `Contract` WRITE;
/*!40000 ALTER TABLE `Contract` DISABLE KEYS */;
INSERT INTO `Contract` VALUES (1,1,5,2,'RTP-1-001','2022-06-01','2022-12-01');
/*!40000 ALTER TABLE `Contract` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `Contract_BEFORE_INSERT` BEFORE INSERT ON `Contract` FOR EACH ROW BEGIN
	IF NEW.StartDate >= NEW.EndDate 
		THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Дата начала действия договора не может быть позже даты его окончания';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Temporary view structure for view `Contracts`
--

DROP TABLE IF EXISTS `Contracts`;
/*!50001 DROP VIEW IF EXISTS `Contracts`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `Contracts` AS SELECT 
 1 AS `ClientId`,
 1 AS `ContractId`,
 1 AS `StatusId`,
 1 AS `StatusName`,
 1 AS `Number`,
 1 AS `StartDate`,
 1 AS `EndDate`,
 1 AS `INN`,
 1 AS `Fullname`,
 1 AS `Name`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `JuridicalPerson`
--

DROP TABLE IF EXISTS `JuridicalPerson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `JuridicalPerson` (
  `ClientId` int NOT NULL,
  `Name` varchar(100) NOT NULL,
  `KPP` varchar(9) NOT NULL,
  `OGRN` varchar(13) NOT NULL,
  PRIMARY KEY (`ClientId`),
  UNIQUE KEY `Client_ClientId_UNIQUE` (`ClientId`),
  CONSTRAINT `FK_JuridicalPerson_Client1` FOREIGN KEY (`ClientId`) REFERENCES `Client` (`ClientId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `JuridicalPerson`
--

LOCK TABLES `JuridicalPerson` WRITE;
/*!40000 ALTER TABLE `JuridicalPerson` DISABLE KEYS */;
INSERT INTO `JuridicalPerson` VALUES (1,'ООО Вислин','184930992','3882047219043'),(5,'АО \'РУС-ТОРГ\'','238238982','4234892323928');
/*!40000 ALTER TABLE `JuridicalPerson` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `JuridicalPerson_BEFORE_INSERT` BEFORE INSERT ON `JuridicalPerson` FOR EACH ROW BEGIN 
IF EXISTS (
  SELECT 
    * 
  FROM 
    PhysicalPerson 
  WHERE 
    ClientId = NEW.ClientID
) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Клиент с данным ID уже добавлен как Физическое лицо';
END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Order`
--

DROP TABLE IF EXISTS `Order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Order` (
  `ClientId` int NOT NULL,
  `ContractId` int NOT NULL,
  `OrderId` int NOT NULL,
  `StatusId` int NOT NULL,
  `OrderDate` date NOT NULL,
  PRIMARY KEY (`ClientId`,`ContractId`,`OrderId`),
  KEY `FK_Order_Contract1_idx` (`ContractId`,`ClientId`),
  KEY `FK_Order_Status_idx` (`StatusId`),
  CONSTRAINT `FK_Order_Contract` FOREIGN KEY (`ClientId`, `ContractId`) REFERENCES `Contract` (`ClientId`, `ContractId`),
  CONSTRAINT `FK_Order_Status` FOREIGN KEY (`StatusId`) REFERENCES `Status` (`StatusId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Order`
--

LOCK TABLES `Order` WRITE;
/*!40000 ALTER TABLE `Order` DISABLE KEYS */;
INSERT INTO `Order` VALUES (1,1,1,2,'2022-06-01'),(1,1,2,2,'2022-06-01'),(1,1,3,2,'2022-06-01');
/*!40000 ALTER TABLE `Order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderComposition`
--

DROP TABLE IF EXISTS `OrderComposition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderComposition` (
  `ClientId` int NOT NULL,
  `ContractId` int NOT NULL,
  `OrderId` int NOT NULL,
  `OrdinalNumber` int NOT NULL,
  `ProductId` int DEFAULT NULL,
  `Amount` int NOT NULL,
  PRIMARY KEY (`ClientId`,`ContractId`,`OrderId`,`OrdinalNumber`),
  KEY `FK_OrderComposition_Order1_idx` (`OrderId`,`ContractId`,`ClientId`),
  KEY `FK_OrderComposition_Product_idx` (`ProductId`),
  CONSTRAINT `FK_OrderComposition_Order` FOREIGN KEY (`ClientId`, `ContractId`, `OrderId`) REFERENCES `Order` (`ClientId`, `ContractId`, `OrderId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_OrderComposition_Product` FOREIGN KEY (`ProductId`) REFERENCES `Product` (`ProductId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderComposition`
--

LOCK TABLES `OrderComposition` WRITE;
/*!40000 ALTER TABLE `OrderComposition` DISABLE KEYS */;
INSERT INTO `OrderComposition` VALUES (1,1,1,1,5,2),(1,1,1,2,3,2),(1,1,1,3,2,1),(1,1,1,4,1,1),(1,1,1,5,7,5),(1,1,1,6,9,10),(1,1,2,1,5,4),(1,1,2,2,3,28),(1,1,2,3,2,75),(1,1,2,4,1,12),(1,1,2,5,7,23),(1,1,2,6,9,12),(1,1,3,1,5,2),(1,1,3,2,3,5);
/*!40000 ALTER TABLE `OrderComposition` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `BFR_I_OrderComposition` BEFORE INSERT ON `OrderComposition` FOR EACH ROW BEGIN
	DECLARE _clientId, _contractId, _productId, _amount INT;
    
    -- Вставляемые ключи
    SET _clientId := NEW.ClientId;
    SET _contractId := NEW.ContractId;
    
    -- ID вставляемого изделия
    SET _productId := NEW.ProductId;
    
    -- Количество изделий
	SET _amount := NEW.Amount;

    -- Если количестве меньше или равно нулю,
    IF _amount <= 0 
		-- то выводим ошибку
		THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Количество должно быть больше нуля';
	END IF;
    
    
    
    IF NOT EXISTS (SELECT * FROM Specification WHERE 	ClientId = _clientId AND
														ContractId = _contractId AND
                                                        ProductId = _productId)
		THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Данное изделие не содержится в спецификации к договору';
	END IF;
    
    IF (SELECT SUM(Amount) + _amount FROM OrderComposition WHERE 	ClientId = _clientId AND
																	ContractId = _contractId AND
                                                                    ProductId = _productId) > (SELECT Amount FROM Specification WHERE 	ClientId = _clientId AND
																																		ContractId = _contractId AND
																																		ProductId = _productId)
		THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Превышено максимальное количество данного изделия';
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `PhysicalPerson`
--

DROP TABLE IF EXISTS `PhysicalPerson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PhysicalPerson` (
  `ClientId` int NOT NULL,
  `Fullname` varchar(100) NOT NULL,
  `Phone` varchar(20) NOT NULL,
  `Address` varchar(250) NOT NULL,
  PRIMARY KEY (`ClientId`),
  UNIQUE KEY `ClientId_UNIQUE` (`ClientId`),
  CONSTRAINT `FK_PhysicalPerson_Client1` FOREIGN KEY (`ClientId`) REFERENCES `Client` (`ClientId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PhysicalPerson`
--

LOCK TABLES `PhysicalPerson` WRITE;
/*!40000 ALTER TABLE `PhysicalPerson` DISABLE KEYS */;
INSERT INTO `PhysicalPerson` VALUES (2,'Даньшова Алина Вячеславовна','+7 (919) 417 38 40','+7 (919) 417-38-40'),(3,'Даньшова Алина Вячеславовна','+7 (919) 417 38 40','+7 (919) 417-38-40'),(4,'Ратин Дмитрий Алексеевич','+7 (923) 489 23 48','г. Москва, ул. Победы, д. 20б, кв. 7');
/*!40000 ALTER TABLE `PhysicalPerson` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `PhysicalPerson_BEFORE_INSERT` BEFORE INSERT ON `PhysicalPerson` FOR EACH ROW BEGIN
	IF EXISTS (SELECT * FROM JuridicalPerson WHERE ClientId = NEW.ClientID)
		THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Клиент с данным ID уже добавлен как Юридическое лицо';
        END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Post`
--

DROP TABLE IF EXISTS `Post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Post` (
  `PostId` int NOT NULL,
  `PostName` varchar(45) NOT NULL,
  PRIMARY KEY (`PostId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Post`
--

LOCK TABLES `Post` WRITE;
/*!40000 ALTER TABLE `Post` DISABLE KEYS */;
INSERT INTO `Post` VALUES (1,'ADMIN'),(2,'Менеджер'),(3,'Директор');
/*!40000 ALTER TABLE `Post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Price`
--

DROP TABLE IF EXISTS `Price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Price` (
  `ProductId` int NOT NULL,
  `OrdinalNumber` int NOT NULL,
  `PriceValue` decimal(12,2) NOT NULL,
  `ChangeDate` date NOT NULL,
  PRIMARY KEY (`ProductId`,`OrdinalNumber`),
  KEY `FK_Price_Product1_idx` (`ProductId`),
  CONSTRAINT `FK_Price_Product1` FOREIGN KEY (`ProductId`) REFERENCES `Product` (`ProductId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Price`
--

LOCK TABLES `Price` WRITE;
/*!40000 ALTER TABLE `Price` DISABLE KEYS */;
INSERT INTO `Price` VALUES (1,1,1299.99,'2022-05-10'),(2,1,1450.00,'2022-05-10'),(3,1,749.00,'2022-05-10'),(4,1,1425.90,'2022-05-10'),(5,1,750.00,'2022-05-10'),(6,1,1999.00,'2022-05-10'),(6,2,1970.00,'2022-05-14'),(6,3,1999.00,'2022-05-10'),(7,1,250.00,'2022-05-10'),(8,1,1350.99,'2022-05-10'),(9,1,120.00,'2022-05-10');
/*!40000 ALTER TABLE `Price` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `Price_BEFORE_INSERT` BEFORE INSERT ON `Price` FOR EACH ROW BEGIN
	IF NEW.PriceValue <= 0
		THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Цена должна быть больше нуля';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Temporary view structure for view `PriceList`
--

DROP TABLE IF EXISTS `PriceList`;
/*!50001 DROP VIEW IF EXISTS `PriceList`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `PriceList` AS SELECT 
 1 AS `ProductId`,
 1 AS `ProductName`,
 1 AS `PriceValue`,
 1 AS `ChangeDate`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `Product`
--

DROP TABLE IF EXISTS `Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Product` (
  `ProductId` int NOT NULL,
  `ProductName` varchar(100) NOT NULL,
  PRIMARY KEY (`ProductId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product`
--

LOCK TABLES `Product` WRITE;
/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
INSERT INTO `Product` VALUES (1,'Колодки тормозные передние'),(2,'Колодки тормозные задние'),(3,'Крыло заднее пластмассовое'),(4,'Крыло заднее аллюминевое'),(5,'Цепь на 114 звеньев'),(6,'Рама стальная'),(7,'Звонок велосипедный'),(8,'Амортизатор передний'),(9,'Светоотражатель задний');
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Specification`
--

DROP TABLE IF EXISTS `Specification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Specification` (
  `ClientId` int NOT NULL,
  `ContractId` int NOT NULL,
  `OrdinalNumber` int NOT NULL,
  `ProductId` int NOT NULL,
  `Amount` int NOT NULL,
  PRIMARY KEY (`ClientId`,`ContractId`,`OrdinalNumber`),
  KEY `FK_Specification_Contract1_idx` (`ContractId`,`ClientId`),
  KEY `FK_Specification_Product_idx` (`ProductId`),
  CONSTRAINT `FK_Specification_Contract` FOREIGN KEY (`ClientId`, `ContractId`) REFERENCES `Contract` (`ClientId`, `ContractId`),
  CONSTRAINT `FK_Specification_Product` FOREIGN KEY (`ProductId`) REFERENCES `Product` (`ProductId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Specification`
--

LOCK TABLES `Specification` WRITE;
/*!40000 ALTER TABLE `Specification` DISABLE KEYS */;
INSERT INTO `Specification` VALUES (1,1,1,5,10),(1,1,2,3,50),(1,1,3,2,100),(1,1,4,1,107),(1,1,5,7,50),(1,1,6,9,50);
/*!40000 ALTER TABLE `Specification` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `Specification_BEFORE_INSERT` BEFORE INSERT ON `Specification` FOR EACH ROW BEGIN
	IF NEW.Amount <= 0 
    		THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Количество должно быть больше нуля';
		END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Staff`
--

DROP TABLE IF EXISTS `Staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Staff` (
  `UserId` int NOT NULL,
  `PostId` int NOT NULL,
  `Fullname` varchar(100) NOT NULL,
  `Birthdate` date NOT NULL,
  `Phone` varchar(20) NOT NULL,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `UserId_UNIQUE` (`UserId`),
  KEY `FK_Staff_Post1_idx` (`PostId`),
  CONSTRAINT `FK_Staff_Post1` FOREIGN KEY (`PostId`) REFERENCES `Post` (`PostId`),
  CONSTRAINT `FK_Staff_User1` FOREIGN KEY (`UserId`) REFERENCES `User` (`UserId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Staff`
--

LOCK TABLES `Staff` WRITE;
/*!40000 ALTER TABLE `Staff` DISABLE KEYS */;
INSERT INTO `Staff` VALUES (1,2,'Бурцева Полина Евгеньевна','1986-08-10','+7 (982) 569 11 99'),(2,2,'Зеленин Данила Романович','1981-10-04','+7 (939) 136 20 98'),(3,2,'Минеева Евгения Максимовна','1985-12-04','+7 (987) 371 67 59'),(4,2,'Ермилова Арина Евгеньевна','1996-12-23','+7 (988) 527 85 55'),(5,2,'Набокин Артем Юрьевич','1983-09-24','+7 (989) 503 38 72'),(6,3,'Кандинская Валентина Юлиановна','1985-06-16','+7 (933) 430-69-31'),(7,3,'Воеводин Лев Прохорович','1967-01-05','+7 (974) 880-52-47'),(8,2,'Берёзкина Тамара Егоровна','1993-09-23','+7 (970) 110-67-67'),(9,2,'Караев Игнат Петрович','1982-05-21','+7 (906) 677-22-20'),(10,2,'Яламов Александр Антонович','1990-05-23','+7 (981) 126-33-43'),(11,2,'Скрябин Михаил Севастьянович','1978-08-07','+7 (973) 359-19-14'),(12,2,'Дубиновская Ева Денисовна','1986-07-08','+7 (939) 154-68-12'),(13,2,'Шурупов Петр Федорович','1980-01-02','+7 (988) 454-28-63'),(14,3,'Бухало Трофим Антонович','1981-03-28','+7 (920) 629-91-95'),(15,3,'Селезнёва Александра Павловна','1983-07-10','+7 (936) 739-29-15'),(16,2,'Яковлева Анжела Георгьевна','1960-11-24','+7 (924) 165-28-36'),(17,3,'Сиянковский Валерий Константинович','1980-02-25','+7 (935) 846-78-28'),(18,2,'Лихачев Марк Михаилович','1987-12-05','+7 (955) 255-96-81'),(19,3,'Горбачёва Юлия Степановна','1982-08-03','+7 (913) 832-42-82'),(20,2,'Зырянов Ефим Федорович','1972-07-22','+7 (994) 635-62-92'),(21,2,'Яшкин Виктор Яковлевич','1980-02-19','+7 (932) 441-29-22'),(22,3,'Нуряева Пелагея Ильиновна','1984-05-22','+7 (984) 938-96-50'),(23,2,'Усилова Юлиана Валерьевна','1968-01-28','+7 (990) 372-79-78'),(24,2,'Царицын Константин Феликсович','1974-05-28','+7 (928) 763-46-57'),(25,2,'Шаршин Макар Никандрович','1972-03-06','+7 (949) 701-69-92');
/*!40000 ALTER TABLE `Staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Status`
--

DROP TABLE IF EXISTS `Status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Status` (
  `StatusId` int NOT NULL AUTO_INCREMENT,
  `StatusName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`StatusId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Status`
--

LOCK TABLES `Status` WRITE;
/*!40000 ALTER TABLE `Status` DISABLE KEYS */;
INSERT INTO `Status` VALUES (1,'Обговаривается'),(2,'Формируется'),(3,'Готов к выдаче'),(4,'Выдан клиенту');
/*!40000 ALTER TABLE `Status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `UserId` int NOT NULL AUTO_INCREMENT,
  `UserLogin` varchar(64) NOT NULL,
  `UserPassword` varchar(64) NOT NULL,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `UserLogin` (`UserLogin`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'polina94','3bd272a1d'),(2,'danila1081','2d197a786'),(3,'evgeniya.mineeva','df41f942c'),(4,'arina.96','ec64b2895'),(5,'qwerty','qwertyui'),(6,'valentina25','26ce0e9e0'),(7,'lev05011967','90dbeecfc'),(8,'tamara1993','c9f9c2418'),(9,'ignat1982','73ef10cfe'),(10,'aleksandr.yalamov','c98048228'),(11,'mihail6168','4ec811699'),(12,'eva.dubinovskaya','04157dacd'),(13,'petr85','dd0a84c29'),(14,'trofim.buhalo','a819e6b4b'),(15,'aleksandra3298','5ec62988a'),(16,'anjela1960','cafab7a40'),(17,'valeriy5790','6cccb6b7e'),(18,'mark.lihachev','7e8e7b87f'),(19,'yuliya30','a9db3972d'),(20,'efim1972','d917221de'),(21,'viktor1980','490873f34'),(22,'pelageya.nuryaeva','2fd1657ad'),(23,'yuliana.usilova','942611308'),(24,'konstantin1974','048e6f2ce'),(25,'makar.arshin','d28f1cdc5');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `Clients`
--

/*!50001 DROP VIEW IF EXISTS `Clients`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `Clients` AS select `C`.`ClientId` AS `ClientId`,`C`.`INN` AS `INN`,(select `PhysicalPerson`.`Fullname` from `PhysicalPerson` where (`PhysicalPerson`.`ClientId` = `C`.`ClientId`)) AS `Fullname`,(select `JuridicalPerson`.`Name` from `JuridicalPerson` where (`JuridicalPerson`.`ClientId` = `C`.`ClientId`)) AS `Name`,(select `JuridicalPerson`.`KPP` from `JuridicalPerson` where (`JuridicalPerson`.`ClientId` = `C`.`ClientId`)) AS `KPP`,(select `JuridicalPerson`.`OGRN` from `JuridicalPerson` where (`JuridicalPerson`.`ClientId` = `C`.`ClientId`)) AS `OGRN` from `Client` `C` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `Contracts`
--

/*!50001 DROP VIEW IF EXISTS `Contracts`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `Contracts` AS select `C`.`ClientId` AS `ClientId`,`C`.`ContractId` AS `ContractId`,`S`.`StatusId` AS `StatusId`,`S`.`StatusName` AS `StatusName`,`C`.`Number` AS `Number`,`C`.`StartDate` AS `StartDate`,`C`.`EndDate` AS `EndDate`,`Cl`.`INN` AS `INN`,(select `PhysicalPerson`.`Fullname` from `PhysicalPerson` where (`PhysicalPerson`.`ClientId` = `Cl`.`ClientId`)) AS `Fullname`,(select `JuridicalPerson`.`Name` from `JuridicalPerson` where (`JuridicalPerson`.`ClientId` = `Cl`.`ClientId`)) AS `Name` from ((`Contract` `C` join `Client` `Cl` on((`C`.`ClientId` = `Cl`.`ClientId`))) join `Status` `S` on((`C`.`StatusId` = `S`.`StatusId`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `PriceList`
--

/*!50001 DROP VIEW IF EXISTS `PriceList`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `PriceList` AS select `P`.`ProductId` AS `ProductId`,`P`.`ProductName` AS `ProductName`,`Pr`.`PriceValue` AS `PriceValue`,`Pr`.`ChangeDate` AS `ChangeDate` from (`Product` `P` join `Price` `Pr` on((`P`.`ProductId` = `Pr`.`ProductId`))) where ((`Pr`.`ChangeDate` = (select max(`Price`.`ChangeDate`) from `Price` where ((`Price`.`ProductId` = `P`.`ProductId`) and (`Price`.`ChangeDate` <= sysdate())))) and (`Pr`.`OrdinalNumber` = (select max(`Price`.`OrdinalNumber`) from `Price` where ((`Price`.`ProductId` = `P`.`ProductId`) and (`Price`.`ChangeDate` <= sysdate()))))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-01 14:12:15
