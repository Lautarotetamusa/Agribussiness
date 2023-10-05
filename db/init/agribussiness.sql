-- MariaDB dump 10.19  Distrib 10.11.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: Agribussiness
-- ------------------------------------------------------
-- Server version	10.9.4-MariaDB-1:10.9.4+maria~ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE USER IF NOT EXISTS 'teti'@'%' IDENTIFIED BY 'Lautaro123.';
GRANT ALL PRIVILEGES ON *.* TO 'teti'@'%' WITH GRANT OPTION;

CREATE DATABASE IF NOT EXISTS Agribussiness;
USE Agribussiness;

--
-- Table structure for table `Cargos`
--

DROP TABLE IF EXISTS `Cargos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Cargos` (
  `cod_cargo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(128) NOT NULL,
  `id_depto` int(11) NOT NULL,
  `nivel` int(2) NOT NULL,
  PRIMARY KEY (`cod_cargo`),
  KEY `id_depto` (`id_depto`),
  CONSTRAINT `Cargos_ibfk_1` FOREIGN KEY (`id_depto`) REFERENCES `Departamentos` (`id_depto`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cargos`
--

LOCK TABLES `Cargos` WRITE;
/*!40000 ALTER TABLE `Cargos` DISABLE KEYS */;
INSERT INTO `Cargos` VALUES
(1,'Gerente General',1,1),
(2,'Gerente Administrativo',5,2),
(3,'Coordinador de Ventas y Desarrollo',2,3),
(4,'Representante Técnico Comercial',2,3),
(5,'Asistente Técnico Comercial',2,3),
(6,'Asistente de Gerencia',1,3),
(7,'Asistente de Despacho',4,3),
(8,'Encargado de Marketing',3,3),
(9,'Encargada de Logística',4,3),
(10,'Encargado de compras',6,3);
/*!40000 ALTER TABLE `Cargos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CotizacionProducto`
--

DROP TABLE IF EXISTS `CotizacionProducto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CotizacionProducto` (
  `nro_cotizacion` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_final` decimal(10,2) NOT NULL,
  PRIMARY KEY (`nro_cotizacion`,`id_producto`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `CotizacionProducto_ibfk_1` FOREIGN KEY (`nro_cotizacion`) REFERENCES `Cotizaciones` (`nro_cotizacion`),
  CONSTRAINT `CotizacionProducto_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `Productos` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CotizacionProducto`
--

LOCK TABLES `CotizacionProducto` WRITE;
/*!40000 ALTER TABLE `CotizacionProducto` DISABLE KEYS */;
INSERT INTO `CotizacionProducto` VALUES
(2,1,3,100.00),
(2,3,2,102.00),
(3,1,3,100.00),
(3,3,2,102.00),
(4,1,3,100.00),
(4,3,2,102.00),
(5,1,3,100.00),
(5,3,2,102.00),
(6,1,3,100.00),
(6,3,2,102.00),
(7,1,3,100.00),
(7,3,2,102.00);
/*!40000 ALTER TABLE `CotizacionProducto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Cotizaciones`
--

DROP TABLE IF EXISTS `Cotizaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Cotizaciones` (
  `nro_cotizacion` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` enum('aprobada','creada') NOT NULL DEFAULT 'creada',
  `colaborador` char(10) NOT NULL,
  `cliente` char(10) NOT NULL,
  `file` varchar(256) NOT NULL,
  `forma_pago` enum('Contado','Credito 15','Credito 30','Credito 45') NOT NULL DEFAULT 'Contado',
  `tiempo_entrega` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`nro_cotizacion`),
  KEY `colaborador` (`colaborador`),
  KEY `cliente` (`cliente`),
  CONSTRAINT `Cotizaciones_ibfk_1` FOREIGN KEY (`colaborador`) REFERENCES `Personas` (`cedula`),
  CONSTRAINT `Cotizaciones_ibfk_2` FOREIGN KEY (`cliente`) REFERENCES `Personas` (`cedula`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cotizaciones`
--

LOCK TABLES `Cotizaciones` WRITE;
/*!40000 ALTER TABLE `Cotizaciones` DISABLE KEYS */;
INSERT INTO `Cotizaciones` VALUES
(1,'2023-10-04 10:54:04','creada','492183214','43491979','1696416844920.pdf','Contado',1),
(2,'2023-10-04 10:59:36','creada','492183214','43491979','1696417176084.pdf','Contado',1),
(3,'2023-10-04 11:00:16','creada','492183214','43491979','1696417216711.pdf','Contado',1),
(4,'2023-10-04 11:01:47','creada','492183214','43491979','1696417307501.pdf','Contado',1),
(5,'2023-10-04 11:16:20','creada','492183214','43491979','1696418180753.pdf','Contado',1),
(6,'2023-10-04 11:16:54','creada','492183214','43491979','1696418214621.pdf','Contado',1),
(7,'2023-10-04 11:17:39','creada','492183214','43491979','1696418259901.pdf','Contado',1);
/*!40000 ALTER TABLE `Cotizaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Departamentos`
--

DROP TABLE IF EXISTS `Departamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Departamentos` (
  `id_depto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  PRIMARY KEY (`id_depto`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Departamentos`
--

LOCK TABLES `Departamentos` WRITE;
/*!40000 ALTER TABLE `Departamentos` DISABLE KEYS */;
INSERT INTO `Departamentos` VALUES
(1,'GERENCIA GENERAL','1234'),
(2,'VENTAS Y DESAROLLO','2345'),
(3,'MARKETING','3456'),
(4,'LOGÍSTICA','4567'),
(5,'ADMISTRACION Y FINANZAS','5678'),
(6,'COMPRAS','6789');
/*!40000 ALTER TABLE `Departamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Eventos`
--

DROP TABLE IF EXISTS `Eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Eventos` (
  `id_evento` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(128) NOT NULL,
  `descripcion` varchar(1024) DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `image` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id_evento`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Eventos`
--

LOCK TABLES `Eventos` WRITE;
/*!40000 ALTER TABLE `Eventos` DISABLE KEYS */;
INSERT INTO `Eventos` VALUES
(1,'Evento de campo','Evento de campo reunión para toda la familia','2023-09-11 16:43:42','1694453141055.png'),
(2,'¡¡Nuevos precios!','Estimados clientes se realizó cambios en los precios por favor revisar .','2023-09-11 16:44:27',NULL);
/*!40000 ALTER TABLE `Eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FichaTecnica`
--

DROP TABLE IF EXISTS `FichaTecnica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FichaTecnica` (
  `id_ficha` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `archivo` varchar(255) NOT NULL,
  `id_producto` int(11) NOT NULL,
  PRIMARY KEY (`id_ficha`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `FichaTecnica_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `Productos` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FichaTecnica`
--

LOCK TABLES `FichaTecnica` WRITE;
/*!40000 ALTER TABLE `FichaTecnica` DISABLE KEYS */;
/*!40000 ALTER TABLE `FichaTecnica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LineasNegocio`
--

DROP TABLE IF EXISTS `LineasNegocio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LineasNegocio` (
  `id_linea` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(128) NOT NULL,
  `image` varchar(256) NOT NULL,
  PRIMARY KEY (`id_linea`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LineasNegocio`
--

LOCK TABLES `LineasNegocio` WRITE;
/*!40000 ALTER TABLE `LineasNegocio` DISABLE KEYS */;
INSERT INTO `LineasNegocio` VALUES
(1,'Turbas','TURBAS.jpeg'),
(2,'Semillas','SEMILLAS.png'),
(3,'Bandejas','BANDEJAS.jpg'),
(4,'Maquinarias','MAQUINARIA.png'),
(5,'Trampas','TRAMPAS.jpg'),
(6,'Productos Eco','PRODUCTOS_ECO.jpg'),
(7,'Entutorado','ENTUTORADO.png'),
(8,'Otros','OTROS.jpg');
/*!40000 ALTER TABLE `LineasNegocio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Personas`
--

DROP TABLE IF EXISTS `Personas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Personas` (
  `cedula` char(10) NOT NULL,
  `password` binary(60) NOT NULL,
  `cod_zona` int(11) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `rol` enum('admin','cliente','colaborador') NOT NULL,
  `cod_cargo` int(11) DEFAULT NULL,
  PRIMARY KEY (`cedula`),
  KEY `cod_zona` (`cod_zona`),
  KEY `cod_cargo` (`cod_cargo`),
  CONSTRAINT `Personas_ibfk_2` FOREIGN KEY (`cod_zona`) REFERENCES `Zonas` (`cod_zona`),
  CONSTRAINT `Personas_ibfk_4` FOREIGN KEY (`cod_cargo`) REFERENCES `Cargos` (`cod_cargo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Personas`
--

LOCK TABLES `Personas` WRITE;
/*!40000 ALTER TABLE `Personas` DISABLE KEYS */;
INSERT INTO `Personas` VALUES
('204349197','$2b$10$cS.2t0W/VJ6zkSnOHhQf3OkxaTWHQb6VSjsXCoJquTSXBPD9IIVS6',2,'Juan ramon','lautarotetamusa@gmail.com',NULL,'urquiza 1159',1,'cliente',NULL),
('2043491978','$2b$10$/17GjSxcLyRDrGumrch.2uM78MZaIwDiqJHFPIZKeuChla5u/hdLG',1,'Juan ramon Alberto Jose','lautarotetamusa@gmail.com',NULL,'urquiza 1159',0,'admin',NULL),
('348213901','$2b$10$MImncc/vL/QzI7cNOARuvuA4DDrBDDMYolzg1ZLmkGVjxChHjMeFq',1,'juan ramon','juanramon@gmail.com',NULL,'zeballos 1159',0,'cliente',NULL),
('348213902','$2b$10$kPlyuWDfNXZsTctWQ9iMhegHDoRxly7YO4raHeP6plzmPV2AZxFci',2,'Juan alonso el facha','juanramon@gmail.com',NULL,'zeballos 1159',0,'cliente',NULL),
('348213904','$2b$10$ZoDqz7/WV5EhpJNYWt5a0eg1jbbYyfRWF3kBRUehyZJlBn3Jyk2X.',1,'juan ramon','juanramon@gmail.com',NULL,'zeballos 1159',0,'cliente',NULL),
('348213905','$2b$10$4dlBzpav9vBOyCk9rmuEl.7uw1xS3cYjciLtnxFDlYnbNYC/PNfQW',1,'juan ramon','juanramon@gmail.com',NULL,'zeballos 1159',0,'cliente',NULL),
('348213906','$2b$10$It/iTpj/lcmZVeV6RCCjF.wdQdN.vuElPr/sNV/fpOF2aYjZ7Vpg.',1,'juan ramon','juanramon@gmail.com',NULL,'zeballos 1159',1,'cliente',NULL),
('348213907','$2b$10$pwCXlAtYy54tY237sb96IOffeF8xlREBkUMDFUEISgFAUHJQ8P9Vq',1,'juan ramon','juanramon@gmail.com',NULL,'zeballos 1159',0,'cliente',NULL),
('39214281','$2b$10$ke.cqNRqz.yB3RtncweYxu0Qg4du9XhlQcFHSwAEFnYXuRorFCMCe',3,'Manuel Variego','manu141414@gmail.com',NULL,'New YOrk',0,'cliente',NULL),
('39214282','$2b$10$U.V7tC.7nlo.R1ZnmGTJquNMLCpRHIWvNQmVQGvHDoLkw1VvSB28G',3,'Manuel Variego','manu141414@gmail.com',NULL,'New YOrk',0,'colaborador',1),
('392142823','$2b$10$bm8lkD8dsEx6Lupwlu8/Ue3r7L04WQ1mI793mXqSP02EVhsz.pDoe',3,'Manuel Variego','manu141414@gmail.com',NULL,'New YOrk',0,'colaborador',6),
('392142824','$2b$10$QtYm/Ahwd.hVuZm6BcoAPuvHEDoESoKknRGft1/5aZw5VZ5JguY4W',3,'Manuel Variego','manu141414@gmail.com',NULL,'New YOrk',0,'colaborador',9),
('4213','$2b$10$UA4ocdWK2dL5di4aEjUEPu0.sDvYyZUJpM7woI983nBJe.W4Wr1Di',1,'Leo Messi','leomessi@gmail.com',NULL,'dorrego 737',0,'cliente',NULL),
('43491978','$2b$10$kHbiEirM6O3SeCT/aUSBSeeM8IRnZhtlo/HaMM7lzKsYX5JFrMqDi',1,'Lautaro','lautarotetamusa@gmail.com',NULL,'urquiza 1159',0,'admin',NULL),
('43491979','Lautaro123.\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0',1,'Lautaro','lautarotetamusa@gmail.com',NULL,'urquiza 1159',0,'cliente',NULL),
('492183214','$2b$10$VcN3PL0rp41C/4ajDaMaFOT9MNbz..kz8cxL.XPitMCLhZ/K0K.Ka',2,'Juan ramon Alberto Jose','roberto@gmail.com',NULL,'dorrego 737',0,'colaborador',1),
('5721832','$2b$10$I/SnYhitXPS49nI9fDEJbufTVbUbhtZEjQtUnwUqgHTUjeyq8BgMG',1,'Leo Messi','leomessi@gmail.com',NULL,'dorrego 737',0,'cliente',NULL),
('591209321','$2b$10$AI.SP2fj/KAybP/FOkLAV..c.NzuNuYtMxuEV5THa6fBfGaswrqiC',2,'Callender','callender@gmail.com',NULL,'Philadelphia',0,'colaborador',1),
('591209322','$2b$10$NN.QFbjcJCQjhetb45eyOu5kWZ0JTuEwkzqMuNA7PWsN87SkGCTJG',2,'Callender','callender@gmail.com',NULL,'Philadelphia',0,'colaborador',4),
('592813921','$2b$10$BSE5SvtByBlWD2iZ0/D70ewoSdqYW4cAtb1SD8nq.ieeCt68izGRS',1,'Leo Messi','leomessi@gmail.com',NULL,'dorrego 737',0,'cliente',NULL),
('592813922','$2b$10$jJMeZIZw0Qqn32RBs6Jf0eGsf2v2Ng1Ycm0YQXwhSsV/oSrH7HK7K',1,'Leo Messi','leomessi@gmail.com',NULL,'dorrego 737',0,'cliente',NULL);
/*!40000 ALTER TABLE `Personas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Productos`
--

DROP TABLE IF EXISTS `Productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Productos` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `precio` decimal(10,2) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `presentacion` varchar(128) NOT NULL,
  `descripcion` varchar(512) NOT NULL,
  `ficha_tecnica` varchar(256) DEFAULT NULL,
  `id_proveedor` int(11) NOT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `id_proveedor` (`id_proveedor`),
  CONSTRAINT `Productos_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `Proveedores` (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Productos`
--

LOCK TABLES `Productos` WRITE;
/*!40000 ALTER TABLE `Productos` DISABLE KEYS */;
INSERT INTO `Productos` VALUES
(1,100.00,'Edulcurante 2','100 ml','edulcorante para el mate ihh','files/fichas_tecnicas/1_1696424057871_Ficha Técnica - Almar-1.pdf',1),
(2,100.00,'XD XD XD','10 ml','para la soja','files/fichas_tecnicas/2_1693332259444_Ficha Técnica - Almar-1.pdf',1),
(3,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(4,0.00,'0','0','0',NULL,1),
(5,0.00,'0','0','0',NULL,1),
(6,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(7,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(8,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(9,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(10,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(11,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(12,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(13,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(14,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(15,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(16,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(17,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(18,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(19,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(20,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(21,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(22,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(23,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(24,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(25,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(26,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(27,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(28,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(29,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(30,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(31,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(32,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(33,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(34,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(35,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(36,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(37,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(38,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(39,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(40,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(41,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(42,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(43,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(44,100.00,'Agrotoxicos','10 ml','para la soja',NULL,1),
(45,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(46,200.50,'cocacola','10ml','para refrescar la garganta',NULL,1),
(47,101.00,'Agrotoxicos','10 ml','para la soja',NULL,1),
(48,101.00,'Agrotoxicos','10 ml','para la soja',NULL,1),
(51,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(52,200.50,'cocacola','10ml','para refrescar la garganta',NULL,2),
(53,101.00,'Agrotoxicos','10 ml','para la soja',NULL,1),
(54,101.00,'Agrotoxicos','10 ml','para la soja',NULL,1),
(55,500.00,'metanfetamina','100ml','holaaaaaa',NULL,1),
(56,200.50,'cocacola','10ml','para refrescar la garganta',NULL,2);
/*!40000 ALTER TABLE `Productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Promociones`
--

DROP TABLE IF EXISTS `Promociones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Promociones` (
  `id_promo` int(11) NOT NULL AUTO_INCREMENT,
  `cod_zona` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `fecha_expiracion` date NOT NULL,
  `descripcion` varchar(512) NOT NULL,
  PRIMARY KEY (`id_promo`),
  KEY `cod_zona` (`cod_zona`),
  CONSTRAINT `Promociones_ibfk_1` FOREIGN KEY (`cod_zona`) REFERENCES `Zonas` (`cod_zona`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Promociones`
--

LOCK TABLES `Promociones` WRITE;
/*!40000 ALTER TABLE `Promociones` DISABLE KEYS */;
INSERT INTO `Promociones` VALUES
(1,2,'muy nuevo titulo','2023-08-30','2 x 1 en productos seleccionados'),
(2,1,'Oferta en el area agricola','2023-08-30','2 x 1 en productos seleccionados');
/*!40000 ALTER TABLE `Promociones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Proveedores`
--

DROP TABLE IF EXISTS `Proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Proveedores` (
  `id_proveedor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(128) NOT NULL,
  `photo` varchar(256) NOT NULL,
  `ficha_tecnica` varchar(256) DEFAULT NULL,
  `id_linea` int(11) NOT NULL,
  PRIMARY KEY (`id_proveedor`),
  KEY `id_linea` (`id_linea`),
  CONSTRAINT `Proveedores_ibfk_1` FOREIGN KEY (`id_linea`) REFERENCES `LineasNegocio` (`id_linea`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Proveedores`
--

LOCK TABLES `Proveedores` WRITE;
/*!40000 ALTER TABLE `Proveedores` DISABLE KEYS */;
INSERT INTO `Proveedores` VALUES
(1,'Monsanto','hola_1693515075489.png',NULL,1),
(2,'hola','hola_1693515294719.png','hola_1693515294718.pdf',1),
(3,'hola','hola_1694029808993.png',NULL,2),
(4,'Proveedor de ropa','Proveedor de ropa_1694031204564.png',NULL,2),
(5,'Proveedor de ropa','1694035224388.png',NULL,2),
(6,'Proveedor de verduras','1694109927724.png',NULL,2),
(7,'Proveedor de verduras','1694111052523.png',NULL,2);
/*!40000 ALTER TABLE `Proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Solicitudes`
--

DROP TABLE IF EXISTS `Solicitudes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Solicitudes` (
  `cod_solicitud` int(11) NOT NULL AUTO_INCREMENT,
  `solicitante` char(10) NOT NULL,
  `solicitado` char(10) NOT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `descripcion` text NOT NULL,
  `aceptada` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`cod_solicitud`),
  KEY `solicitante` (`solicitante`),
  KEY `solicitado` (`solicitado`),
  CONSTRAINT `Solicitudes_ibfk_1` FOREIGN KEY (`solicitante`) REFERENCES `Personas` (`cedula`),
  CONSTRAINT `Solicitudes_ibfk_2` FOREIGN KEY (`solicitado`) REFERENCES `Personas` (`cedula`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Solicitudes`
--

LOCK TABLES `Solicitudes` WRITE;
/*!40000 ALTER TABLE `Solicitudes` DISABLE KEYS */;
INSERT INTO `Solicitudes` VALUES
(1,'392142823','492183214','2023-09-13 16:18:46','Estoy cansado jefe, necesito unas vacaciones',1),
(2,'392142823','492183214','2023-09-29 10:21:34','Estoy cansado jefe, necesito unas vacaciones',1),
(3,'392142823','492183214','2023-09-29 10:59:55','Estoy cansado jefe, necesito unas vacaciones',1);
/*!40000 ALTER TABLE `Solicitudes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Zonas`
--

DROP TABLE IF EXISTS `Zonas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Zonas` (
  `cod_zona` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  PRIMARY KEY (`cod_zona`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Zonas`
--

LOCK TABLES `Zonas` WRITE;
/*!40000 ALTER TABLE `Zonas` DISABLE KEYS */;
INSERT INTO `Zonas` VALUES
(1,'Cordoba'),
(2,'Santa Fe'),
(3,'Buenos Aires'),
(4,'Salta');
/*!40000 ALTER TABLE `Zonas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-05 17:25:18
