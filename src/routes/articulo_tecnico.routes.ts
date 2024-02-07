import {Router} from "express"
import articuloTecnicoController from "../controllers/articulos_tecnicos.controller";
import { auth, check_rol } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";
import { valid_param } from "../middlewares/validad_param";
import { articuloTecnicoUpload } from "../uploads/articulo_tecnico.upload";

const router = Router();

//Crear un articuloTecnico
router.post('/', auth, check_rol([roles.admin]), articuloTecnicoController.create);

//Cargar la imagen
router.put('/:id/image', 
    auth, 
    check_rol([roles.admin]), 
    articuloTecnicoUpload,
    valid_param("id"),
    articuloTecnicoController.create_image
);

//Actualizar
router.put('/:id',
    auth,
    check_rol([roles.admin]),
    valid_param("id"),
    articuloTecnicoController.update
);

//Eliminar
router.delete('/:id',
    auth,
    check_rol([roles.admin]),
    valid_param("id"),
    articuloTecnicoController.delet
);

//Listar todos
router.get('/', 
    auth, 
    check_rol([roles.admin, roles.cliente, roles.invitado]), 
    articuloTecnicoController.get_all
);

//Obtener un articuloTecnico
router.get('/:id', 
    auth, 
    check_rol([roles.admin, roles.cliente, roles.invitado]), 
    valid_param("id"), 
    articuloTecnicoController.get_one
);

export default router;
