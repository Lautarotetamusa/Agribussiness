import {BaseModel} from './base.model';
import { Persona } from './persona.model';
import { sql } from '../db';
import { roles } from '../schemas/persona.schema';
import { Zona } from './zona.model';
import {
    iPromocion,
    CreatePromocion
} from '../schemas/promocion.schema';
import { ColaboradoresDepto } from '../schemas/departamento.schema';

export class Promocion extends BaseModel{
    static table_name: string = "Promociones";
    static fields: string[] = ["id_depto", "cod_zona", "titulo", "fecha_expiracion", "descripcion"];
    static pk = "id_depto";

    id_depto: number;
    cod_zona: number;
    titulo: string;
    fecha_expiracion: Date;
    descripcion: string;
    zona?: Zona;
    colaboradores?: ColaboradoresDepto 

    constructor(body: iPromocion){
        super();
        this.id_depto = body.id_depto;
        this.cod_zona = body.cod_zona;
        this.titulo = body.titulo;
        this.fecha_expiracion = body.fecha_expiracion;
        this.descripcion = body.descripcion;
    }

    static async create(req: CreatePromocion, zona: Zona): Promise<Promocion>{
        const promo = await this._insert<CreatePromocion, Promocion>(req);
        promo.zona = zona;
        return promo;
    }

    static async get_one(id_depto: number): Promise<Promocion>{
        const promo = await this.find_one<CreatePromocion, Promocion>({id_depto: id_depto});
        promo.zona = await Zona.get_one(promo.cod_zona);
        return promo;
    }

    static async get_all(): Promise<iPromocion[]>{
        return await this.find_all<iPromocion>();
    }

    async get_colaboradores(){
        const [rows] = await sql.query(`
            SELECT Per.cedula, Per.nombre, Per.correo, Per.telefono, Per.direccion
            FROM ${Persona.table_name} Per
            INNER JOIN ${Promocion.table_name} Prom
                ON Z.cod_zona = Prom.cod_zona
            WHERE Per.rol = ?
        `, [roles.colaborador]);

        this.colaboradores = rows as ColaboradoresDepto;
    }
}