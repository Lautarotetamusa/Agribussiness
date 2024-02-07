import {Router} from "express"
import eventoController from "../controllers/evento.controller";
import { auth, check_rol } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";
import { valid_param } from "../middlewares/validad_param";
import { eventoUpload } from "../uploads/evento.upload";

const router = Router();

//Crear un evento
router.post('/', auth, check_rol([roles.admin]), eventoController.create);

//Cargar la imagen
router.put('/:id/image', 
    auth, 
    check_rol([roles.admin]), 
    eventoUpload,
    valid_param("id"),
    eventoController.create_image
);

//Actualizar
router.put('/:id',
    auth,
    check_rol([roles.admin]),
    valid_param("id"),
    eventoController.update
);

//Eliminar
router.delete('/:id',
    auth,
    check_rol([roles.admin]),
    valid_param("id"),
    eventoController.delet
);

//Listar todos
router.get('/', 
    auth, 
    check_rol([roles.admin, roles.invitado, roles.cliente]), 
    eventoController.get_all
);

//Obtener un evento
router.get('/:id', 
    auth, 
    check_rol([roles.admin, roles.invitado, roles.cliente]), 
    valid_param("id"), 
    eventoController.get_one
);

export default router;
