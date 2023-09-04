-- Migrar personas tienen un cargo
-- Cada cargo esta en un depto
-- Los cargos y los deptos están predefinidos y cargados previamente

ALTER TABLE Personas DROP FOREIGN KEY Personas_ibfk_1;
ALTER TABLE Personas DROP COLUMN id_depto;


-- Agregar los departamentos correctos
DROP TABLE Departamentos;
CREATE TABLE Departamentos(
    id_depto INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL,
    telefono VARCHAR(15) NOT NULL,

    PRIMARY KEY (id_depto)
);
INSERT INTO Departamentos(nombre, telefono) VALUES
    ("GERENCIA GENERAL", "1234"),
    ("VENTAS Y DESAROLLO", "2345"),
    ("MARKETING", "3456"),
    ("LOGÍSTICA", "4567"),
    ("ADMISTRACION Y FINANZAS", "5678"),
    ("COMPRAS", "6789");


ALTER TABLE Cargos ADD COLUMN id_depto INT NOT NULL;
UPDATE Cargos SET id_depto = 1;
ALTER TABLE Cargos ADD CONSTRAINT FOREIGN KEY(id_depto) REFERENCES Departamentos(id_depto);

Departamentos
+----------+-------------------------+----------+
| id_depto | nombre                  | telefono |
+----------+-------------------------+----------+
|        1 | GERENCIA GENERAL        | 1234     |
|        2 | VENTAS Y DESAROLLO      | 2345     |
|        3 | MARKETING               | 3456     |
|        4 | LOGÍSTICA               | 4567     |
|        5 | ADMISTRACION Y FINANZAS | 5678     |
|        6 | COMPRAS                 | 6789     |
+----------+-------------------------+----------+

Cargos
+-----------+------------------------------------+----------+
| cod_cargo | nombre                             | id_depto | depto que va 
+-----------+------------------------------------+----------+
|         1 | Gerente General                    |        1 | -- 1
|         2 | Gerente Administrativo             |        1 | -- 5
|         3 | Coordinador de Ventas y Desarrollo |        1 | -- 2
|         4 | Representante Técnico Comercial    |        1 | -- 2
|         5 | Asistente Técnico Comercial        |        1 | -- 2
|         6 | Asistente de Gerencia              |        1 | -- 1
|         7 | Asistente de Despacho              |        1 | -- 4
|         8 | Encargado de Marketing             |        1 | -- 3
|         9 | Encargada de Logística             |        1 | -- 4
|        10 | Encargado de compras               |        1 | -- 6
+-----------+------------------------------------+----------+

GERENCIA GENERAL: Gerente y Asistente de Gerencia
VENTAS Y DESAROLLO: Coordinador de Ventas, Represente Técnico Comercial y Asistente Técnico Comercial
MARKETING: Encargada de Marketing 
LOGÍSTICA: Encargada de Logística y Asistente de Despacho 
ADMISTRACION Y FINANZAS : Gerente Admistrativa 
COMPRAS: Encargada de Compras 

UPDATE Cargos SET id_depto = 1 WHERE cod_cargo IN (1, 6);
UPDATE Cargos SET id_depto = 2 WHERE cod_cargo IN (3, 4, 5);
UPDATE Cargos SET id_depto = 3 WHERE cod_cargo IN (8);
UPDATE Cargos SET id_depto = 4 WHERE cod_cargo IN (7, 9);
UPDATE Cargos SET id_depto = 5 WHERE cod_cargo IN (2);
UPDATE Cargos SET id_depto = 6 WHERE cod_cargo IN (10);