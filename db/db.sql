CREATE USER IF NOT EXISTS 'teti'@'%' IDENTIFIED BY 'Lautaro123.';
GRANT ALL PRIVILEGES ON *.* TO 'teti'@'%' WITH GRANT OPTION;

CREATE DATABASE IF NOT EXISTS Agribussiness;
USE Agribussiness;

CREATE TABLE IF NOT EXISTS Zonas(
    cod_zona INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL,

    PRIMARY KEY (cod_zona)
);

CREATE TABLE IF NOT EXISTS Departamentos(
    id_depto INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL,
    telefono VARCHAR(15) NOT NULL,

    PRIMARY KEY (id_depto)
);

CREATE TABLE IF NOT EXISTS Cargos(
    cod_cargo INT NOT NULL AUTO_INCREMENT,
    id_depto INT NOT NULL,
    nombre VARCHAR(128) NOT NULL,
    nivel INT(2) NOT NULL,

    PRIMARY KEY(cod_cargo),
    FOREIGN KEY (id_depto) REFERENCES Departamentos(id_depto)
);

CREATE TABLE IF NOT EXISTS Personas(
    cedula CHAR(10) NOT NULL,
    password BINARY(60) NOT NULL,
    cod_zona INT NOT NULL,
    cod_cargo INT,
    nombre VARCHAR(60) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    telefono VARCHAR(15),
    direccion VARCHAR(255),
    rol ENUM("admin", "cliente", "colaborador", "invitado") NOT NULL,
    is_deleted BOOLEAN DEFAULT false,

    PRIMARY KEY (cedula),
    FOREIGN KEY (cod_zona) REFERENCES Zonas(cod_zona),
    FOREIGN KEY (cod_cargo) REFERENCES Cargos(cod_cargo)
);

CREATE TABLE Dispositivos(
    token CHAR(50) NOT NULL ,
    cedula CHAR(10) NOT NULL,
    
    PRIMARY KEY (token, cedula),
    FOREIGN KEY (cedula) REFERENCES Personas(cedula)
);



/* El campo ficha_tecnica campo no va mas, pero lo dejamos por ahora por si acaso TODO! */
CREATE TABLE IF NOT EXISTS Proveedores(
    id_proveedor INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(128) NOT NULL,
    photo VARCHAR(256),
    ficha_tecnica VARCHAR(256), 
    id_linea int(11) NOT NULL,

    PRIMARY KEY (id_proveedor),
    FOREIGN KEY (id_linea) REFERENCES LineasNegocio(id_linea)
);

CREATE TABLE IF NOT EXISTS Productos(
    id_producto INT NOT NULL AUTO_INCREMENT,
    id_proveedor INT NOT NULL,
    precio DECIMAL (10, 2) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    presentacion VARCHAR(128) NOT NULL,
    descripcion VARCHAR(512) NOT NULL,
    is_deleted BOOLEAN DEFAULT false,
    
    ficha_tecnica VARCHAR(256) DEFAULT NULL,
    portada VARCHAR(256) DEFAULT NULL,

    iva INT DEFAULT 0,

    PRIMARY KEY (id_producto),
    FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor)
);

CREATE TABLE IF NOT EXISTS Solicitudes(
    cod_solicitud INT NOT NULL AUTO_INCREMENT,
    solicitante CHAR(10) NOT NULL,
    solicitado CHAR(10) NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT NOT NULL,
    aceptada BOOLEAN NOT NULL DEFAULT 0,

    PRIMARY KEY(cod_solicitud),
    FOREIGN KEY (solicitante) REFERENCES Personas(cedula),
    FOREIGN KEY (solicitado) REFERENCES Personas(cedula)
);

CREATE TABLE IF NOT EXISTS LineasNegocio(
    id_linea INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(128) NOT NULL,
    image VARCHAR(256) NOT NULL,

    PRIMARY KEY (id_linea)
);

CREATE TABLE IF NOT EXISTS Eventos(
    id_evento INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(128) NOT NULL,
    descripcion VARCHAR(1024),
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(256) DEFAULT NULL,

    PRIMARY KEY (id_evento)
);

