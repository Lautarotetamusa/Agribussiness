import {Router} from "express"
import cotizacionController from "../controllers/cotizacion.controller";
import { auth, check_rol } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";
import { valid_param } from "../middlewares/validad_param";

const router = Router();

router.post('/', auth, check_rol([roles.colaborador]), cotizacionController.create);

router.get('/', auth, check_rol([roles.admin]), cotizacionController.get_all);

router.get('/:nro_cotizacion',
    auth,
    check_rol([roles.admin, roles.colaborador]),
    valid_param("nro_cotizacion"),
    cotizacionController.get_one
);

export default router;
