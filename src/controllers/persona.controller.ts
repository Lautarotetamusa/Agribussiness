import { Request, Response } from "express";
import {
    createUser, 
    loginUser, 
    roles, 
    updateUser
} from "../schemas/persona.schema";
import {Persona} from "../models/persona.model";
import { Zona } from "../models/zona.model";
import { Departamento } from "../models/departamento.model";

import bcrypt from "bcrypt";
import jwt, {Secret} from "jsonwebtoken";
import { Unauthorized, ValidationError } from "../errors";

const create = async (req: Request, res: Response): Promise<Response> => {
    const body = createUser.parse(req.body);

    if (body.rol == roles.admin) throw new ValidationError("No se puede crear una persona con rol 'admin'");

    const zona = await Zona.get_one(body.cod_zona);
    const depto = await Departamento.get_one(body.id_depto);

    body.password = await bcrypt.hash(body.password, 10);

    const persona = await Persona.create(body);

    return res.status(201).json({
        success: true,
        message: "Persona creada correctamente",
        data: {
            ...persona,
            zona: zona,
            depto: depto
        }
    })
}

const login = async (req: Request, res: Response): Promise<Response> => {
    const body = loginUser.parse(req.body)
    const persona: Persona = await Persona.get_one(body.cedula);

    let match: boolean = await bcrypt.compare(body.password, Buffer.from(persona.password).toString('ascii'));
    if (!match) throw new Unauthorized("Contraseña incorrecta");

    const token = jwt.sign({
        cedula: persona.cedula,
        rol: persona.rol
    }, process.env.JWT_SECRET as Secret, 
    { expiresIn: process.env.JWT_EXPIRES_IN });

    return res.status(200).json({
        success: true,
        message: "login exitoso",
        token: token
    });
}

const update = async (req: Request, res: Response): Promise<Response> => {
    const body = updateUser.parse(req.body);
    if (Object.keys(body).length == 0) throw new ValidationError("Nada para actualizar");
    
    const user: Persona = await Persona.get_one(res.locals.user.cedula);
    const depto: Departamento = body.id_depto ? await Departamento.get_one(body.id_depto) : await Departamento.get_one(user.id_depto);
    const zona: Zona = body.cod_zona ? await Zona.get_one(body.cod_zona) : await Zona.get_one(user.cod_zona);

    let _:void = await user.update(body);

    return res.status(201).json({
        success: true,
        message: "Persona actualizada correctamente",
        data: {
            ...user,
            zona: zona,
            depto: depto
        }
    })
}

const delet = async (req: Request, res: Response): Promise<Response> => {
    const persona: Persona = await Persona.get_one(req.params.cedula);

    if (persona.rol == roles.admin)
        throw new ValidationError("No se puede borrar un persona admin");

    let _: void = await persona.delete();
    
    return res.status(201).json({
        success: true,
        message: "Persona eliminada correctamente"
    });
}

const get_one = async (req: Request, res: Response): Promise<Response> => {
    const persona = await Persona.get_one(req.params.cedula);
    const zona: Zona = await Zona.get_one(persona.cod_zona);
    const depto: Departamento = await Departamento.get_one(persona.id_depto);

    let {password, ...p} = {...persona}
    return res.status(200).json({
        ...p,
        zona: zona,
        depto: depto
    })
}

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const personas = await Persona.get_all();
    return res.status(200).json(personas);
}

export default {
    get_all,
    get_one,
    //user_info,
    login,
    create,
    delet,
    update
}