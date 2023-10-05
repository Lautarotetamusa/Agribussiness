ALTER TABLE Cargos ADD COLUMN nivel INT(2) NOT NULL;
UPDATE Cargos SET nivel = 3;
UPDATE Cargos SET nivel = 1 WHERE nombre = "Gerente General";
UPDATE Cargos SET nivel = 2 WHERE nombre = "Gerente Administrativo";