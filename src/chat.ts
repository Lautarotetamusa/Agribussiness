import { validationError} from "./errors";
import jwt, { Secret } from "jsonwebtoken";

import {Router} from "express";
import { create_message, get_chat, get_messages } from "./models/chat.model";
import { express_ws } from "./server";
const router = Router();

//WebSockets
//const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
router.ws('/messages/:cedula', async (ws, req) => {
    //Primero necesitamos el token de la persona que envia el mensaje
    if (!("token" in req.query)){
        ws.send(JSON.stringify(validationError("Se necesita pasar un token como parametro /messages/{cedula}?token={token}")));
        ws.close();
        return;
    }

    let sender = "";
    try{
        const decoded = jwt.verify(String(req.query.token), process.env.JWT_SECRET as Secret);
        sender = (decoded as any).cedula;
    }catch(err: any){
        console.log("ERROR: ", err);
        ws.send(JSON.stringify(validationError("El token pasado es incorrecto "+err.message)));
        ws.close();
        return;
    }
    console.log("SENDER: ", sender);

    const chat_id = await get_chat(sender, req.params.cedula)
    if (typeof chat_id !== "number"){
        ws.send(JSON.stringify(chat_id));
        ws.close();
        return;
    }

    const messages = await get_messages(chat_id);
    ws.send(JSON.stringify({
        success: true,
        data: messages
    }));
    console.log("clients:", express_ws.getWss().clients);

    ws.on('message', async (msg: string) => {
        console.log("nuevo mensaje: ", msg);
        const id = await create_message(chat_id, sender, msg);
    });
});

export default router;
