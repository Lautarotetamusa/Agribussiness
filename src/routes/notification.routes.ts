import {Router} from "express"
import { broadcastNotification, directNotification } from '../notifications';

const router = Router();

router.post('/', async (req, res) => {
    /*if ('to' in req.body){
        broadcastNotification(['admin'], {
            title: "Agribussiness",
            body: "hola amigos"
        });
    }else{
        directNotification([], {
            title: "Agribussiness",
            body: "direct notification"
        })
    }*/
    return res.status(200).json({
        success: true,
        message: "Notificacion enviada con exito",
    });
});

export default router;
