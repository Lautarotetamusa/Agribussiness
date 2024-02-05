/*
    Deberemos obtener un colaborador con cargo "Representante Técnico Comercial"
    en la misma zona del cliente
*/
/* get(cedula) */
WITH Cliente as (
    SELECT cedula, cod_zona
    FROM Personas
    WHERE cedula = "204349197"
)
SELECT P.cedula, P.nombre, rol
FROM Personas P
INNER JOIN Cargos Ca
    ON P.cod_cargo = Ca.cod_cargo
INNER JOIN Cliente C
    ON P.cod_zona = C.cod_zona 
    AND rol = "colaborador"
WHERE Ca.nombre LIKE "Representante Técnico Comercial" 
