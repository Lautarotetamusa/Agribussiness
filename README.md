# Agribussiness

# [Api references](https://cronos-software.stoplight.io/docs/agribussiness/branches/main/pgbrbcgazs2m9-agribussiness-api-rest)

# Instalacion

## Instalar docker

Instalar Docker 

* [Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
* [Windows](https://docs.docker.com/desktop/install/windows-install/)

Agregar docker a sudo (linux)
`sudo usermod -aG docker $USER`

Levantar el servicio de docker (linux)
`sudo systemctl start docker`

## Buildear el proyecto

`git clone https://github.com/Lautarotetamusa/Agribussiness.git`

`cd Agribussiness/`

Agregar archivo .env

`touch .env`

copiar lo siguiente dentro de .env y guardar:

```properties
HOST=localhost

DB_HOST=mysqldb
DB_USER=user
DB_PASS=password
DB_PORT=3306
DB_NAME=Agribussiness

BACK_PORT=3000
BACK_PUBLIC_PORT=80

JWT_SECRET=super_secret_jwt_token
JWT_EXPIRES_IN=60d
```

podes hacer `cat .env` y verificar que el contenido de .env sea el mismo que arriba

Buildear los contenedores
`docker compose build`

Levantar el proyecto
`docker compose up`

listo 👍👍

Si queres parar el proyecto: `docker compose stop`

Si queres levantarlo en segundo plano: `docker compose up -d`

# Requerimientos del sistema

Existen dos tipos de usuarios, colaboradores y clientes. Además hay un administrador, que es como un colaborador pero con funciones especiales. Los colaboradores son las personas que trabajan para la empresa. Los clientes son los clientes de la empresa.

**Colaborador**

De los colaboradores se conoce, nombre y apellido, cédula, correo, celular, cargo que ocupa y zona a la que pertenece, contraseña, dirección. Un colaborador puede generar una solicitud que se la envía a otro colaborador (su superior). De esta solicitud se conoce, de quién es y quien la recibe, fecha, y un texto con la solicitud. Luego la solicitud podrá ser aceptada o denegada por el superior. El colaborador podrá en todo momento consultar el estado de las solicitudes enviadas y recibirá una notificación cuando el estado de alguna solicitud que haya creado cambie.

Un colaborador puede generar una cotización y descargarla en formato pdf. De las cotizaciones se conoce, fecha, número de cotización, total, y una lista de productos cotizados con precio, cantidad y precio unitario. El colaborador puede ver una lista de todos las cotizaciones que realizó. Al crear una cotización estará en estado “creada”, el colaborador que la creó deberá poder cambiar a estado “aprobada” cuando sea necesario.
Se debe mostrar una lista de fichas técnicas y permitir descargar cada una, cada ficha técnica es un archivo que detalla un producto específico.
Lista de precios: una lista de archivos donde cada uno es una lista de precios separados por tipo de productos.

**Cliente**
Ven una lista de eventos, de cada evento se conoce un título y una descripción del evento. además cuando se crea un nuevo evento se envía una notificación.

En el directorio se listan los diferentes departamentos mostrando el nombre y el número de teléfono asignado.
Ofertas y promociones: se muestra una lista de las promociones cargadas, para cada promoción se debe poder abrir un chat con un colaborador que trabaja en la misma zona en la que está la promoción.

Los productos se cargan desde una lista de precios en formato .csv, de los productos se conoce nombre precio presentación y descripción.

**Administrador**

El administrador es como un colaborador pero con permisos especiales, además de todas las funciones antes mencionadas debe poder:
Actualizar y eliminar archivos de la lista de precios.

Actualizar y eliminar fichas técnicas.

Crear y eliminar eventos.
Crear ofertas y promociones.

* Las zonas están registradas previamente, un colaborador solo puede pertenecer a una zona.
* Para cada cliente se conocen los mismos datos que para el colaborador menos el cargo.
* Las cotizaciones están numeradas secuencialmente.
* Los departamentos ya están cargados previamente, se conoce nombre y un número de teléfono. Un colaborador pertenece a un solo departamento.
* De Ofertas y Promociones se conoce, fecha expiración, descripción promoción, y zona en la que se encuentra.
* El chat permite el envío de texto entre colaborador y cliente.
