import {Router} from "express"
import productoController from "../controllers/producto.controller";
import { auth, check_rol } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";
import { uploadFichaTecnicaFile, uploadPriceListFile } from "../util/upload_file";
import { valid_param } from "../middlewares/validad_param";
import { uploadImagenProducto } from "../uploads/producto.upload";

const router = Router();

router.post('/', auth, check_rol([roles.admin]), productoController.create);

router.post('/list', 
    auth, 
    check_rol([roles.admin]), 
    uploadPriceListFile, 
    productoController.file_insert
);

router.get('/', auth, check_rol([roles.admin]), productoController.get_all);

router.get('/:id', 
    auth, 
    check_rol([roles.admin]), 
    valid_param("id"), 
    productoController.get_one
);

router.put('/:id', 
    auth, 
    check_rol([roles.admin]), 
    valid_param("id"),
    productoController.update
);

router.put('/:id/ficha', 
    auth, 
    check_rol([roles.admin]),
    uploadFichaTecnicaFile,
    valid_param("id"),
    productoController.create_ficha_tecnica
);

router.post('/:id/imagen',
    auth,
    check_rol([roles.admin]),
    uploadImagenProducto,
    valid_param("id"),
    productoController.create_imagen(false)
);

router.post('/:id/portada',
    auth,
    check_rol([roles.admin]),
    uploadImagenProducto,
    valid_param("id"),
    productoController.create_imagen(true)
);

router.get('/:id/imagen',
    auth,
    check_rol([roles.admin, roles.colaborador]),
    valid_param("id"),
    productoController.get_images
);

export default router;