import {Router} from "express"
import { broadcastNotification, directNotification } from '../notifications';
import { createNotification, notificationTypeKeys } from '../schemas/notificacion.schema';

const router = Router();

router.post('/', async (req, res) => {
    const body = createNotification.parse(req.body);
    let notification;
    if (!('to' in req.body)){
        notification = await broadcastNotification(body);
    }else{
        const to = req.body.to;
        notification = await directNotification(to, body);
    }

    return res.status(200).json({
        success: true,
        message: "Notificacion enviada con exito",
        data: notification
    });
});

router.get('/topics', (req, res) => {
    return res.status(200).json(notificationTypeKeys);
});

export default router;
