import { RowDataPacket } from "mysql2";
import { sql } from "../db";
import { roles } from "../schemas/persona.schema";
import { CreateSolicitud, ISolicitud } from "../schemas/solicitud.schema";
import { BaseModel } from "./base.model";
import { Persona } from "./persona.model";
import { ValidationError } from "../errors";

export class Solicitud extends BaseModel{
    static table_name = "Solicitudes";
    static pk = "cod_solicitud";

    cod_solicitud: number;
    solicitante: string;
    solicitado: string;
    fecha_creacion: Date;
    descripcion: string;
    aceptada: boolean;

    constructor(body: ISolicitud){
        super();

        this.cod_solicitud = body.cod_solicitud;
        this.solicitante = body.solicitante;
        this.solicitado = body.solicitado;
        this.fecha_creacion = body.fecha_creacion;
        this.descripcion = body.descripcion;
        this.aceptada = body.aceptada;
    }

    static async create(body: CreateSolicitud){
        //Buscar niveles del solicitante y solicitado
        const [niveles] = await sql.query<RowDataPacket[]>(`
            SELECT C.nivel, P.cedula, C.nombre FROM ${Persona.table_name} P
            INNER JOIN Cargos C
                ON C.cod_cargo = P.cod_cargo 
            WHERE rol = '${roles.colaborador}'
            AND P.cedula IN (?, ?)
            `, [body.solicitante, body.solicitado]);

        //niveles: [{'392142823': 3, 'Gerente'}, {'492183214': 1, "Encargado"}]
        let nivel: Record<string, {nivel: number, cargo: string}> = {}; 
        //nivel: { '392142823': {nivel: 3, cargo: "Gerente"}, '492183214': {nivel: 1, cargo: "Encargado"} }
        niveles.map(n => {nivel[n.cedula] = {nivel: n.nivel, cargo: n.nombre}}); 

        if (nivel[body.solicitante].nivel <= nivel[body.solicitado].nivel){
            const err = `La persona ${body.solicitante} con cargo '${nivel[body.solicitante].cargo}' no puede realizar una solicitud a la persona ${body.solicitado} con cargo '${nivel[body.solicitado].cargo}'`;
            throw new ValidationError(err);
        }

        return await this._insert<CreateSolicitud, Solicitud>(body);
    }

    async aceptar(){
        if (this.aceptada)
            throw new ValidationError("La solicitud ya estaba aprobada")
        await Solicitud._update({aceptada: true}, {cod_solicitud: this.cod_solicitud})
        this.aceptada = true;
    }

    static async get_all(): Promise<ISolicitud[]>{
        return await this.find_all();
    }

    static async get_one(cod_solicitud: number): Promise<Solicitud>{
        return await this.find_one({cod_solicitud: cod_solicitud});
    }
}
