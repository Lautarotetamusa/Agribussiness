import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import "express-async-errors"; //permitir errores en funciones asyncronas
import {ApiError} from './errors';

import PersonaRouter from "./routes/persona.routes";
import ProductoRouter from "./routes/producto.routes";
import { ZodError } from 'zod';
import { MulterError } from 'multer';

export const app = express();

const port: number = Number(process.env.BACK_PORT) | 3000;
const host = process.env.HOST ? process.env.HOST : "localhost";

//Necesesario para que no tire error de CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true,}));

app.use('/persona/', PersonaRouter);
app.use('/producto/', ProductoRouter);

app.use('*', (req, res) => res.status(404).json({
    success: false,
    error: "Esta ruta no hace nada negro"
}));

app.use((err: Error, req: Request, res:Response, next: NextFunction) => {
    console.log("ERROR: ");
    console.log("message: ", err.message);
    console.log("stack: ", err.stack);
    
    if (err instanceof ZodError){
        let json_err: Array<object> = JSON.parse(err.message);

        return res.status(400).json({
            success: false,
            errors: json_err
        })
    } 

    if (err instanceof ApiError) return res.status(err.status).json({
        success: false,
        errors: [{
            code: err.name,
            message: err.message
        }]
    })

    if (err instanceof MulterError){
        return res.status(400).json({
            success: false,
            errors: [{
                code: err.name,
                message: `Unexpected field '${err.field}', expected 'file'`
            }]
        })
    }
        
    return res.status(500).json({
        success: false,
        errors: [{
            code: err.name,
            message: err.message
        }]
    })
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://${host}:${port}`);
});