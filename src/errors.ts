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

export class InternalError extends ApiError {
    constructor(message: string){
        super(500, message, "InternalError");
    }
}