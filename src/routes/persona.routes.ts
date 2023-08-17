import express, {Request, Response} from "express"
import personaController from "../controllers/persona.controller";
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    return res.send("Bienvenido usuario");
});

router.post('/', personaController.create);

export default router;