import { Request, Response } from "express";
import { createSolicitud } from "../schemas/solicitud.schema";
import { Solicitud } from "../models/solicitud.model";
import { ValidationError } from "../errors";
import { directNotification } from "../notifications";
import { notifications } from "../schemas/notificacion.schema";

const create = async (req: Request, res: Response): Promise<Response> => {
    const body = createSolicitud.parse({...req.body, solicitante: res.locals.user.cedula})
    const solicitud = await Solicitud.create(body); 

    directNotification(notifications['solicitud:new'](solicitud))
    
    return res.status(201).json({
        success: true,
        message: "Solicitud creada correctamente",
        data: solicitud
    })
}

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const solicitudes = await Solicitud.get_all();
    return res.status(200).json({
        success: true,
        data: solicitudes
    });
}

const get_one = async (req: Request, res: Response): Promise<Response> => {
    const solicitud = await Solicitud.get_one(res.locals.cod_solicitud);
    return res.status(200).json({
        success: true,
        data: solicitud
    });
}

const aceptar = async (req: Request, res: Response): Promise<Response> => {
    const solicitud = await Solicitud.get_one(res.locals.cod_solicitud);

    if (solicitud.solicitado != res.locals.user.cedula)
        throw new ValidationError("No puedes aceptar una solicitud que fue enviada a otra persona");

    const _:void = await solicitud.aceptar();

    directNotification(notifications['solicitud:accept'](solicitud));

    return res.status(201).json({
        success: true,
        message: "Solicitud aprobada correctamente",
        data: solicitud
    })
}

export default{
    create,
    get_all,
    get_one,
    aceptar
}
