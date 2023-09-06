import { sql } from "../db";
import { BaseModel } from "./base.model"
import { z } from "zod";
import { Persona } from "./persona.model";
import { roles } from "../schemas/persona.schema";
import { ColaboradoresDepto } from "../schemas/departamento.schema";
import { Departamento } from "./departamento.model";

const iCargo = z.object({
    cod_cargo: z.number(),
    id_depto: z.number(),
    nombre: z.string()
});
export type iCargo = z.infer<typeof iCargo>;

export class Cargo extends BaseModel{
    static table_name = "Cargos";
    static pk = "cod_cargo";

    cod_cargo: number;
    id_depto: number;
    nombre: string;
    colaboradores?: ColaboradoresDepto;
    depto?: Departamento;

    constructor(body: iCargo){
        super();
        this.cod_cargo = body.cod_cargo,
        this.id_depto = body.id_depto;
        this.nombre = body.nombre;
    }

    static async get_all(): Promise<iCargo[]>{
        return await this.find_all();
    }

    static async get_one(cod_cargo: number){
        return await this.find_one<iCargo, Cargo>({cod_cargo: cod_cargo});
    }

    async get_depto(){
        /*const [rows] = await sql.query<RowDataPacket[]>(`
            SELECT id_depto, nombre, telefono FROM ${Departamento.table_name} D
            WHERE id_depto = ?
        `, [this.id_depto]);*/

        //return rows[0] as RetrieveDepartamento;

        this.depto = await Departamento.get_one(this.id_depto);
    }

    async get_colaboradores(){
        const [rows] = await sql.query(`
            SELECT P.cedula, P.nombre, correo, P.telefono, P.direccion
            FROM ${Persona.table_name} P
            INNER JOIN ${Cargo.table_name} C
                ON P.cod_cargo = C.cod_cargo
            WHERE C.cod_cargo = ?
            AND P.rol = ?
            AND P.is_deleted = 0
        `, [this.cod_cargo, roles.colaborador]);

        this.colaboradores = rows as ColaboradoresDepto;
    }
}