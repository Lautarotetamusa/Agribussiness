import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { ZodError } from 'zod';

interface ErrorResponse{
    success: false,
    errors: Array<{
        code: string,
        message: string
    }>
}

export function handle_errors(err: Error, req: Request, res: Response, next: NextFunction): Response{
    console.log("ERROR: ");
    console.log("message: ", err.message);
    console.log("stack: ", err.stack);
    
    if (err instanceof ZodError) return res.status(400).json({
        success: false,
        errors: JSON.parse(err.message) as Array<object>
    });

    if (err instanceof ApiError) return res.status(err.status).json({
        success: false,
        errors: [{
            code: err.name,
            message: err.message
        }]
    });

    if (err instanceof MulterError){
        console.log("ERROR from handle: ", err);

        // Esto soluciona un error con multer que al encontrar un error dos veces en el segundo queda una respuesta pendiente sin respuesta
        // https://github.com/expressjs/multer/issues/1193
        if ("storageErrors" in err){
            req.resume()
        }
            
        return res.status(400).json({
            success: false,
            errors: [{
                code: err.name,
                message: err.message + ": " + err.field
            }]
        });
    } 
        
    return res.status(500).json({
        success: false,
        errors: [{
            code: err.name,
            message: err.message
        }]
    })
}

export class ApiError extends Error{
    status: number;
    name: string;

    constructor(status: number, message: string, name: string){
        super(message);
        this.status = status;
        this.name = name;
    }
}

export class ValidationError extends ApiError {
    constructor(message: string){
        super(400, message, "ValidationError");
    }
}

export class NotFound extends ApiError {
    constructor(message: string){
        super(404, message, "NotFound");
    }
}

export class NothingChanged extends ApiError {
    constructor(message: string){
        super(200, message, "NothingChanged");
    }
}

export class Duplicated extends ApiError {
    constructor(message: string){
        super(404, message, "Duplicated");
    }
}

export class Forbidden extends ApiError {
    constructor(message: string){
        super(403, message, "Forbidden");
    }
}

export class Unauthorized extends ApiError {
    constructor(message: string){
        super(401, message, "Unauthorized");
    }
}

export class InternalError extends ApiError {
    constructor(message: string){
        super(500, message, "InternalError");
    }
}