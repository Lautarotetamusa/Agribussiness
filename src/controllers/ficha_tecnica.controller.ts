import { Request, Response } from "express";
import { 
    FichaTecnica, 
    createFichaTecnica 
} from "../models/ficha_tecnica.model";
import { ValidationError } from "../errors";

const create = async (req: Request, res: Response): Promise<Response> => {
    if (!req.file) throw new ValidationError("El archivo no se subio correctamente");
    req.body.archivo = req.file.filename;
    const body = createFichaTecnica.parse(req.body);

    const ficha = await FichaTecnica.create(body);

    return res.status(201).json({
        success: true,
        message: "Ficha tecnica creada correctamente",
        data: ficha
    })
}

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const fichas = await FichaTecnica.get_all();
    return res.status(201).json(fichas)
}

export default {
    create,
    get_all
}