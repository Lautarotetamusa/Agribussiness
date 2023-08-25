import express from "express"
import promoController from "../controllers/promocion.controller";
import { auth, check_rol } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";

const router = express.Router();

router.post('/', auth, check_rol([roles.admin]), promoController.create);

router.get('/', auth, check_rol([roles.cliente]), promoController.get_all);

router.get('/:id', auth, check_rol([roles.cliente]), promoController.get_one);

export default router;