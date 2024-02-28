import { Request, Response } from "express";
import { Promocion } from "../models/promocion.model";
import { createPromocion, updatePromocion } from "../schemas/promocion.schema";
import { Zona } from "../models/zona.model";

const create = async (req: Request, res: Response): Promise<Response> => {
    const body = createPromocion.parse(req.body);
    const zona = await Zona.get_one(body.cod_zona);

    const promo = await Promocion.create(body, zona);
    return res.status(201).json({
        success: true,
        message: "Promocion creada correctamente",
        data: promo
    })
}

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const promos = await Promocion.get_all();
    return res.status(200).json({
        success: true,
        data: promos
    });
}

const get_one = async (req: Request, res: Response): Promise<Response> => {
    const id: number = res.locals.id;

    const promo = await Promocion.get_one(id);
    let _:void = await promo.get_colaboradores();
    return res.status(200).json({
        success: true,
        data: promo
    });
}

const update = async (req: Request, res: Response): Promise<Response> => {
    const id: number = res.locals.id;
    const body = updatePromocion.parse(req.body);

    const promo = await Promocion.update(id, body);
    return res.status(201).json({
        success: true,
        message: "Promocion actualizada correctamente",
        data: promo
    })
}

export default {
    create,
    get_one,
    get_all,
    update
}
