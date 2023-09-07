import { Request, Response } from "express";
import { Proveedor } from "../models/proveedor.model";
import { cProveedor } from "../schemas/proveedor.schema";
import { ValidationError } from "../errors";
import { proveedorUpload } from "../uploads/proveedor.upload";

const create = async (req: Request, res: Response, next: Function): Promise<Response> => {
    if (!req.files) throw new ValidationError("No se subio ningun archivo");
    if (!("photo" in req.files)) throw new ValidationError("La foto es obligatoria");
    
    req.body.photo = req.files.photo[0].filename;

    // Convertir el id a number o dejarlo como string para que tire error el zod
    req.body.id_linea = isNaN(req.body.id_linea) ? req.body.id_linea : Number(req.body.id_linea);

    const body = cProveedor.parse(req.body);
    
    console.log(req.body);

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
    const proveedor = await Proveedor.get_one(res.locals.id);
    await proveedor.get_linea();
    return res.status(200).json(proveedor);
}

export default {
    create,
    get_all,
    get_one
}