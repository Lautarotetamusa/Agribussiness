START TRANSACTION;

ALTER TABLE Cotizaciones
    ADD column cliente_nuevo VARCHAR(64) DEFAULT NULL,
    MODIFY column cliente CHAR(10) DEFAULT NULL,
    ADD constraint double_client_check CHECK(
        (cliente IS NOT NULL AND cliente_nuevo IS NULL) OR
        (cliente IS NULL AND cliente_nuevo IS NOT NULL)
    );
