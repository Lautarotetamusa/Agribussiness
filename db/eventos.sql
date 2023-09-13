CREATE TABLE Eventos(
    id_evento INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(128) NOT NULL,
    descripcion VARCHAR(1024),
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(256) DEFAULT NULL,

    PRIMARY KEY (id_evento)
);