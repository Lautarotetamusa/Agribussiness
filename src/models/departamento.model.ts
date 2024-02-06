import {BaseModel} from './base.model';
import { Persona } from './persona.model';
import { sql } from '../db';
import { RetrieveColaborador, roles } from '../schemas/persona.schema';
import { RetrieveDepartamento } from '../schemas/departamento.schema';
import { Cargo } from './cargo.model';
import { iCargo } from '../schemas/cargo.schema';

export class Departamento extends BaseModel{
    static table_name: string = "Departamentos"; 

    id_depto: number;
    nombre: string;
    telefono: string;
    cargos?: iCargo[];
    colaboradores?: RetrieveColaborador[];

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

    async get_cargos(){
        this.cargos = await Cargo.find_all({id_depto: this.id_depto});
    }

    // Devuelve todos los colaboradores de este departamento
    async get_colaboradores(){
        const query = `
            SELECT P.cedula, P.nombre, correo, P.telefono, P.direccion
            FROM ${Persona.table_name} P
            INNER JOIN ${Cargo.table_name} C
                ON P.cod_cargo = C.cod_cargo
            INNER JOIN ${Departamento.table_name} D
                ON C.id_depto = D.id_depto
            WHERE D.id_depto = ?
            AND P.rol = ${roles.colaborador}
            AND P.is_deleted = 0
        `;
        
        const [rows] = await sql.query(query, [this.id_depto]);

        this.colaboradores = rows as RetrieveColaborador[];
    }
}
