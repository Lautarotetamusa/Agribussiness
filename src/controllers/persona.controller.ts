import { Request, Response } from "express";
import {createUser, loginUser, roles, updateUser} from "../schemas/persona.schema";
import {Persona} from "../models/persona.model";
import { Zona } from "../models/zona.model";
import { Departamento } from "../models/departamento.model";

import bcrypt from "bcrypt";
import jwt, {Secret} from "jsonwebtoken";
import { ValidationError } from "../errors";

const create = async (req: Request, res: Response): Promise<Response> => {
    const body = createUser.parse(req.body);

    if (roles[body.rol] == roles.admin) return res.status(400).json({
        success: false,
        error: "No se puede crear una persona con rol 'admin'"
    })

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


const update = async (req: Request, res: Response): Promise<Response> => {
    const body = updateUser.parse(req.body);
    if (Object.keys(body).length == 0) throw new ValidationError("Nada para actualizar");

    const user = await Persona.get_one(res.locals.user.cedula);
    const depto = body.id_depto ? await Departamento.get_one(body.id_depto) : await Departamento.get_one(user.id_depto);
    const zona  = body.cod_zona ? await Zona.get_one(body.cod_zona) : await Zona.get_one(user.cod_zona);

    await user.update(body);

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

const login = async (req: Request, res: Response): Promise<Response> => {
    const body = loginUser.parse(req.body)

    const persona = await Persona.get_one(body.cedula);
    console.log("persona:", persona);

    let match = await bcrypt.compare(body.password, Buffer.from(persona.password).toString('ascii'));
    
    if (!match) return res.status(401).json({
        success: false,
        error: "Contraseña incorrecta"
    });

    const token = jwt.sign({
        cedula: persona.cedula,
        correo: persona.correo,
        direccion: persona.direccion,
        telefono: persona.telefono,
        cod_zona: persona.cod_zona,
        id_depto: persona.id_depto,
        rol: persona.rol
    }, process.env.JWT_SECRET as Secret, 
    { expiresIn: process.env.JWT_EXPIRES_IN });

    return res.status(200).json({
        success: true,
        message: "login exitoso",
        token: token
    });
}

const user_info = async (req: Request, res: Response): Promise<Response> => {
    const cedula = req.params.cedula;
    const persona = res.locals.user;

    if (cedula != persona.cedula) return res.status(403).json({
        success: false,
        error: "No estas autorizado a acceder a un recurso de otra persona"
    });
    
    const zona = await Zona.get_one(persona.cod_zona);
    const depto = await Departamento.get_one(persona.id_depto);

    return res.status(200).json({
        ...persona,
        zona: zona,
        depto: depto

    })
}

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const personas = await Persona.get_all();

    return res.status(200).json(personas)
}

export default {
    create,
    login,
    user_info,
    get_all,
    update
}