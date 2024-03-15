import { RowDataPacket } from "mysql2";
import { sql } from "../db";
import { RolesKeys } from "../schemas/persona.schema";
import { BaseModel } from "./base.model";

export type DispositivoSchema = {
    token: string, 
    cedula: string
};

export class Dispositivo extends BaseModel{
    static table_name: string = "Dispositivos";

    token: string;
    cedula: string;

    constructor(req: DispositivoSchema){
        super();
        this.token = req.token;
        this.cedula = req.cedula;
    }
    
    //Guardar el dispositivo
    async save(){
        const exists = await Dispositivo._exists(this);
        if (!exists){
            await Dispositivo._insert(this); 
        }
    }

    static async remove(req: DispositivoSchema){
        return await Dispositivo._delete(req);
    }

    static async getByRoles(roles: RolesKeys[]){
        const parameters = roles.map(_ => '?').join(', ');
        const query = `
            SELECT token, P.cedula 
            FROM Dispositivos D
            INNER JOIN Personas P
                ON P.cedula = D.cedula
            WHERE P.rol IN (${parameters})
        `;

        const [rows] = await sql.query<RowDataPacket[]>(query, roles);
        return rows as DispositivoSchema[];
    }
    
    static async getByCedulas(cedulas: string[]){
        const parameters = cedulas.map(_ => '?').join(', ');
        const query = `
            SELECT token, cedula
            FROM Dispositivos D
            WHERE cedula IN (${parameters})
        `;

        const [rows] = await sql.query<RowDataPacket[]>(query, cedulas);
        return rows as DispositivoSchema[];
    }
}

