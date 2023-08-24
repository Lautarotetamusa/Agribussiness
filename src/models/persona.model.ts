import {BaseModel} from './base.model';
import {
    RolesKeys, 
    CreateUser, UpdateUser
} from "../schemas/persona.schema";

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
        this.rol = body.rol;
    }

    static async get_one(cedula: string): Promise<Persona>{
        return await this.find_one<CreateUser, Persona>({cedula: cedula, is_deleted: 0})
    }

    static async get_all(): Promise<CreateUser[]>{
        const fields = ["cedula", "id_depto", "cod_zona", "nombre", "correo", "telefono", "direccion", "rol"];
        return await this.find_all<CreateUser>({is_deleted: 0}, fields);
    }

    static async create(body: CreateUser): Promise<Persona>{
        return await Persona._insert<CreateUser, Persona>(body);
    }

    async update(_req: UpdateUser){
        await Persona._update<UpdateUser>(_req, {cedula: this.cedula, is_deleted: 0});    

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

    async delete(){
        let _: void = await Persona._update({is_deleted: 1}, {cedula: this.cedula});
    }
}