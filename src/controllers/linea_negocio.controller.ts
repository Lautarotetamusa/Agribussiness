import { Request, Response } from "express";
import { LineaNegocio } from "../models/linea_negocio.model";

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const lineas = await LineaNegocio.get_all();
    return res.status(200).json(lineas);
}

const get_one = async (req: Request, res: Response): Promise<Response> => {
    const linea = await LineaNegocio.get_one(res.locals.id);
    let _ = await linea.get_productos();
    return res.status(200).json(linea);
}

export default{
    get_all,
    get_one
}