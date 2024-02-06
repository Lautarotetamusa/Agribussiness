import {Router} from "express"
import LineaNegocioController from "../controllers/linea_negocio.controller";
import { valid_param } from "../middlewares/validad_param";
import { auth, check_rol } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";

const router = Router();

router.get('/',
	auth,
	check_rol([roles.cliente,
	roles.admin]),
	LineaNegocioController.get_all
);

router.get('/:id',
	auth,
	check_rol([roles.cliente,
	roles.admin]),
	valid_param("id"),
	LineaNegocioController.get_one
);

export default router;
