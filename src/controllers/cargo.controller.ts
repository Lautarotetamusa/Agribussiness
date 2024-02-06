import { Request, Response } from "express";
import {Cargo} from "../models/cargo.model";

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const cargos = await Cargo.get_all();
    return res.status(200).json({
        success: true,
        data: cargos
    })
}

const get_one = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(res.locals.id);

    const cargo = await Cargo.get_one(id);
    let _:void = await cargo.get_colaboradores();
    _ = await cargo.get_depto();

    return res.status(200).json({
        success: true,
        data: cargo
    });
}

export default {
    get_one,
    get_all
}
