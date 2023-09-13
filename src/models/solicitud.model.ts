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
        const cargos_validos = ["Gerente General", "Gerente Administrativo"];

        const query = `
            SELECT COUNT(*) AS count FROM ${Persona.table_name} P
            INNER JOIN Cargos C
                ON C.cod_cargo = P.cod_cargo
            WHERE C.nombre IN (${cargos_validos.map(c => `"${c}"`).join(', ')})
            AND rol = '${roles.colaborador}'
            AND P.cedula = ?
        `;

        const [solicitados]  = await sql.query<RowDataPacket[]>(query, [body.solicitado]);
        const [solicitantes] = await sql.query<RowDataPacket[]>(query, [body.solicitante]);

        if (solicitantes[0].count > 0)
            throw new ValidationError(`La persona con cedula ${body.solicitante} que envia la solicitud es un gerente y no debe serlo`);

        if (solicitados[0].count <= 0)
            throw new ValidationError(`La persona con cedula ${body.solicitado} que recibe la solicitud no existe o no es un gerente`);

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