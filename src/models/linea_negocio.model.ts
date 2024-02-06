import { sql } from '../db';
import { files_url } from '../server';
import {BaseModel} from './base.model';
import {z} from "zod";
import { Imagen, Producto } from './producto.model';
import { Proveedor } from './proveedor.model';
import { RowDataPacket } from 'mysql2';
import { BuildProducto } from '../schemas/producto.schema';

const iLineaNegocio = z.object({
    id_linea: z.number(),
    nombre: z.string(),
    image: z.string().url()
});
type ILineaNegocio = z.infer<typeof iLineaNegocio>;

const cLineaNegocio = iLineaNegocio.omit({id_linea: true});

export class LineaNegocio extends BaseModel{
    static table_name = "LineasNegocio";
    static image_route = "lineas_negocio"
    static pk = "id_linea";

    id_linea: number;
    nombre: string;
    image: string;
    productos?: BuildProducto[];

    constructor(body: ILineaNegocio){
        super();

        this.id_linea = body.id_linea;
        this.nombre = body.nombre;
        this.image = body.image;
    }

    static async get_all(){
        let lineas = await this.find_all<ILineaNegocio>();
        lineas.map(l => l.image = `${files_url}/${this.image_route}/${l.image}`);
        return lineas;
    }

    static async get_one(id: number){
        let linea = await this.find_one<ILineaNegocio, LineaNegocio>({id_linea: id})
        linea.image = `${files_url}/${this.image_route}/${linea.image}`
        return linea;
    }

    async get_productos(){
        const query = `
            SELECT Prod.*, Prov.nombre as proveedor
            FROM ${Producto.table_name} Prod
            INNER JOIN ${Proveedor.table_name} Prov
                ON Prod.id_proveedor = Prov.id_proveedor
            WHERE Prov.id_linea = ?
        `;

        const [rows] = await sql.query<RowDataPacket[]>(query, this.id_linea);
        rows.map(p => p.portada = p.portada != null ? `${files_url}/${Imagen.image_route}/${p.portada}` : null);
        this.productos = rows as BuildProducto[];
        return rows as BuildProducto[];
    }
}
