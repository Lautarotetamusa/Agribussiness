CREATE TABLE IF NOT EXISTS ArticulosTecnicos(
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(128) NOT NULL,
    descripcion VARCHAR(1024),
    image VARCHAR(256) DEFAULT NULL,
    url VARCHAR(256) NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);
