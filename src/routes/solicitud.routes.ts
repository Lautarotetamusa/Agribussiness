import {Router} from "express"
import solicitudController from "../controllers/solicitud.controller";
import { auth, check_rol } from "../middlewares/auth";
import { valid_param } from "../middlewares/validad_param";
import { roles } from "../schemas/persona.schema";

const router = Router();

//Enviar una solicitud a otro colaborador. el colaborador que la recibe debe ser un gerente
router.post('/',
	auth,
	check_rol([roles.colaborador]),
	solicitudController.create
);

//Obtener absolutamente todas las solicitudes, para obtener las solicitudes de un solo colaborador está dentro de persona.routes
router.get('/',
	auth,
	check_rol([roles.admin]),
	solicitudController.get_all
);

//Obtener una solicitud
router.get('/:cod_solicitud',
	auth,
	check_rol([roles.admin, roles.colaborador]),
	valid_param("cod_solicitud"),
	solicitudController.get_one
);

//Aceptar una solicitud. Solo la persona que recibio la solicitud puede aprobarla
router.post('/:cod_solicitud/aceptar',
	auth,
	check_rol([roles.colaborador]),
	valid_param("cod_solicitud"),
	solicitudController.aceptar
);

export default router;
