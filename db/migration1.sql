ALTER TABLE Personas
ADD COLUMN nuevo_rol ENUM("admin", "cliente", "colaborador");

UPDATE Personas SET nuevo_rol = 'admin' 
WHERE rol=0;
UPDATE Personas SET nuevo_rol = 'cliente' 
WHERE rol=1;
UPDATE Personas SET nuevo_rol = 'colaborador' 
WHERE rol=2;

ALTER TABLE Personas
DROP COLUMN rol;

ALTER TABLE Personas CHANGE nuevo_rol rol ENUM("admin", "cliente", "colaborador") NOT NULL;

ALTER TABLE Productos ADD COLUMN ficha_tecnica VARCHAR(256) DEFAULT NULL;

-- DROP TABLE FichaTecnica;

ALTER TABLE Personas MODIFY id_depto INT;
ALTER TABLE Personas MODIFY cod_zona INT;

CREATE TABLE Promociones(
    id_promo INT NOT NULL AUTO_INCREMENT,
    cod_zona INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    fecha_expiracion DATE NOT NULL,
    descripcion VARCHAR(512) NOT NULL,

    PRIMARY KEY id_promo,
    FOREIGN KEY cod_zona REFERENCES Zonas(cod_zona)
);

CREATE TABLE Proveedores(
    id_proveedor INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(128) NOT NULL,
    photo_path VARCHAR(256),
    ficha_tecnica VARCHAR(256),

    PRIMARY KEY (id_proveedor)
);
INSERT INTO Proveedores SET
    nombre = "Monsanto";

ALTER TABLE Productos ADD COLUMN id_proveedor INT NOT NULL DEFAULT 1; 
ALTER TABLE Productos ADD FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor);
ALTER TABLE Productos MODIFY id_proveedor INT NOT NULL;

ALTER TABLE Proveedores CHANGE photo_path photo VARCHAR(256) NOT NULL;

UPDATE Personas SET cod_zona=1 WHERE cod_zona is NULL;
ALTER TABLE Personas MODIFY cod_zona INT NOT NULL;
ALTER TABLE Personas ADD CONSTRAINT FOREIGN KEY (cod_zona) REFERENCES Zonas(cod_zona);
