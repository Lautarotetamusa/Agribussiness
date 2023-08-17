import {BaseModel} from './base.model';
import {RolesValues, CreateUser, roles} from "../schemas/persona.schema";

export class Persona extends BaseModel{
    static table_name: string = "Personas"; 

    cedula: string;
    id_depto: number;
    cod_zona: number;
    password: string;
    nombre: string;
    correo: string;
    telefono?: string;
    direccion: string;
    rol: RolesValues;

    constructor(body: CreateUser){
        super();
        this.cedula = body.cedula;
        this.id_depto = body.id_depto;
        this.cod_zona = body.cod_zona;
        this.password = body.password;
        this.nombre = body.nombre;
        this.correo = body.correo;
        this.telefono = body.telefono;
        this.direccion = body.direccion;
        this.rol = roles[body.rol];
    }

    static async get_one(cedula: string): Promise<Persona>{
        return await this.find_one<CreateUser, Persona>({cedula: cedula})
    }

    static async insert(body: CreateUser): Promise<Persona>{
        return await this._insert<CreateUser, Persona>({
            rol: roles[body.rol]
        })
    }
}