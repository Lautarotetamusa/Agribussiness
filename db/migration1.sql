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