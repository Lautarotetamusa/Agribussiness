import express from "express"
import { auth, check_rol } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";
import { files_path } from "../server";

export const fileRouter = express.Router();

const filesPermissions = {
    'cotizaciones': [roles.cliente, roles.admin],
    'eventos': [roles.colaborador, roles.admin],
    'fichas_tecnicas': [roles.cliente, roles.colaborador, roles.admin],
    'imagenes': [roles.cliente, roles.colaborador, roles.admin],
    'lineas_negocio': [roles.cliente, roles.admin],
    'articulos_tecnicos': [roles.cliente, roles.admin],
    'price_lists': [roles.admin],
    'proveedores': [roles.admin],
};

fileRouter.use(`/`,
    express.static(`${files_path}/`)
);

/*
for (const folder in filesPermissions){
    fileRouter.use(`/${folder}`,
        auth,
        check_rol(filesPermissions[folder as keyof typeof filesPermissions]),
        express.static(`${files_path}/${folder}`)
    );
}
*/
