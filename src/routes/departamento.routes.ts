import express from "express"
import deptoController from "../controllers/departamentos.controller";
import { auth, check_rol } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";

const router = express.Router();

router.get('/', auth, check_rol([roles.cliente]), deptoController.get_all);

router.get('/:id', auth, check_rol([roles.cliente]), deptoController.get_one);

export default router;