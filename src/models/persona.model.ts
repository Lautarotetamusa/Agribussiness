import {BaseModel} from './base.model';
import {
    RolesKeys, 
    CreateUser, UpdateUser, CreateColaborador, roles, UpdateColaborador
} from "../schemas/persona.schema";
import { Zona } from './zona.model';
import { Departamento } from './departamento.model';

export class Persona extends BaseModel{
    static table_name: string = "Personas";

    cedula: string;
    password: string;
    nombre: string;
    correo: string;
    telefono?: string;
    direccion: string;
    rol: RolesKeys;

    constructor(body: CreateUser){
        super();
        this.cedula = body.cedula;
        this.password = body.password;
        this.nombre = body.nombre;
        this.correo = body.correo;
        this.telefono = body.telefono;
        this.direccion = body.direccion;
        this.rol = body.rol;
    }

    static async get_one(cedula: string): Promise<Colaborador | Cliente | Admin>{
        const persona = await this._get_one<CreateColaborador>({cedula: cedula, is_deleted: 0});
        if (persona.rol == roles.colaborador)
            return new Colaborador(persona);
        else if (persona.rol == roles.cliente)
            return new Cliente(persona);

        return new Admin(persona);
    }

    static async get_all(): Promise<CreateColaborador[]>{
        const fields = ["cedula", "id_depto", "cod_zona", "nombre", "correo", "telefono", "direccion", "rol"];
        return await this.find_all<CreateColaborador>({is_deleted: 0}, fields);
    }

    async update(_req: UpdateUser){
        await Persona._update<UpdateUser>(_req, {cedula: this.cedula, is_deleted: 0});    

        for (let i in _req){
            let value = _req[i as keyof typeof _req];
            this[i as keyof typeof this] = value as never;
        }
    }
}

export class Colaborador extends Persona{
    id_depto: number;
    cod_zona: number;
    zona?: Zona;
    departamento?: Departamento;
    rol = roles.colaborador;

    constructor(body: CreateColaborador){
        super(body);

        this.id_depto = body.id_depto;
        this.cod_zona = body.cod_zona;
    }

    static async create(body: CreateColaborador): Promise<Colaborador>{
        const colaborador = await Persona._insert<CreateColaborador, Colaborador>(body);
        colaborador.zona = await Zona.get_one(colaborador.cod_zona);
        colaborador.departamento = await Departamento.get_one(colaborador.id_depto);
        return colaborador;
    }

    static async get_all(): Promise<CreateColaborador[]>{
        const fields = ["cedula", "id_depto", "cod_zona", "nombre", "correo", "telefono", "direccion", "rol"];
        return await this.find_all<CreateColaborador>({
            rol: roles.colaborador,
            is_deleted: 0
        }, fields);
    }

    async update(body: UpdateColaborador){
        await Persona._update<UpdateColaborador>(body, {cedula: this.cedula, is_deleted: 0});    

        for (let i in body){
            let value = body[i as keyof typeof body];
            this[i as keyof typeof this] = value as never;
        }

        let _:void = await this.get_zona();
        let a:void = await this.get_depto();

        /*this.id_depto = body.id_depto || this.id_depto;
        this.id_depto = body.id_depto || this.id_depto;

        this.departamento = body.id_depto ? await Departamento.get_one(body.id_depto) : await Departamento.get_one(this.id_depto);
        this.zona = body.cod_zona ? await Zona.get_one(body.cod_zona) : await Zona.get_one(this.cod_zona);*/
    }

    async delete(){
        let _: void = await Persona._update({is_deleted: 1}, {cedula: this.cedula});
    }

    async get_zona(){
        if (!this.zona) this.zona = await Zona.get_one(this.cod_zona);
    }

    async get_depto(){
        if (!this.zona) this.departamento = await Departamento.get_one(this.id_depto);
    }
}

export class Cliente extends Persona{
    rol = roles.cliente;

    constructor(body: CreateUser){
        super(body);
    }

    static async create(body: CreateUser): Promise<Cliente>{
        return await Persona._insert<CreateUser, Cliente>(body);
    }

    static async get_all(): Promise<CreateColaborador[]>{
        const fields = ["cedula", "id_depto", "cod_zona", "nombre", "correo", "telefono", "direccion", "rol"];
        return await this.find_all<CreateColaborador>({
            rol: roles.cliente,
            is_deleted: 0
        }, fields);
    }

    async delete(){
        let _: void = await Persona._update({is_deleted: 1}, {cedula: this.cedula});
    }
}

export class Admin extends Persona{
    rol = roles.admin;

    constructor(body: CreateUser){
        super(body);
    }

    static async get_all(): Promise<CreateColaborador[]>{
        const fields = ["cedula", "id_depto", "cod_zona", "nombre", "correo", "telefono", "direccion", "rol"];
        return await this.find_all<CreateColaborador>({
            rol: roles.admin,
            is_deleted: 0
        }, fields);
    }
}