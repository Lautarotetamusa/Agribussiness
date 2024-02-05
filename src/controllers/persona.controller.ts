import { Request, Response } from "express";
import {
    TokenData,
    createColaborador,
    createUser, 
    loginUser, 
    roles, 
    updateColaborador, 
    updateUser
} from "../schemas/persona.schema";
import {Colaborador, Persona, Cliente} from "../models/persona.model";
import * as Chat from "../models/chat.model";

import bcrypt from "bcrypt";
import jwt, {Secret} from "jsonwebtoken";
import { Unauthorized, ValidationError } from "../errors";
import { tipoSolicitud } from "../schemas/solicitud.schema";

const create = async (req: Request, res: Response): Promise<Response> => {
    const rol = createUser.shape.rol.parse(req.body.rol);
    let persona, body;

    if (rol == roles.admin){
        throw new ValidationError("No se puede crear una persona con rol 'admin'");

    }else if(rol == roles.colaborador){
        body = createColaborador.parse(req.body);
        body.password = await bcrypt.hash(body.password, 10);
        persona = await Colaborador.create(body);

    }else if (rol == roles.cliente){
        body = createUser.parse(req.body);
        body.password = await bcrypt.hash(body.password, 10);
        persona = await Cliente.create(body);

    }else{ rol satisfies never }
    
    return res.status(201).json({
        success: true,
        message: "Persona creada correctamente",
        data: persona
    })
}

const login = async (req: Request, res: Response): Promise<Response> => {
    const body = loginUser.parse(req.body)
    const persona = await Persona.get_password(body.cedula); //This method is only used here to prevent password leaks

    let match: boolean = await bcrypt.compare(body.password, Buffer.from(persona.password).toString('ascii'));
    if (!match) throw new Unauthorized("Contraseña incorrecta");

    const tokenData: TokenData = {
        cedula: body.cedula,
        nombre: persona.nombre,
        rol: persona.rol
    }
    const token = jwt.sign(tokenData, process.env.JWT_SECRET as Secret, { expiresIn: process.env.JWT_EXPIRES_IN });

    return res.status(200).json({
        success: true,
        message: "login exitoso",
        token: token,
        rol: persona.rol,
    });
}

const update = async (req: Request, res: Response): Promise<Response> => {
    const user = await Persona.get_one(req.params.cedula);
    let body;

    if (user.rol == roles.colaborador){
        body = updateColaborador.parse(req.body);
    }else{
        body = updateUser.parse(req.body);
    }

    if (Object.keys(body).length == 0) throw new ValidationError("Nada para actualizar");
        let _:void = await user.update(body);

    return res.status(201).json({
        success: true,
        message: "Persona actualizada correctamente",
        data: user
    })
}

const delet = async (req: Request, res: Response): Promise<Response> => {
    const persona = await Persona.get_one(req.params.cedula);

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
    let _:void = await persona.get_zona();

    if (persona.rol == roles.colaborador){
        _ = await persona.get_cargo();
        _ = await persona.cargo?.get_depto();
    }

    return res.status(200).json({
        success: true, 
        data: persona
    });
}

const get_solicitudes = async (req: Request, res: Response): Promise<Response> => {
    let tipo = req.query.tipo;
    if (tipo != tipoSolicitud.enviada && tipo != tipoSolicitud.recibida)
        throw new ValidationError("Se debe pasar un parametro en la query llamado 'tipo' que debe ser 'enviada' o 'recibida' ");
        
    const solicitudes = await Colaborador.get_solicitudes(req.params.cedula, tipo);
    return res.status(200).json({
        success: true,
        data: solicitudes
    })
}

const get_cotizaciones = async (req: Request, res: Response): Promise<Response> => {
    const persona = await Persona.get_one(req.params.cedula);
        
    const cotizaciones = await persona.get_cotizaciones();
    return res.status(200).json({
        success: true,
        data: cotizaciones
    })
}

//Devuelve una lista con los colaboradores a los que puede solicitar un colaborador
const get_solicitables = async (req: Request, res: Response): Promise<Response> => {
    const solicitables = await Persona.get_solicitables(req.params.cedula);
    return res.status(200).json({
        success: true,
        data: solicitables
    })
}

//Devuelve una lista de chats de esa persona
const get_chats = async (req: Request, res: Response): Promise<Response> => {
    const chats = await Chat.get_chats(req.params.cedula);

    return res.status(200).json({
        success: true,
        data: chats
    });
}

const get_all = async (req: Request, res: Response): Promise<Response> => {
    let rol;
    if (req.query.rol){
        rol = createUser.shape.rol.parse(req.query.rol);
    }

    const personas = await Persona.get_all(rol);
    return res.status(200).json({
        success: true,
        data: personas
    });
}

export default {
    get_all,
    get_one,
    login,
    create,
    delet,
    update,
    get_solicitudes,
    get_cotizaciones,
    get_solicitables,
    get_chats
}
