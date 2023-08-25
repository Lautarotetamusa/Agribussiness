import {BaseModel} from './base.model';
import { Persona } from './persona.model';
import { sql } from '../db';
import { roles } from '../schemas/persona.schema';
import {
    ColaboradoresDepto,
    RetrieveDepartamento
 } from '../schemas/departamento.schema';

export class Departamento extends BaseModel{
    static table_name: string = "Departamentos"; 

    id_depto: number;
    nombre: string;
    telefono: string;
    colaboradores?: ColaboradoresDepto;

    constructor(body: RetrieveDepartamento){
        super();
        this.id_depto = body.id_depto;
        this.nombre = body.nombre;
        this.telefono = body.telefono;
    }

    static async get_one(id_depto: number): Promise<Departamento>{
        return await this.find_one<RetrieveDepartamento, Departamento>({id_depto: id_depto})
    }

    static async get_all(): Promise<RetrieveDepartamento[]>{
        return await this.find_all<RetrieveDepartamento>();
    }

    async get_colaboradores(){
        const [rows] = await sql.query(`
            SELECT P.cedula, P.nombre, correo, P.telefono, P.direccion
            FROM ${Persona.table_name} P
            INNER JOIN ${Departamento.table_name} D
                ON P.id_depto = D.id_depto
            WHERE D.id_depto = ?
            AND P.rol = ?
            AND P.is_deleted = 0
        `, [this.id_depto, roles.colaborador]);

        this.colaboradores = rows as ColaboradoresDepto;
    }
}