CREATE TABLE IF NOT EXISTS ArticulosTecnicos(
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(128) NOT NULL,
    descripcion VARCHAR(1024),
    image VARCHAR(256) DEFAULT NULL,
    url VARCHAR(256) NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Cotizaciones(
    nro_cotizacion INT NOT NULL AUTO_INCREMENT,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM("aprobada", "creada") NOT NULL DEFAULT "creada",
    colaborador CHAR(10) NOT NULL,
    disposiciones VARCHAR(2048) NOT NULL,
    file VARCHAR(256) NOT NULL,

    cliente CHAR(10) DEFAULT NULL,
    cliente_nuevo VARCHAR(64) DEFAULT NULL,

    forma_pago ENUM("Contado", "Credito 15", "Credito 30", "Credito 45") NOT NULL DEFAULT "Contado",
    tiempo_entrega TINYINT NOT NULL DEFAULT 1, 

    PRIMARY KEY (nro_cotizacion),
    FOREIGN KEY (colaborador) REFERENCES Personas(cedula),
    FOREIGN KEY (cliente) REFERENCES Personas(cedula)
);
ALTER TABLE Cotizaciones ADD constraint double_client_check CHECK(
    (cliente IS NOT NULL AND cliente_nuevo IS NULL) OR
    (cliente IS NULL AND cliente_nuevo IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS CotizacionProducto(
    nro_cotizacion INT NOT NULL,
    id_producto INT NOT NULL,

    cantidad INT NOT NULL,
    precio_final DECIMAL (10, 2) NOT NULL,

    PRIMARY KEY (nro_cotizacion, id_producto),

    FOREIGN KEY (nro_cotizacion) REFERENCES Cotizaciones(nro_cotizacion),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

CREATE TABLE Imagenes(
    path VARCHAR(256) NOT NULL,

    id_producto INT NOT NULL,
    nro_imagen INT NOT NULL,
    comentarios VARCHAR(512) DEFAULT "",

    PRIMARY KEY (id_producto, nro_imagen),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

INSERT INTO Departamentos(nombre, telefono) VALUES
    ("GERENCIA GENERAL", "1234"),
    ("VENTAS Y DESAROLLO", "2345"),
    ("MARKETING", "3456"),
    ("LOGÍSTICA", "4567"),
    ("ADMISTRACION Y FINANZAS", "5678"),
    ("COMPRAS", "6789");

INSERT INTO Cargos (nombre, id_depto, nivel) VALUES 
    ("Gerente General", 1, 1),
    ("Gerente Administrativo", 5, 2),
    ("Coordinador de Ventas y Desarollo", 2, 3),
    ("Representante Técnico Comercial", 2, 3),  
    ("Asistente Técnico Comercial", 2, 3),
    ("Asistente de Gerencia", 1, 3),
    ("Asistente de Despacho", 4, 3), 
    ("Encargado de Marketing", 3, 3),
    ("Encargado de Logística", 4, 3),
    ("Encargado de compras", 6, 3);

INSERT INTO LineasNegocio(nombre, image) VALUES
    ("Turbas", "TURBAS.jpeg"),
    ("Semillas", "SEMILLAS.png"),
    ("Bandejas", "BANDEJAS.jpg"),
    ("Maquinarias", "MAQUINARIA.png"),
    ("Trampas", "TRAMPAS.jpg"),
    ("Productos Eco", "PRODUCTOS_ECO.jpg"),
    ("Entutorado", "ENTUTORADO.png"),
    ("Otros", "OTROS.jpg");

/* La contraseña es: invitado*/
INSERT INTO Personas(cedula, password, cod_zona, cod_cargo, nombre, correo, telefono, direccion, rol) VALUES
("invitado", "$2b$10$oGz/OOPpk8iuM/TN3Lptp.Lrmfs6..4SUjSJ7xmblpyX5WemPOHPK", 1, NULL, "invitado", "", NULL, "", "invitado");

INSERT INTO Personas(cedula, password, cod_zona, cod_cargo, nombre, correo, telefono, direccion, rol) VALUES
("admin", "$2b$10$JoR3.ISiE2QcEBN8VEmFA.QAeeInV/pxcFiHQhjykdfYxWzIzP9AS", 1, NULL, "admin", "", NULL, "", "admin");
