CREATE TABLE Imagenes(
    path VARCHAR(256) NOT NULL,

    id_producto INT NOT NULL,
    nro_imagen INT NOT NULL,

    PRIMARY KEY (id_producto, nro_imagen),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);