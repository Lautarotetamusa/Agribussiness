import { Request, Response } from "express";
import { Proveedor } from "../models/proveedor.model";
import { cProveedor } from "../schemas/proveedor.schema";
import { ValidationError } from "../errors";

const create = async (req: Request, res: Response): Promise<Response> => {
    if (!req.files) throw new ValidationError("No se subio ningun archivo");
    if (!("photo" in req.files)) throw new ValidationError("La foto es obligatoria");
    if ("ficha_tecnica" in req.files)
        req.body.ficha_tecnica = req.files.ficha_tecnica[0].filename;
    req.body.photo = req.files.photo[0].filename;

    const body = cProveedor.parse(req.body);
    
    const proveedor = await Proveedor.create(body);

    return res.status(201).json({
        success: true,
        message: "Proveedor creado correctamente",
        data: proveedor
    })
}

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const proveedores = await Proveedor.get_all();
    return res.status(200).json(proveedores);
}

const get_one = async (req: Request, res: Response): Promise<Response> => {
    const id = res.locals.id;

    const proveedor = await Proveedor.get_one(id);
    return res.status(200).json(proveedor);
}

export default {
    create,
    get_all,
    get_one
}