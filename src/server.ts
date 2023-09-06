import express from 'express';
import cors from 'cors';
import "express-async-errors"; //permitir errores en funciones asyncronas
import {handle_errors} from './errors';

//Routers
import PersonaRouter from "./routes/persona.routes";
import ProductoRouter from "./routes/producto.routes";
import DeptoRouter from "./routes/departamento.routes";
import CargoRouter from "./routes/cargo.routes";
import PromocionRouter from "./routes/promocion.routes";
import ProveedorRouter from "./routes/proveedor.routes";
import { fileRouter } from './routes/files.routes';

export const app = express();

const port: number = Number(process.env.BACK_PORT) | 3000;
const host = process.env.HOST ? process.env.HOST : "localhost";

//Necesesario para que no tire error de CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true,}));

//Servir los archivos estáticos
app.use('/files', fileRouter);

app.use('/persona/', PersonaRouter);
app.use('/producto/', ProductoRouter);
app.use('/departamento/', DeptoRouter);
app.use('/promocion/', PromocionRouter);
app.use('/proveedor/', ProveedorRouter);
app.use('/cargo', CargoRouter);

//Manejo de rutas de la API que no existen
app.use('*', (req, res) => res.status(404).json({
    success: false,
    error: "Esta ruta no hace nada negro"
}));

app.use(handle_errors);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://${host}:${port}`);
});