import {BaseModel} from './base.model';
import {
    RolesKeys, 
    CreateUser, UpdateUser, CreateColaborador, roles, UpdateColaborador
} from "../schemas/persona.schema";
import { Zona } from './zona.model';
import { Cargo } from './cargo.model';
import { sql } from '../db';
import { RowDataPacket } from 'mysql2';
import { Solicitud } from './solicitud.model';
import { TipoSolicitud } from '../schemas/solicitud.schema';
import { ListSolicitudesColaborador } from '../schemas/solicitud.schema';
import { ValidationError } from '../errors';
import { Cotizacion } from './cotizacion.model';
import { ICotizacion } from '../schemas/cotizacion.schema';

type rolExtend<R extends RolesKeys> = 
    R extends "colaborador" ? Colaborador : 
    R extends "admin" ? Admin : Cliente;

export class Persona extends BaseModel{
    static table_name: string = "Personas";
    static fields = ["cedula", "cod_zona", "cod_cargo", "nombre", "correo", "telefono", "direccion", "rol"];

    cedula: string;
    cod_zona: number;
    zona?: Zona;
    nombre: string;
    correo: string;
    telefono?: string;
    direccion: string;
    rol: RolesKeys;

    constructor(body: CreateUser){
        super();
        this.cedula = body.cedula;
        this.cod_zona = body.cod_zona;
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

    static async get_by_rol<R extends RolesKeys>(cedula: string, rol: R): Promise<rolExtend<R>>
    {
        return await this.find_one<CreateColaborador, rolExtend<R>>
        ({cedula: cedula, is_deleted: 0, rol: rol});
    }

    static async exists_tipo(cedula: string, rol: RolesKeys){
        let exists = await this._exists({cedula: cedula, is_deleted: 0, rol: rol});
        if (!exists)
            throw new ValidationError(`No existe el ${rol} con cedula ${cedula}`);
    }

    static async get_password(cedula: string): Promise<{
        password: string,
        rol: RolesKeys
    }>{
        const fields = ["password", "rol"];
        return this._get_one({cedula: cedula, is_deleted: 0}, fields);
    }

    static async get_all(rol?: RolesKeys): Promise<CreateColaborador[]>{
        if (rol)
            return await this.find_all<CreateColaborador>({
                is_deleted: 0,
                rol: rol
            });

        return await this.find_all<CreateColaborador>({is_deleted: 0});
    }

    async update(_req: UpdateUser){
        for (let i in _req){
            let value = _req[i as keyof typeof _req];
            this[i as keyof typeof this] = value as never;
        }
        
        let _:void = await this.get_zona();

        await Persona._update<UpdateUser>(_req, {cedula: this.cedula, is_deleted: 0});    
    }

    async get_zona(){
        if (!this.zona) this.zona = await Zona.get_one(this.cod_zona);
    }

    async get_cotizaciones(){
        if (this.rol == roles.admin)
            throw new ValidationError("El administrador no puede tener cotizaciones");
            
        const query = `
            SELECT * FROM ${Cotizacion.table_name}
            WHERE '${this.rol}' = ?
        `;
        const [rows] = await sql.query<RowDataPacket[]>(query, this.cedula);
        return rows as ICotizacion[];
    }
}

export class Colaborador extends Persona{
    cod_cargo: number;
    cargo?: Cargo;
    rol = roles.colaborador;

    constructor(body: CreateColaborador){
        super(body);

        //this.id_depto = body.id_depto;
        this.cod_cargo = body.cod_cargo;
    }

    static async create(body: CreateColaborador): Promise<Colaborador>{
        let zona = await Zona.get_one(body.cod_zona);
        //let departamento = await Departamento.get_one(body.id_depto);
        let cargo = await Cargo.get_one(body.cod_cargo);
        await cargo.get_depto();

        const colaborador = await Persona._insert<CreateColaborador, Colaborador>(body);
        colaborador.zona = zona;
        colaborador.cargo = cargo;
        return colaborador;
    }

    async update(body: UpdateColaborador){
        for (let i in body){
            let value = body[i as keyof typeof body];
            this[i as keyof typeof this] = value as never;
        }
        
        let _:void = await this.get_zona();
        _ = await this.get_cargo();
        _ = await this.cargo?.get_depto();
        
        await Persona._update<UpdateColaborador>(body, {cedula: this.cedula, is_deleted: 0});
    }

    /**
     * @param cedula cedula de la persona que se busca
     * @param tipoSolicitud 
     * enviada  -> se buscan las solicitudes enviadas por esa persona \
     * recibida -> se buscan las solicitudes recibidas por esa persona 
     * @returns ListSolicitudesColaborador[]
     */
    static async get_solicitudes(cedula: string, tipoSolicitud: TipoSolicitud){
        let where_key = tipoSolicitud  == "enviada"  ? "solicitante" : "solicitado";

        const query = `
            SELECT cod_solicitud, solicitante, solicitado, fecha_creacion, descripcion, aceptada
            FROM ${Solicitud.table_name}
            WHERE ${where_key} = ?
            ORDER BY fecha_creacion DESC
        `;

        const [rows] = await sql.query<RowDataPacket[]>(query, cedula);
        return rows as ListSolicitudesColaborador[];
    }

    async delete(){
        let _: void = await Persona._update({is_deleted: 1}, {cedula: this.cedula});
    }

    async get_cargo(){
        if (!this.cargo) this.cargo = await Cargo.get_one(this.cod_cargo);
    }
}

export class Cliente extends Persona{
    rol = roles.cliente;

    constructor(body: CreateUser){
        super(body);
    }

    static async create(body: CreateUser): Promise<Cliente>{
        let zona: Zona = await Zona.get_one(body.cod_zona);
        const cliente = await Persona._insert<CreateUser, Cliente>(body);
        cliente.zona = zona;
        return cliente;
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
}