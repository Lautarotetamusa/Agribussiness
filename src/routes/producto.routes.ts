import express from "express"
import productoController from "../controllers/producto.controller";
import { auth, check_rol } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";
import { uploadPriceListFile } from "../util/upload_file";

const router = express.Router();

router.post('/', auth, check_rol([roles.admin]), productoController.create);

router.post('/list', 
    auth, 
    check_rol([roles.admin]), 
    uploadPriceListFile, 
    productoController.file_insert
);

router.get('/', auth, check_rol([roles.admin]), productoController.get_all);

router.put('/:id', auth, check_rol([roles.admin]), productoController.update);

export default router;