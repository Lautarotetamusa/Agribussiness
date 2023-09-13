import {Router} from "express"
import proveedorController from "../controllers/proveedor.controller";
import { auth, check_rol } from "../middlewares/auth";
import { roles } from "../schemas/persona.schema";
import { proveedorUpload } from "../uploads/proveedor.upload";
import { valid_param } from "../middlewares/validad_param";

const router = Router();

router.use(auth);

router.post('/',
    check_rol([roles.admin]),
    proveedorUpload,
    proveedorController.create
);

router.get('/:id', 
    valid_param("id"), 
    check_rol([roles.admin, roles.colaborador]),
    proveedorController.get_one
);

router.get('/', 
    check_rol([roles.admin, roles.colaborador]),
    proveedorController.get_all
);

export default router;