import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';

import cors from 'cors';
import "express-async-errors"; //permitir errores en funciones asyncronas
import {handle_errors} from './errors';
import {join} from "path"; //Crear path para los archivos estaticos

import {chat} from "./chat";

export const app = express();
const server = createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const back_port: number = Number(process.env.BACK_PORT) || 3000; // Puerto interno del docker donde se levanta el server
const public_port: number = Number(process.env.BACK_PUBLIC_PORT) || 80; //Puerto que tiene acceso al mundo
const host = process.env.HOST ? process.env.HOST : "localhost";

//Ruta de la API donde se accede a los archivos estaticos
export const files_url  = `http://${host}:${public_port}/files` as const;
//Path donde se almacenan los archivos estaticos dentro del server
export const files_path = join(__dirname, "../files");

app.use((req, res, next) => {
    const message = `[server]: ${req.method} ${req.url}`;
    console.log(message);
    next();
});

//Necesesario para que no tire error de CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true,}));

//Servir los archivos estáticos, lo imoprtamos aca para que files_path funcione
import { fileRouter } from './routes/files.routes';
app.use('/files', fileRouter);

//Todas las rutas
import {router} from "./routes";
app.use(router);

//Conexion con el chat
io.on('connection', chat);

//Manejo de rutas de la API que no existen
app.use('*', (req, res) => res.status(404).json({
    success: false,
    error: "Esta ruta no hace nada negro"
}));

app.use(handle_errors);

server.listen(back_port, () => {
    console.log(`[server]: Server is running at http://${host}:${back_port}`);
});
