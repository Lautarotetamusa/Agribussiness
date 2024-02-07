import { RowDataPacket } from "mysql2";
import { sql } from "../db";
import { files_url } from "../server";
import { BaseModel } from "./base.model"
import { ArticuloTecnicoSchema, CreateArticuloTecnico, UpdateArticuloTecnico } from "../schemas/articulo_tecnico.schema";

export class ArticuloTecnico extends BaseModel{
    static image_route = "articulos_tecnicos";
    static table_name = "ArticulosTecnicos";
    static pk = "id";

    id: number;
    titulo: string;
    descripcion: string;
    fecha_creacion: Date;
    image?: string | null;
    url?: string | null;

    constructor(body: ArticuloTecnicoSchema){
        super();

        this.id = body.id;
        this.titulo = body.titulo;
        this.descripcion = body.descripcion;
        this.fecha_creacion = body.fecha_creacion;
        this.image = body.image;
        this.url = body.url;
    }

    static async create(body: CreateArticuloTecnico): Promise<ArticuloTecnico>{
        let articuloTecnico = await this._insert<CreateArticuloTecnico, ArticuloTecnico>(body);
        articuloTecnico.image = articuloTecnico.image ? `${files_url}/${this.image_route}/${articuloTecnico.image}` : null;
        return articuloTecnico;
    }

    async update(body: UpdateArticuloTecnico & {image?: string}){
        await ArticuloTecnico._update<UpdateArticuloTecnico & {image?: string}>(body, {id: this.id});

        for (let i in body){
            let value = body[i as keyof typeof body];
            this[i as keyof typeof this] = value as never;
        }
        this.image = this.image ? `${files_url}/${ArticuloTecnico.image_route}/${this.image}` : null;
    }

    static async get_all(): Promise<ArticuloTecnicoSchema[]>{
        const [rows] = await sql.query<RowDataPacket[]>(`
            SELECT *
            FROM ${this.table_name}
            ORDER BY fecha_creacion DESC
        `);

        let articulosTecnicos = rows as ArticuloTecnicoSchema[];
        articulosTecnicos.map(e => e.image = e.image ? `${files_url}/${this.image_route}/${e.image}` : null);
        return articulosTecnicos;
    }

    static async get_one(id: number){
        let articuloTecnico = await this.find_one<ArticuloTecnicoSchema, ArticuloTecnico>({id: id});
        articuloTecnico.image = articuloTecnico.image ? `${files_url}/${this.image_route}/${articuloTecnico.image}` : null;
        return articuloTecnico;
    }

    static async delete(id: number){
        await this._delete({id: id});
    }
}
