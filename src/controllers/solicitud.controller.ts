import { Request, Response } from "express";
import { createSolicitud } from "../schemas/solicitud.schema";
import { Solicitud } from "../models/solicitud.model";

const create = async (req: Request, res: Response): Promise<Response> => {
    const body = createSolicitud.parse({...req.body, solicitante: res.locals.cedula})
    const solicitud = await Solicitud.create(body); 
    
    return res.status(201).json({
        success: true,
        message: "Solicitud creada correctamente",
        data: solicitud
    })
}

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const solicitudes = await Solicitud.get_all();
    return res.status(200).json(solicitudes);
}

const get_one = async (req: Request, res: Response): Promise<Response> => {
    const solicitud = await Solicitud.get_one(res.locals.cod_solicitud);
    return res.status(200).json(solicitud);
}

export default{
    create,
    get_all,
    get_one
}