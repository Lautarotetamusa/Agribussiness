import { Request, Response } from "express";
import { Departamento } from "../models/departamento.model";
import { ValidationError } from "../errors";

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const deptos = await Departamento.get_all();
    return res.status(200).json(deptos)
}

const get_one = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(res.locals.id);

    const depto = await Departamento.get_one(id);
    let _:void = await depto.get_colaboradores();
    _ = await depto.get_cargos();
    return res.status(200).json(depto);
}

export default {
    get_one,
    get_all
}