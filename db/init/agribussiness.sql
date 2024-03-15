CREATE USER IF NOT EXISTS 'teti'@'%' IDENTIFIED BY 'Lautaro123.';
GRANT ALL PRIVILEGES ON *.* TO 'teti'@'%' WITH GRANT OPTION;

CREATE DATABASE IF NOT EXISTS Agribussiness;
USE Agribussiness;

-- MariaDB dump 10.19  Distrib 10.9.4-MariaDB, for debian-linux-gnu (x86_64)
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

--
-- Table structure for table `ArticulosTecnicos`
--

DROP TABLE IF EXISTS `ArticulosTecnicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ArticulosTecnicos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(128) NOT NULL,
  `descripcion` varchar(1024) DEFAULT NULL,
  `image` varchar(256) DEFAULT NULL,
  `url` varchar(256) NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ArticulosTecnicos`
--

LOCK TABLES `ArticulosTecnicos` WRITE;
/*!40000 ALTER TABLE `ArticulosTecnicos` DISABLE KEYS */;
INSERT INTO `ArticulosTecnicos` VALUES
(4,'Artículo de prueba','Nuevas semillas.','1709554610840.png','Https://www.Google.com','2024-03-04 12:15:11'),
(5,'','',NULL,'https://www.google.com/','2024-03-04 17:06:27');
/*!40000 ALTER TABLE `ArticulosTecnicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Cargos`
--

DROP TABLE IF EXISTS `Cargos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Cargos` (
  `cod_cargo` int(11) NOT NULL AUTO_INCREMENT,
  `id_depto` int(11) NOT NULL,
  `nombre` varchar(128) NOT NULL,
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
(1,1,'Gerente General',1),
(2,5,'Gerente Administrativo',2),
(3,2,'Coordinador de Ventas y Desarollo',3),
(4,2,'Representante Técnico Comercial',3),
(5,2,'Asistente Técnico Comercial',3),
(6,1,'Asistente de Gerencia',3),
(7,4,'Asistente de Despacho',3),
(8,3,'Encargado de Marketing',3),
(9,4,'Encargado de Logística',3),
(10,6,'Encargado de compras',3);
/*!40000 ALTER TABLE `Cargos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Chats`
--

DROP TABLE IF EXISTS `Chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `persona_1` char(10) NOT NULL,
  `persona_2` char(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cliente` (`persona_1`,`persona_2`),
  KEY `colaborador` (`persona_2`),
  CONSTRAINT `Chats_ibfk_1` FOREIGN KEY (`persona_1`) REFERENCES `Personas` (`cedula`),
  CONSTRAINT `Chats_ibfk_2` FOREIGN KEY (`persona_2`) REFERENCES `Personas` (`cedula`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Chats`
--

LOCK TABLES `Chats` WRITE;
/*!40000 ALTER TABLE `Chats` DISABLE KEYS */;
INSERT INTO `Chats` VALUES
(22,'666666','333333');
/*!40000 ALTER TABLE `Chats` ENABLE KEYS */;
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
(2,3,2,4000.00),
(2,5,3,1000.00),
(3,5,5,1000.00),
(4,6,25,1500.00),
(5,4,24,2500.00);
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
  `disposiciones` varchar(2048) NOT NULL,
  `file` varchar(256) NOT NULL,
  `cliente` char(10) DEFAULT NULL,
  `cliente_nuevo` varchar(64) DEFAULT NULL,
  `forma_pago` enum('Contado','Credito 15','Credito 30','Credito 45') NOT NULL DEFAULT 'Contado',
  `tiempo_entrega` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`nro_cotizacion`),
  KEY `colaborador` (`colaborador`),
  KEY `cliente` (`cliente`),
  CONSTRAINT `Cotizaciones_ibfk_1` FOREIGN KEY (`colaborador`) REFERENCES `Personas` (`cedula`),
  CONSTRAINT `Cotizaciones_ibfk_2` FOREIGN KEY (`cliente`) REFERENCES `Personas` (`cedula`),
  CONSTRAINT `double_client_check` CHECK (`cliente` is not null and `cliente_nuevo` is null or `cliente` is null and `cliente_nuevo` is not null)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cotizaciones`
--

LOCK TABLES `Cotizaciones` WRITE;
/*!40000 ALTER TABLE `Cotizaciones` DISABLE KEYS */;
INSERT INTO `Cotizaciones` VALUES
(2,'2024-03-04 12:50:39','creada','333333','Disposición de prueba','1709556639254.pdf','3',NULL,'Credito 15',9),
(3,'2024-03-04 15:55:56','creada','666666','','1709567756710.pdf','2',NULL,'Contado',3),
(4,'2024-03-05 18:17:36','creada','333333','Precio por compra ','1709662656786.pdf','3',NULL,'Contado',1),
(5,'2024-03-05 18:20:38','creada','333333','Precio ','1709662838856.pdf','3',NULL,'Contado',14);
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
-- Table structure for table `Dispositivos`
--

DROP TABLE IF EXISTS `Dispositivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Dispositivos` (
  `token` char(50) NOT NULL,
  `cedula` char(10) NOT NULL,
  PRIMARY KEY (`token`,`cedula`),
  KEY `cedula` (`cedula`),
  CONSTRAINT `Dispositivos_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `Personas` (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Dispositivos`
--

LOCK TABLES `Dispositivos` WRITE;
/*!40000 ALTER TABLE `Dispositivos` DISABLE KEYS */;
INSERT INTO `Dispositivos` VALUES
('ExponentPushToken[52ObtPI02Vg6f335NAXbIj]','2'),
('ExponentPushToken[cW7pUTNA_piYo4rkPYsPVt]','333333'),
('ExponentPushToken[f1LeHwJQKM_4QZOB66zOCZ]','22'),
('ExponentPushToken[vwndy5AahZLmRVJg_a9gyt]','333333');
/*!40000 ALTER TABLE `Dispositivos` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Eventos`
--

LOCK TABLES `Eventos` WRITE;
/*!40000 ALTER TABLE `Eventos` DISABLE KEYS */;
INSERT INTO `Eventos` VALUES
(1,'Nuevos precios','Más competitivos que nunca','2024-03-04 12:17:37','1709554699008.jpeg'),
(2,'Día de Campo','e realizará un visita al invernadero del Ing. Carlos Tomez en la ciudad de..','2024-03-04 12:40:39','1709556079741.png');
/*!40000 ALTER TABLE `Eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Imagenes`
--

DROP TABLE IF EXISTS `Imagenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Imagenes` (
  `path` varchar(256) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `nro_imagen` int(11) NOT NULL,
  `comentarios` varchar(512) DEFAULT '',
  PRIMARY KEY (`id_producto`,`nro_imagen`),
  CONSTRAINT `Imagenes_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `Productos` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Imagenes`
--

LOCK TABLES `Imagenes` WRITE;
/*!40000 ALTER TABLE `Imagenes` DISABLE KEYS */;
INSERT INTO `Imagenes` VALUES
('1709556448991.jpeg',6,0,'Comentario de la foto'),
('1709556459574.jpeg',6,1,'Comentario de prueba'),
('1709556469862.jpeg',6,2,'');
/*!40000 ALTER TABLE `Imagenes` ENABLE KEYS */;
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
-- Table structure for table `Messages`
--

DROP TABLE IF EXISTS `Messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) NOT NULL,
  `sender` char(10) NOT NULL,
  `message` varchar(1024) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `chat_id` (`chat_id`),
  KEY `sender` (`sender`),
  CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `Chats` (`id`),
  CONSTRAINT `Messages_ibfk_2` FOREIGN KEY (`sender`) REFERENCES `Personas` (`cedula`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Messages`
--

LOCK TABLES `Messages` WRITE;
/*!40000 ALTER TABLE `Messages` DISABLE KEYS */;
INSERT INTO `Messages` VALUES
(107,22,'666666','hola','2024-03-04 12:57:57'),
(108,22,'333333','Hola','2024-03-04 12:58:56'),
(109,22,'333333','Por favor préstame guita','2024-03-04 12:59:06'),
(110,22,'666666','Dale','2024-03-04 12:59:15'),
(113,22,'333333','Hola','2024-03-05 17:46:38'),
(114,22,'333333','Hola','2024-03-05 17:47:01');
/*!40000 ALTER TABLE `Messages` ENABLE KEYS */;
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
  `cod_cargo` int(11) DEFAULT NULL,
  `nombre` varchar(60) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `rol` enum('admin','cliente','colaborador','invitado') NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`cedula`),
  KEY `cod_zona` (`cod_zona`),
  KEY `cod_cargo` (`cod_cargo`),
  CONSTRAINT `Personas_ibfk_1` FOREIGN KEY (`cod_zona`) REFERENCES `Zonas` (`cod_zona`),
  CONSTRAINT `Personas_ibfk_2` FOREIGN KEY (`cod_cargo`) REFERENCES `Cargos` (`cod_cargo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Personas`
--

LOCK TABLES `Personas` WRITE;
/*!40000 ALTER TABLE `Personas` DISABLE KEYS */;
INSERT INTO `Personas` VALUES
('2','$2b$10$Wp.sldJZObm.CFsBCo0WXOWn5I/OKmSM.wF8LmEt6qYmsZhrPKSSC',2,NULL,'Aaaa','Aaa@aaa.com','124846794','Sushe 123','cliente',0),
('22','$2b$10$EgjFk1g2zJQCZz3GMHsql.RxvXrKgC4ecTg9A8OXUD187p.eZHHry',2,NULL,'Cliente de prueba','Cliente@thorque.com.ar','123456789','Prueba 333','cliente',0),
('3','$2b$10$IfX0CiIukVurpqRjnzraR.I1cgGaKYS8yOh7OriK00qnkDR.LDRJ6',2,NULL,'Cliente','cliente@hotmail.com','13791677646','Prueba 123','cliente',0),
('333333','$2b$10$jFgFu.Sy5UZLHKrC21edseXf1FGWCwq/r/v6C69xcI102JyfmxAbC',1,1,'Juan','juancarlos@gmail.com',NULL,'Maipu 444','colaborador',0),
('6','$2b$10$tVP68/fo6Yr/fEurmLQyNu27UGnzohlQqHBbPdi9MFCCAuT04oh1q',2,8,'Colaborador','colaborador@example.com','3417293721','Ejemplo 123','colaborador',1),
('666666','$2b$10$YCFD5FQyfswUKM6q5osDvu7mbQIP2KMa6YLR446abGtKodDSkA3M.',1,6,'Jose','jose@gmail.com',NULL,'Zeballos 444','colaborador',0),
('admin','$2b$10$JoR3.ISiE2QcEBN8VEmFA.QAeeInV/pxcFiHQhjykdfYxWzIzP9AS',1,NULL,'admin','',NULL,'','admin',0),
('invitado','$2b$10$oGz/OOPpk8iuM/TN3Lptp.Lrmfs6..4SUjSJ7xmblpyX5WemPOHPK',1,NULL,'invitado','',NULL,'','invitado',0);
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
  `id_proveedor` int(11) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `presentacion` varchar(128) NOT NULL,
  `descripcion` varchar(512) NOT NULL,
  `ficha_tecnica` varchar(256) DEFAULT NULL,
  `portada` varchar(256) DEFAULT NULL,
  `iva` int(11) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_producto`),
  KEY `id_proveedor` (`id_proveedor`),
  CONSTRAINT `Productos_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `Proveedores` (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Productos`
--

LOCK TABLES `Productos` WRITE;
/*!40000 ALTER TABLE `Productos` DISABLE KEYS */;
INSERT INTO `Productos` VALUES
(2,1,1000.00,'Cebolla Malbec ','sobre de 5000 semillas','excelente produccion y resistente',NULL,'1709555695538.jpeg',0,0),
(3,2,4000.00,'Pimiento iguazú','Sobre de 1000 semillas','resistente y productiva',NULL,'1709555792025.jpeg',11,0),
(4,3,2500.00,'Pimiento canario','sobre de 1000 semillas','excelente produccion y resistente',NULL,'1709555838902.jpeg',21,0),
(5,1,1000.00,'Repollo megaroon','Sobre de 1000 semillas','Excelente produccion y resistencia.',NULL,'1709555951185.jpeg',0,0),
(6,2,1500.00,'Tomate Vento','Sobre de 1000 semillas','Excelente calidad',NULL,'1709556265493.jpeg',11,0),
(7,1,100.00,'','','',NULL,NULL,0,1),
(8,1,100.00,'licho','akkaj','hola',NULL,'1709927160780.jpeg',11,1);
/*!40000 ALTER TABLE `Productos` ENABLE KEYS */;
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
  `photo` varchar(256) DEFAULT NULL,
  `ficha_tecnica` varchar(256) DEFAULT NULL,
  `id_linea` int(11) NOT NULL,
  PRIMARY KEY (`id_proveedor`),
  KEY `id_linea` (`id_linea`),
  CONSTRAINT `Proveedores_ibfk_1` FOREIGN KEY (`id_linea`) REFERENCES `LineasNegocio` (`id_linea`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Proveedores`
--

LOCK TABLES `Proveedores` WRITE;
/*!40000 ALTER TABLE `Proveedores` DISABLE KEYS */;
INSERT INTO `Proveedores` VALUES
(1,'Proveedor 1','1709555478062.jpg',NULL,1),
(2,'Proveedor 2','1709555494872.jpg',NULL,2),
(3,'Proveedor 3','1709555528624.png',NULL,3);
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
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `descripcion` text NOT NULL,
  `aceptada` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`cod_solicitud`),
  KEY `solicitante` (`solicitante`),
  KEY `solicitado` (`solicitado`),
  CONSTRAINT `Solicitudes_ibfk_1` FOREIGN KEY (`solicitante`) REFERENCES `Personas` (`cedula`),
  CONSTRAINT `Solicitudes_ibfk_2` FOREIGN KEY (`solicitado`) REFERENCES `Personas` (`cedula`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Solicitudes`
--

LOCK TABLES `Solicitudes` WRITE;
/*!40000 ALTER TABLE `Solicitudes` DISABLE KEYS */;
INSERT INTO `Solicitudes` VALUES
(1,'666666','333333','2024-03-04 12:55:08','Hola juan soy carlos y quiero solicitarte algo.',0),
(2,'666666','333333','2024-03-04 15:53:47','',0);
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

-- Dump completed on 2024-03-15  2:35:33
