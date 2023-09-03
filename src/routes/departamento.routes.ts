import express from "express"
import deptoController from "../controllers/departamentos.controller";
import { auth, check_rol } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";
import { valid_param } from "../middlewares/validad_param";

const router = express.Router();

router.get('/', auth, check_rol([roles.cliente, roles.admin]), deptoController.get_all);

router.get('/:id', auth, check_rol([roles.cliente, roles.admin]), valid_param("id"), deptoController.get_one);

export default router;