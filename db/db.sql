CREATE USER 'teti'@'%' IDENTIFIED BY 'Lautaro123.';
GRANT ALL PRIVILEGES ON *.* TO 'teti'@'%' WITH GRANT OPTION;

CREATE DATABASE IF NOT EXISTS Agribussiness;
USE Agribussiness;

CREATE TABLE Personas(
    cedula CHAR(10) NOT NULL,
    password BINARY(60) NOT NULL,
    id_depto INT,
    cod_zona INT,
    nombre VARCHAR(60) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    telefono VARCHAR(15),
    direccion VARCHAR(255),
    rol TINYINT NOT NULL,
    is_deleted BOOLEAN DEFAULT false,

    PRIMARY KEY (cedula),
    FOREIGN KEY (id_depto) REFERENCES Departamentos(id_depto),
    FOREIGN KEY (cod_zona) REFERENCES Zonas(cod_zona)
);

CREATE TABLE Zonas(
    cod_zona INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL,

    PRIMARY KEY (cod_zona)
);

CREATE TABLE Departamentos(
    id_depto INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL,
    telefono VARCHAR(15) NOT NULL,

    PRIMARY KEY (id_depto)
);

CREATE TABLE Productos(
    id_producto INT NOT NULL AUTO_INCREMENT,
    precio DECIMAL (10, 2) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    presentacion VARCHAR(128) NOT NULL,
    descripcion VARCHAR(512) NOT NULL,
    ficha_tecnica VARCHAR(256) DEFAULT NULL

    PRIMARY KEY (id_producto)
);

CREATE TABLE Promociones(
    id_promo INT NOT NULL AUTO_INCREMENT,
    cod_zona INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    fecha_expiracion DATE NOT NULL,
    descripcion VARCHAR NOT NULL,

    PRIMARY KEY id_promo,
    FOREIGN KEY cod_zona REFERENCES Zonas(cod_zona)
);