import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors";

export function valid_param(key: string){
    return async (req: Request, res: Response, next: NextFunction) => {

        const value = Number(req.params[key]);
        if (Number.isNaN(value)) throw new ValidationError(`Parametro '${req.params[key]}' url invalido`);
        res.locals[key] = value;
        next();
    };
};
