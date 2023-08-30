import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { RolesKeys, roles } from "../schemas/persona.schema";
import { Forbidden, Unauthorized } from "../errors";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header("Authorization")?.replace('Bearer ', '');

    if (!token) throw new Forbidden("Se necesita un token para acceder a este recurso");

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
        res.locals.user = decoded;
        next();
    }catch(err: any){
        throw new Unauthorized("Invalid Token");
        /*return res.status(401).json({
            success: false,
            error: "Invalid token"
        });*/
    }
}

/**
 * Permite solamente el acceso si el parametro de cedula pasado coincide con la cedula del user loggeado
 * O si el usuario loggeado tiene rol "admin"
 * @param req 
 * @param res 
 * @param next 
 */
export const self_or_admin = async (req: Request, res: Response, next: NextFunction) => {
    const cedula = req.params.cedula;
    const token = res.locals.user;
    if (cedula != token.cedula && token.rol != roles.admin) 
        throw new Forbidden("No estas autorizado a acceder a un recurso de otra persona a menos que tengas rol 'admin'");
    next();
};

export const check_rol = (accepted_roles: Array<RolesKeys>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //Get the user ID from previous midleware
        const persona = res.locals.user;
        
        //Check if array of authorized roles not includes the user's role
        if (accepted_roles.indexOf(persona.rol) < 0) 
            throw new Forbidden("No tenes tiene permiso para acceder a este recurso, se necesita rol: ".concat(accepted_roles.join(',')));

        next();
    };
};