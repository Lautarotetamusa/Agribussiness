CREATE TABLE Dispositivos(
    token CHAR(50) NOT NULL ,
    cedula CHAR(10) NOT NULL,
    
    PRIMARY KEY (token, cedula),
    FOREIGN KEY (cedula) REFERENCES Personas(cedula)
);

ALTER TABLE Dispositivos
    DROP PRIMARY KEY,
    ADD PRIMARY KEY(token, cedula);
