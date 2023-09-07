CREATE TABLE LineasNegocio(
    id_linea INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(128) NOT NULL,
    image VARCHAR(256) NOT NULL,

    PRIMARY KEY (id_linea)
);


INSERT INTO LineasNegocio(nombre, image) VALUES
    ("Turbas", "TURBAS.jpeg"),
    ("Semillas", "SEMILLAS.png"),
    ("Bandejas", "BANDEJAS.jpg"),
    ("Maquinarias", "MAQUINARIA.png"),
    ("Trampas", "TRAMPAS.jpg"),
    ("Productos Eco", "PRODUCTOS_ECO.jpg"),
    ("Entutorado", "ENTUTORADO.png"),
    ("Otros", "OTROS.jpg");

ALTER TABLE Proveedores ADD COLUMN id_linea INT DEFAULT 1;
ALTER TABLE Proveedores ADD CONSTRAINT FOREIGN KEY (id_linea) REFERENCES LineasNegocio;
ALTER TABLE Proveedores MODIFY COLUMN id_linea INT NOT NULL;