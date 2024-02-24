import { Request, Response, NextFunction } from "express";
import jwt, { Secret, TokenExpiredError } from "jsonwebtoken";
import { RolesKeys, roles } from "../schemas/persona.schema";
import { Forbidden, Unauthorized, ValidationError } from "../errors";
import { TokenData } from "../schemas/persona.schema";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header("Authorization")?.replace('Bearer ', '');

    if (!token) throw new Forbidden("Se necesita un token para acceder a este recurso");

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
        res.locals.user = decoded as TokenData;
        next();
    }catch(err: any){
        if (err instanceof TokenExpiredError)
            throw new Unauthorized("El token expiro");
        
        throw new Unauthorized("Invalid Token");
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

export const check_rol = (roles: Array<RolesKeys>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const persona = res.locals.user;
        
        if (roles.indexOf(persona.rol) < 0) 
            throw new Forbidden(`No tenes tiene permiso para acceder a este recurso, se necesita rol: ${roles.join(', ')}`);

        next();
    };
};

// Validar cuales tipo de persona se pueden listar
export const list_personas = async (req: Request, res: Response, next: NextFunction) => {
    type RolList = RolesKeys | "all"; 
    const rol: RolesKeys = res.locals.user.rol;
    const query_rol = req.query.rol as RolList || "all";

    const permissions: Record<RolesKeys, RolList[]> = {
        "admin": ["all", roles.admin, roles.colaborador, roles.cliente],
        "colaborador": [roles.cliente, roles.colaborador],
        "cliente": [],
        "invitado": []
    }
    
    if (!permissions[rol].includes(query_rol)){
        throw new ValidationError(`Una persona con rol '${rol}' no puede listar personas con rol '${query_rol}'`)
    }

    next();
};
