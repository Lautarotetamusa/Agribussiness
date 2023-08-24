import express from "express"
import personaController from "../controllers/persona.controller";
import { auth, check_rol } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";
const router = express.Router();

router.get('/', auth, check_rol([roles.admin]), personaController.get_all);

router.post('/', personaController.create);

router.post('/login', personaController.login);

router.get('/:cedula', auth, personaController.user_info);

router.put('/:cedula', auth, personaController.update);

router.delete('/:cedula', auth, personaController.delet);

export default router;