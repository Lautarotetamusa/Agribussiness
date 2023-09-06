import express from "express"
import solicitudController from "../controllers/solicitud.controller";
import { auth, self_or_admin } from "../middlewares/auth";
import { valid_param } from "../middlewares/validad_param";

const router = express.Router();

router.post('/', auth, self_or_admin, solicitudController.create);

router.get('/', auth, self_or_admin, solicitudController.get_all);

router.get('/:cod_solicitud', auth, self_or_admin, valid_param("cod_solicitud"), solicitudController.get_one);

export default router;