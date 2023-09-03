import express from "express"
import cargoController from "../controllers/cargo.controller";
import { auth, check_rol } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";
import { valid_param } from "../middlewares/validad_param";

const router = express.Router();

router.get('/', auth, check_rol([roles.admin]), cargoController.get_all);

router.get('/:id', auth, check_rol([roles.admin]), valid_param("id"), cargoController.get_one);

export default router;