import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { RolesValues, rolesKeys, roles } from "../schemas/persona.schema";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header("Authorization")?.replace('Bearer ', '');

    if (!token) return res.status(403).json({
        success: false,
        error: "Se necesita un token para acceder a este recurso"
    })

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
        res.locals.user = decoded;
        next();
    }catch(err: any){
        return res.status(401).json({
            success: false,
            error: "Invalid token"
        });
    }
}

export const check_rol = (accepted_roles: Array<RolesValues>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //Get the user ID from previous midleware
        const persona = res.locals.user;
        
        //Check if array of authorized roles includes the user's role
        if (accepted_roles.indexOf(roles[persona.rol as keyof typeof roles]) > -1) next();
        else res.status(403).json({
            success: false,
            error: "La persona no tiene permiso para acceder a este recurso, se necesita permiso ".concat(accepted_roles.map(a => rolesKeys[a as keyof typeof rolesKeys]).join(','))
        });
    };
};