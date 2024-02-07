import { Request, Response } from "express";
import {Evento} from "../models/evento.model";
import { createEvento, updateEvento } from "../schemas/evento.schema";
import { ValidationError } from "../errors";
import { broadcast_notification } from "../notifications";

const create = async (req: Request, res: Response): Promise<Response> => {
    const body = createEvento.parse(req.body);

    const evento = await Evento.create(body);

    await broadcast_notification({
        message: `Nuevo evento: ${evento.titulo}`,
        type: 'evento:new'
    });

    return res.status(201).json({
        success: true,
        message: "Evento creado correctamente",
        data: evento
    });
}

const create_image = async (req: Request, res: Response): Promise<Response> => {
    if (!req.file) throw new ValidationError("La imagen del evento no se subio correctamente");

    const evento = await Evento.get_one(res.locals.id);
    let _:void = await evento.update({image: req.file.filename});

    return res.status(201).json({
        success: true,
        message: "Imagen del evento subida correctamente",
        data: evento
    });
}

const update = async (req: Request, res: Response): Promise<Response> => {
    const body = updateEvento.parse(req.body);
    if (Object.keys(body).length <= 0) throw new ValidationError("Nada para actualizar");

    const evento = await Evento.get_one(res.locals.id);
    let _:void = await evento.update(body);

    await broadcast_notification({
        message: `Se actualizo un evento`,
        type: 'evento:update'
    });

    return res.status(201).json({
        success: true,
        message: "Evento actualizado correctamente",
        data: evento
    });
}

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const eventos = await Evento.get_all();
    return res.status(200).json({
        success: true,
        data: eventos
    })
}

const get_one = async (req: Request, res: Response): Promise<Response> => {
    const evento = await Evento.get_one(res.locals.id);
    return res.status(200).json({
        success: true,
        data: evento
    });
}

const delet = async (req: Request, res: Response): Promise<Response> => {
    let _:void = await Evento.delete(res.locals.id);
    return res.status(200).json({
        success: true,
        message: "Evento eliminado correctamente",
        data: null
    });
}

export default {
    create,
    create_image,
    get_one,
    get_all,
    update,
    delet
}
