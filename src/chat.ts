import { Socket } from "socket.io";
import { create_message, get_chat, get_messages } from "./models/chat.model";
import { validationError } from "./errors";
import { io } from "./server";
import jwt, { Secret } from "jsonwebtoken";
import { TokenData } from "./schemas/persona.schema";
import { directNotification } from "./notifications";

// Objecto que guarda los usuarios conenctados en ese momento
let Users: Record<string, {chat_id: number, cedula: string, nombre: string, reciver: string}> = {};

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
        console.log(sender, "conected");

        const chat_id = await get_chat(sender.cedula, data.cedula)
        if (typeof chat_id !== "number"){
            socket.emit("error", chat_id);
            socket.disconnect();
            return;
        }
        socket.join(String(chat_id));

        //Agregemos el usuario que se acaba de conectar a la lista de usuarios
        Users[socket.id] = {
            chat_id: chat_id,
            cedula: sender.cedula,
            nombre: sender.nombre,
            reciver: data.cedula,
        };

        const messages = await get_messages(chat_id);
        socket.emit("firstMessages", {
            success: true,
            data: messages
        });
    });

    socket.on('message', async (message: string) => {
        if (!(socket.id in Users)){
            socket.emit("error", validationError("No estás conectado a esta sala, para conectarse socket.emit('join', {chat_id, token})"));
            return;
        }
        const user = Users[socket.id];

        await create_message(user.chat_id, user.cedula, message);

        //Enviamos una notificacion a la persona que recive el mensaje 
        await directNotification(user.reciver, {
            message: `Tienes un nuevo mensaje de ${user.nombre}: ${message}`,
            type: "message:new"
        });

        //Enviamos un mensaje a todos los usuarios coneectados a este chat
        io.to(user.chat_id.toString()).emit('message', {sender: user.cedula, message: message});
    });
}
