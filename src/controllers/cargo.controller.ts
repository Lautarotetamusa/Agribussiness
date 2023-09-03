import { Request, Response } from "express";
import {Cargo} from "../models/cargo.model";

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const cargos = await Cargo.get_all();
    return res.status(200).json(cargos)
}

const get_one = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(res.locals.id);

    const cargo = await Cargo.get_one(id);
    let _:void = await cargo.get_colaboradores();
    return res.status(200).json(cargo);
}

export default {
    get_one,
    get_all
}