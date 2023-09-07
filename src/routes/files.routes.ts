import express from "express"
import { auth, check_rol } from '../middlewares/auth';
import { roles } from '../schemas/persona.schema';
import path from "path";

export const fileRouter = express.Router();

// !TODO: Para los distintos archivos tener distintos roles
//        Por ejemplo el colaborador no puede ver las imagenes de la linea de negocios

//Servir archivos estaticos
fileRouter.use('/', /*auth,*/ express.static(path.join(__dirname, '../../files')));
