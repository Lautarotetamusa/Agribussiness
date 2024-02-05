import {Router} from "express"
import chatController from "../controllers/chat.controller";
import { auth, check_rol } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";
import { valid_param } from "../middlewares/validad_param";

const router = Router();

router.get('/',
    auth,
    check_rol([roles.admin]),
    chatController.get_all
);

router.get('/:id', 
    auth, 
    check_rol([roles.admin]), 
    valid_param("id"), 
    chatController.get_one
);

export default router;
