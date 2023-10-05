import express from 'express';
import cors from 'cors';
import "express-async-errors"; //permitir errores en funciones asyncronas
import {handle_errors} from './errors';
import {join} from "path"; //Crear path para los archivos estaticos

import { fileRouter } from './routes/files.routes';
import {router} from "./routes";

/*export const app = express();*/
import expressWs from "express-ws";
import { Persona } from './models/persona.model';
//let WebSocket = expressWs(app);
export const app = expressWs(express()).app;
//const expressWs = require('express-ws')(app);

const back_port: number = Number(process.env.BACK_PORT) | 3000; // Puerto interno del docker donde se levanta el server
const public_port: number = Number(process.env.BACK_PUBLIC_PORT) | 80; //Puerto que tiene acceso al mundo
const host = process.env.HOST ? process.env.HOST : "localhost";

//Ruta de la API donde se accede a los archivos estaticos
export const files_url  = `http://${host}:${public_port}/files` as const;
//Path donde se almacenan los archivos estaticos dentro del server
export const files_path = join(__dirname, "../files");

//Necesesario para que no tire error de CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true,}));

//Servir los archivos estáticos
app.use('/files', fileRouter);

app.use(router);

//WebSockets
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
app.ws('/messages', async (ws, req) => {
    ws.on('message', async (msg) => {
        console.log("nuevo mensaje: ", msg);
        const personas = await Persona.get_all();
        await delay(2000);
        ws.send(JSON.stringify(personas))
    })
})

//Manejo de rutas de la API que no existen
app.use('*', (req, res) => res.status(404).json({
    success: false,
    error: "Esta ruta no hace nada negro"
}));

app.use(handle_errors);

app.listen(back_port, () => {
    console.log(`[server]: Server is running at http://${host}:${back_port}`);
});