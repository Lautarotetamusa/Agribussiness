import {Router} from "express"
import personaController from "../controllers/persona.controller";
import { auth, check_rol, list_personas, self_or_admin } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";
const router = Router();

router.post('/', personaController.create);

router.post('/login', personaController.login);

router.get('/', 
    auth, 
    list_personas,
    personaController.get_all
);

//Obtener todos los colaboradores a los que puede enviar una solicitud
router.get('/:cedula/solicitables', 
    auth, 
    check_rol([roles.colaborador, roles.admin]), 
    self_or_admin, 
    personaController.get_solicitables
);

//Obtener todas las solicitudes de esta persona
router.get('/:cedula/solicitud', 
    auth, 
    check_rol([roles.colaborador, roles.admin]), 
    self_or_admin, 
    personaController.get_solicitudes
);

//Obtener todas las cotizaciones de esa persona
//Si es colaborador, serán las solicitudes que envió
//Si es cliente, serán las que recibió
router.get('/:cedula/cotizacion', 
    auth, 
    check_rol([roles.colaborador, roles.cliente]), 
    self_or_admin, 
    personaController.get_cotizaciones
);

router.get('/:cedula', auth, self_or_admin, personaController.get_one);

router.put('/:cedula', auth, self_or_admin, personaController.update);

router.delete('/:cedula', auth, self_or_admin, personaController.delet);

export default router;
