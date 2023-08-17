import { Request, Response } from "express";
import {createUser} from "../schemas/persona.schema";
import {Persona} from "../models/persona.model";
import { Zona } from "../models/zona.model";
import { Departamento } from "../models/departamento.model";

const create = async (req: Request, res: Response): Promise<Response> => {
    const body = createUser.parse(req.body);

    const zona = await Zona.get_one(body.cod_zona);
    const depto = await Departamento.get_one(body.id_depto);

    const persona = await Persona.insert(body);

    return res.status(201).json({
        success: true,
        data: {
            ...persona,
            zona: zona,
            depto: depto
        }
    })
}

export default {
    create
}