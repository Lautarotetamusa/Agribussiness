import { Dispositivo } from "./models/dispositivo.model";
import { BroadCastNotification } from "./schemas/notificacion.schema";

const expoApi = "https://exp.host/--/api/v2/push/send";
const title = "Agribussiness";

type NotificationSchema = {
    title: string,
    body: string,
    to: string
};

async function pushNotification(payload: Array<NotificationSchema> | NotificationSchema){
    const res = await fetch(expoApi, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json();
    return data;
}

export function broadcastNotification(noti: BroadCastNotification){
    Dispositivo.getByRoles(noti.to).then((devices) => {
        const payload = devices.map(d => {return {
            title: title,
            body: noti.message,
            to: d.token
        }});
        pushNotification(payload).catch((err) => console.error("Error enviando la notificacion", err));
    }).catch((err) => console.error("No se pudo obtener los devices", err));
}

export function directNotification(args: Record<string, string>){
    const cedulas = Object.keys(args);

    Dispositivo.getByCedulas(cedulas).then((devices) => {
        const payload = devices.map(d => {return {
            title: title,
            body: args[d.cedula],
            to: d.token
        }});
        pushNotification(payload).catch((err) => console.error("Error enviando la notificacion", err));
    }).catch((err) => console.error("No se pudo obtener los devices", err));
}
