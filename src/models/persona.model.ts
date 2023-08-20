import {BaseModel} from './base.model';
import {RolesKeys, CreateUser, roles, BuildUser, rolesKeys, UpdateUser} from "../schemas/persona.schema";

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
    rol: RolesKeys;

    constructor(body: BuildUser){
        super();
        this.cedula = body.cedula;
        this.id_depto = body.id_depto;
        this.cod_zona = body.cod_zona;
        this.password = body.password;
        this.nombre = body.nombre;
        this.correo = body.correo;
        this.telefono = body.telefono;
        this.direccion = body.direccion;
        this.rol = rolesKeys[body.rol]
    }

    static async get_one(cedula: string): Promise<Persona>{
        return await this.find_one<BuildUser, Persona>({cedula: cedula})
    }

    static async get_all(): Promise<CreateUser[]>{
        const fields = ["cedula", "id_depto", "cod_zona", "nombre", "correo", "telefono", "direccion", "rol"];
        return await this.find_all<CreateUser>({}, fields);
    }

    static async create(body: CreateUser): Promise<Persona>{
        return await Persona._insert<BuildUser, Persona>({
            cedula: body.cedula,
            id_depto: body.id_depto,
            cod_zona: body.cod_zona,
            password: body.password,
            nombre: body.nombre,
            correo: body.correo,
            telefono: body.telefono,
            direccion: body.direccion,
            rol: roles[body.rol]
        });
    }

    async update(_req: UpdateUser){
        await Persona._update<UpdateUser>(_req, {cedula: this.cedula});    

        for (let i in _req){
            let value = _req[i as keyof typeof _req];

            //if (value !== undefined)
                //this[i as keyof UpdateUser] = value; 

            if (value !== undefined && typeof value != "number"){
                this["telefono"] = value;
                this["cedula"] = value;
                this["password"] = value;
                this["nombre"] = value;
                this["correo"] = value;
                this["direccion"] = value;
            }else if (typeof value == "number"){
                this["id_depto"] = value;
                this["cod_zona"] = value;
            }
        }
    }
}