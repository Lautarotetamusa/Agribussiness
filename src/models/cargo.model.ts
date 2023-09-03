import { sql } from "../db";
import { BaseModel } from "./base.model"
import { z } from "zod";
import { Persona } from "./persona.model";
import { roles } from "../schemas/persona.schema";
import { ColaboradoresDepto } from "../schemas/departamento.schema";

const iCargo = z.object({
    cod_cargo: z.number(),
    nombre: z.string()
});
type iCargo = z.infer<typeof iCargo>;

export class Cargo extends BaseModel{
    static table_name = "Cargos";
    static pk = "cod_cargo";

    cod_cargo: number;
    nombre: string;
    colaboradores?: ColaboradoresDepto;

    constructor(body: iCargo){
        super();
        this.cod_cargo = body.cod_cargo,
        this.nombre = body.nombre;
    }

    static async get_all(): Promise<iCargo[]>{
        return await this.find_all();
    }

    static async get_one(cod_cargo: number){
        return await this.find_one<iCargo, Cargo>({cod_cargo: cod_cargo});
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