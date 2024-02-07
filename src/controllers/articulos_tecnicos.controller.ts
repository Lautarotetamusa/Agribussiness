import { Request, Response } from "express";
import {ArticuloTecnico} from "../models/articulo_tecnico.model";
import { createArticuloTecnico, updateArticuloTecnico } from "../schemas/articulo_tecnico.schema";
import { ValidationError } from "../errors";
import { broadcast_notification } from "../notifications";

const create = async (req: Request, res: Response): Promise<Response> => {
    const body = createArticuloTecnico.parse(req.body);

    const articuloTecnico = await ArticuloTecnico.create(body);

    await broadcast_notification({
        message: `Nuevo articulo_tecnico: ${articuloTecnico.titulo}`,
        type: 'articulo_tecnico:new'
    });

    return res.status(201).json({
        success: true,
        message: "Articulo tecnico creado correctamente",
        data: articuloTecnico
    });
}

const create_image = async (req: Request, res: Response): Promise<Response> => {
    if (!req.file) throw new ValidationError("La imagen del articulo tecnico no se subio correctamente");

    const articuloTecnico = await ArticuloTecnico.get_one(res.locals.id);
    await articuloTecnico.update({
        image: req.file.filename 
    });

    return res.status(201).json({
        success: true,
        message: "Imagen del articulo tecnico subida correctamente",
        data: articuloTecnico
    });
}

const update = async (req: Request, res: Response): Promise<Response> => {
    const body = updateArticuloTecnico.parse(req.body);
    if (Object.keys(body).length <= 0) throw new ValidationError("Nada para actualizar");

    const articuloTecnico = await ArticuloTecnico.get_one(res.locals.id);
    await articuloTecnico.update(body);

    await broadcast_notification({
        message: `Se actualizo un articulo tecnico`,
        type: 'articulo_tecnico:update'
    });

    return res.status(201).json({
        success: true,
        message: "Articulo tecnico actualizado correctamente",
        data: articuloTecnico
    });
}

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const articuloTecnicos = await ArticuloTecnico.get_all();
    return res.status(200).json({
        success: true,
        data: articuloTecnicos
    })
}

const get_one = async (req: Request, res: Response): Promise<Response> => {
    const articuloTecnico = await ArticuloTecnico.get_one(res.locals.id);
    return res.status(200).json({
        success: true,
        data: articuloTecnico
    });
}

const delet = async (req: Request, res: Response): Promise<Response> => {
    await ArticuloTecnico.delete(res.locals.id);
    return res.status(200).json({
        success: true,
        message: "Articulo tecnico eliminado correctamente",
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
