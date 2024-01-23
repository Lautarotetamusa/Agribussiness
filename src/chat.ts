import { Socket } from "socket.io";
import { create_message, get_chat, get_messages } from "./models/chat.model";
import { validationError } from "./errors";
import { io } from "./server";
import jwt, { Secret } from "jsonwebtoken";
import { Persona } from "./models/persona.model";
import { TokenData } from "./schemas/persona.schema";

// Objecto que guarda los usuarios conenctados en ese momento
let Users: Record<string, {chat_id: number, token: string} & TokenData> = {};

export function chat(socket: Socket) {
    //Token: token de la persona que inicia la conversacion
    //cedula: cedula de la persona con la que quiere hablar
    socket.on('join', async (data: {token: string, cedula: string}) => {
        let sender: TokenData;
        
        try{
            sender = jwt.verify(data.token, process.env.JWT_SECRET as Secret) as TokenData;
        }catch(err: any){
            socket.emit("error", validationError("El token pasado es incorrecto "+err.message));
            socket.disconnect();
            return;
        }
        if (sender.cedula == data.cedula){
            socket.emit("error", validationError("No se puede hacer un chat con vos mismo"));
            socket.disconnect();
            return;
        }

        const chat_id = await get_chat(sender.cedula, data.cedula)
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
            token: data.token,
            ...sender
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
        console.log("Users: ", Users);
        await create_message(Users[socket.id].chat_id, Users[socket.id].cedula, message);

        if (socket.id in Users){
            const user = Users[socket.id];
            io.to(user.chat_id.toString()).emit('message', {sender: user.cedula, message: message});
        }else{
            socket.emit("error", validationError("No estás conectado a esta sala, para conectarse socket.emit('join', {chat_id, token})"));
        }
    });
}
