/* La contraseña es: invitado*/
start transaction;
ALTER TABLE Personas
    MODIFY COLUMN rol ENUM("admin", "cliente", "colaborador", "invitado") NOT NULL;

INSERT INTO Personas(cedula, password, cod_zona, cod_cargo, nombre, correo, telefono, direccion, rol) VALUES
("invitado", "$2b$10$oGz/OOPpk8iuM/TN3Lptp.Lrmfs6..4SUjSJ7xmblpyX5WemPOHPK", 1, NULL, "invitado", "", NULL, "", "invitado")
commit;
