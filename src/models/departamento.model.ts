import {BaseModel} from './base.model';
import { Persona } from './persona.model';
import { sql } from '../db';
import { roles } from '../schemas/persona.schema';
import {
    ColaboradoresDepto,
    RetrieveDepartamento
 } from '../schemas/departamento.schema';
import { Cargo, iCargo } from './cargo.model';

export class Departamento extends BaseModel{
    static table_name: string = "Departamentos"; 

    id_depto: number;
    nombre: string;
    telefono: string;
    cargos?: iCargo[];
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

    async get_cargos(){
        this.cargos = await Cargo.find_all({id_depto: this.id_depto});
    }

    async get_colaboradores(){
        const query = `
            SELECT P.cedula, P.nombre, correo, P.telefono, P.direccion
            FROM ${Persona.table_name} P
            INNER JOIN ${Cargo.table_name} C
                ON P.cod_cargo = C.cod_cargo
            INNER JOIN ${Departamento.table_name} D
                ON C.id_depto = D.id_depto
            WHERE D.id_depto = ?
            AND P.rol = ?
            AND P.is_deleted = 0
        `;
        // Con esto podría hacer get_one(), get_cargos() y get_colaboradores() en una sola consulta, pero tendría que mappear todos los campos.
        /*const query = `
            SELECT C.*, D.*, C.nombre as nombre_cargo, P.cedula, P.nombre
            FROM Departamentos D
            INNER JOIN Cargos C
                ON C.id_depto = D.id_depto
            LEFT JOIN Personas P
                ON P.cod_cargo = C.cod_cargo
            WHERE D.id_depto = 2
        `;*/
        
        const [rows] = await sql.query(query, [this.id_depto, roles.colaborador]);

        this.colaboradores = rows as ColaboradoresDepto;
    }
}