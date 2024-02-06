import {BaseModel} from './base.model';
import { Persona } from './persona.model';
import { sql } from '../db';
import { RetrieveColaborador, roles } from '../schemas/persona.schema';
import { Zona } from './zona.model';
import {
    PromocionSchema,
    CreatePromocion,
    UpdatePromocion
} from '../schemas/promocion.schema';

export class Promocion extends BaseModel{
    static table_name: string = "Promociones";
    static fields: string[] = ["id_promo", "cod_zona", "titulo", "fecha_expiracion", "descripcion"];
    static pk = "id_promo";

    id_promo: number;
    cod_zona: number;
    titulo: string;
    fecha_expiracion: Date;
    descripcion: string;
    zona?: Zona;
    colaboradores?: RetrieveColaborador[];

    constructor(body: PromocionSchema){
        super();
        this.id_promo = body.id_promo;
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

    static async get_one(id_promo: number): Promise<Promocion>{
        const promo = await this.find_one<PromocionSchema, Promocion>({id_promo: id_promo});
        promo.zona = await Zona.get_one(promo.cod_zona);
        return promo;
    }

    static async get_all(): Promise<PromocionSchema[]>{
        return await this.find_all<PromocionSchema>();
    }

    static async update(id_promo: number, req: UpdatePromocion): Promise<Promocion>{
        await this._update<PromocionSchema>(req, {id_promo: id_promo});
        return await this.get_one(id_promo);
    }

    async get_colaboradores(){
        const [rows] = await sql.query(`
            SELECT Per.cedula, Per.nombre, Per.correo, Per.telefono, Per.direccion
            FROM ${Persona.table_name} Per
            INNER JOIN ${Promocion.table_name} Prom
                ON Per.cod_zona = Prom.cod_zona
            WHERE Per.rol = ?
        `, [roles.colaborador]);

        this.colaboradores = rows as RetrieveColaborador[];
    }
}
