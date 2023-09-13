import {Router} from "express"
import personaController from "../controllers/persona.controller";
import { auth, check_rol, self_or_admin } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";
const router = Router();

router.post('/', personaController.create);

router.post('/login', personaController.login);

router.get('/', auth, check_rol([roles.admin]), personaController.get_all);

//Obtener todas las solicitudes de esta persona
router.get('/:cedula/solicitud', 
    auth, 
    check_rol([roles.colaborador, roles.admin]), 
    self_or_admin, 
    personaController.get_solicitudes
);

router.get('/:cedula', auth, self_or_admin, personaController.get_one);

router.put('/:cedula', auth, self_or_admin, personaController.update);

router.delete('/:cedula', auth, self_or_admin, personaController.delet);

export default router;