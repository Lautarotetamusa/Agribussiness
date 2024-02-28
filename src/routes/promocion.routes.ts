import {Router} from "express"
import promoController from "../controllers/__promocion.controller";
import { auth, check_rol } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";
import { valid_param } from "../middlewares/validad_param";

const router = Router();

router.post('/', auth, check_rol([roles.admin]), promoController.create);

router.put('/:id', 
    auth, 
    check_rol([roles.admin]), 
    valid_param("id"), 
    promoController.update
);

router.get('/', auth, check_rol([roles.cliente]), promoController.get_all);

router.get('/:id', 
    auth, 
    check_rol([roles.cliente]), 
    valid_param("id"), 
    promoController.get_one
);

export default router;
