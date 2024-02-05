import { Request, Response } from "express";
import * as Chat from "../models/chat.model";
import { notFound } from "../errors";

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const chats = await Chat.get_all();

    return res.status(200).json({
        success: true,
        data: chats
    })
}

const get_one = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(res.locals.id);
    const chat = await Chat.get_one(res.locals.id);
    const messages = await Chat.get_messages(id);

    return res.status(200).json({
        success: true,
        data: {
            ...chat,
            messages: messages
        }
    });
}

const init_chat = async (req: Request, res: Response): Promise<Response> => {
    const cedula: string = res.locals.user.cedula;
    const user = await Chat.init_chat(cedula, "test");
    if (user == undefined){
        return res.status(404).json(notFound("No hay ningun colaborador disponible en tu zona"));
    }

    return res.status(200).json({
        success: true,
        data: user
    });
}

export default {
    get_one,
    get_all,
    init_chat
}
