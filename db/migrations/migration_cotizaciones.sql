CREATE TABLE IF NOT EXISTS Cotizaciones(
    nro_cotizacion INT NOT NULL AUTO_INCREMENT,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM("aprobada", "creada") NOT NULL DEFAULT "creada",
    colaborador CHAR(10) NOT NULL,
    cliente CHAR(10) NOT NULL,
    disposiciones VARCHAR(2048) NOT NULL,
    file VARCHAR(256) NOT NULL,

    forma_pago ENUM("Contado", "Credito 15", "Credito 30", "Credito 45") NOT NULL DEFAULT "Contado",
    tiempo_entrega TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (nro_cotizacion),
    FOREIGN KEY (colaborador) REFERENCES Personas(cedula),
    FOREIGN KEY (cliente) REFERENCES Personas(cedula)
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