import { Socket } from "socket.io";
import { get_chat, get_messages } from "./models/chat.model";
import { validationError } from "./errors";
import { io } from "./server";
import jwt, { Secret } from "jsonwebtoken";
import { Persona } from "./models/persona.model";

// Objecto que guarda los usuarios conenctados en ese momento
let Users: Record<string, {chat_id: number, nombre: string, cedula: string}> = {};

export function chat(socket: Socket) {
    console.log("usuario conectado");
    socket.on('join', async (data: {token: string, cedula: string}) => {
        let sender = "";
        
        try{
            const decoded = jwt.verify(data.token, process.env.JWT_SECRET as Secret);
            sender = (decoded as any).cedula;
        }catch(err: any){
            socket.emit("error", validationError("El token pasado es incorrecto "+err.message));
            socket.disconnect();
            return;
        }
        if (sender == data.cedula){
            socket.emit("error", validationError("No se puede hacer un chat con vos mismo"));
            socket.disconnect();
            return;
        }
        const persona = await Persona.get_one(sender);
        const chat_id = await get_chat(sender, data.cedula)
        if (typeof chat_id !== "number"){
            socket.emit("error", chat_id);
            socket.disconnect();
            return;
        }

        console.log("JOIN", chat_id);
        console.log("socket_id: ", socket.id);
        socket.join(String(chat_id));

        //Agregemos el usuario que se acaba de conectar a la lista de usuarios
        Users[socket.id] = {
            chat_id: chat_id,
            nombre: persona.nombre,
            cedula: persona.cedula
        };

        const messages = await get_messages(chat_id);
        socket.emit("firstMessages", {
            success: true,
            data: messages
        });
    });

    socket.on('message', async (message: string) => {
        //Enviamos un mensaje a todos los usuarios coneectados a este chat
        console.log("nuevo mensaje", message);

        if (socket.id in Users){
            io.to(Users[socket.id].chat_id.toString()).emit('message', {sender: Users[socket.id].nombre, message: message});
        }else{
            socket.emit("error", validationError("No estás conectado a esta sala, para conectarse socket.emit('join', {chat_id, token})"));
        }
    });
}

//WebSockets
//const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
/*
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

    if (sender == req.params.cedula){
        ws.send(JSON.stringify(validationError("No se puede hacer un chat con vos mismo")))
        ws.close();
        return;
    }

    const chat_id = await get_chat(sender, req.params.cedula)
    if (typeof chat_id !== "number"){
        ws.send(JSON.stringify(chat_id));
        ws.close();
        return;
    }
    console.log(chat_id);

    const messages = await get_messages(chat_id);
    ws.send(JSON.stringify({
        success: true,
        data: messages
    }));

    //console.log("clients:", express_ws.getWss().clients.values());
    ws.on('message', async (msg: string) => {
        const parsed = JSON.parse(msg);
        console.log(parsed.chat_id, parsed.message);
        ws.emit(parsed.chat_id, parsed.message);
    });
});

export default router;
*/
