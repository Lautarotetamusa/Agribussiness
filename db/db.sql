CREATE USER 'teti'@'%' IDENTIFIED BY 'Lautaro123.';
GRANT ALL PRIVILEGES ON *.* TO 'teti'@'%' WITH GRANT OPTION;

CREATE DATABASE IF NOT EXISTS Agribussiness;
USE Agribussiness;

CREATE TABLE Personas(
    cedula CHAR(10) NOT NULL,
    password BINARY(60) NOT NULL,
    id_depto INT,
    cod_zona INT NOT NULL,
    cod_cargo INT,
    nombre VARCHAR(60) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    telefono VARCHAR(15),
    direccion VARCHAR(255),
    rol ENUM("admin", "cliente", "colaborador") NOT NULL,
    is_deleted BOOLEAN DEFAULT false,

    PRIMARY KEY (cedula),
    FOREIGN KEY (id_depto) REFERENCES Departamentos(id_depto),
    FOREIGN KEY (cod_zona) REFERENCES Zonas(cod_zona),
    FOREIGN KEY (cod_cargo) REFERENCES Cargos(cod_cargo)
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
    id_proveedor INT NOT NULL,
    precio DECIMAL (10, 2) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    presentacion VARCHAR(128) NOT NULL,
    descripcion VARCHAR(512) NOT NULL,
    ficha_tecnica VARCHAR(256) DEFAULT NULL

    PRIMARY KEY (id_producto),
    FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor)
);

CREATE TABLE Promociones(
    id_promo INT NOT NULL AUTO_INCREMENT,
    cod_zona INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    fecha_expiracion DATE NOT NULL,
    descripcion VARCHAR(512) NOT NULL,

    PRIMARY KEY (id_promo),
    FOREIGN KEY (cod_zona) REFERENCES Zonas(cod_zona)
);

CREATE TABLE Proveedores(
    id_proveedor INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(128) NOT NULL,
    photo VARCHAR(256),
    ficha_tecnica VARCHAR(256),

    PRIMARY KEY (id_proveedor)
);

CREATE TABLE Cargos(
    cod_cargo INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(128) NOT NULL,

    PRIMARY KEY(cod_cargo)
);
INSERT INTO Cargos (nombre) VALUES 
    ("Gerente General"),
    ("Gerente Administrativo"), 
    ("Coordinador de Ventas y Desarollo"), 
    ("Representante Técnico Comercial"),  
    ("Asistente Técnico Comercial"),
    ("Asistente de Gerencia"),
    ("Asistente de Despacho"), 
    ("Encargado de Marketing"),
    ("Encargada de Logística");