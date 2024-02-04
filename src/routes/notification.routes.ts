import {Router} from "express"
import { broadcast_notification, direct_notification } from '../notifications';
import { createNotification, notificationTypeKeys } from '../schemas/notificacion.schema';

const router = Router();

router.post('/', async (req, res) => {
    const body = createNotification.parse(req.body);
    let notification;
    if (!('to' in req.body)){
        notification = await broadcast_notification(body);
    }else{
        const to = req.body.to;
        notification = await direct_notification(to, body);
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
