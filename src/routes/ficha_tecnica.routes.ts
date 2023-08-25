import express from "express"
import fichaTecnicaController from "../controllers/ficha_tecnica.controller";
import { auth, check_rol } from "../middlewares/auth";
import {roles} from "../schemas/persona.schema";
import { uploadFichaTecnicaFile } from "../util/upload_file";

const router = express.Router();

router.get('/', auth, check_rol([
    roles.admin,
    roles.colaborador
]), fichaTecnicaController.get_all);

router.post('/', 
    auth, 
    check_rol([roles.admin]),
    uploadFichaTecnicaFile,
    fichaTecnicaController.create
);

export default router;