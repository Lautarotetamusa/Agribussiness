import { RowDataPacket } from "mysql2";
import { sql } from "../db";
import { CreateEvento, IEvento, UpdateEvento } from "../schemas/evento.schema";
import { files_url } from "../server";
import { BaseModel } from "./base.model"

export class Evento extends BaseModel{
    static image_route = "eventos";
    static table_name = "Eventos";
    static pk = "id_evento";

    id_evento: number;
    titulo: string;
    descripcion: string;
    fecha_creacion: Date;
    image?: string | null;

    constructor(body: IEvento){
        super();

        this.id_evento = body.id_evento;
        this.titulo = body.titulo;
        this.descripcion = body.descripcion;
        this.fecha_creacion = body.fecha_creacion;
        this.image = body.image;
    }

    static async create(body: CreateEvento): Promise<Evento>{
        let evento = await this._insert<CreateEvento, Evento>(body);
        evento.image = evento.image ? `${files_url}/${this.image_route}/${evento.image}` : null;
        return evento;
    }

    async update(body: UpdateEvento & {image?: string}){
        await Evento._update<UpdateEvento & {image?: string}>(body, {id_evento: this.id_evento});

        for (let i in body){
            let value = body[i as keyof typeof body];
            this[i as keyof typeof this] = value as never;
        }
        this.image = this.image ? `${files_url}/${Evento.image_route}/${this.image}` : null;
    }

    static async get_all(): Promise<IEvento[]>{
        const [rows] = await sql.query<RowDataPacket[]>(`
            SELECT id_evento, titulo, descripcion, fecha_creacion, image
            FROM ${this.table_name}
            ORDER BY fecha_creacion DESC
        `);

        let eventos = rows as IEvento[];
        eventos.map(e => e.image = e.image ? `${files_url}/${this.image_route}/${e.image}` : null);
        return eventos;
    }

    static async get_one(id_evento: number){
        let evento = await this.find_one<IEvento, Evento>({id_evento: id_evento});
        evento.image = evento.image ? `${files_url}/${this.image_route}/${evento.image}` : null;
        return evento;
    }

    static async delete(id_evento: number){
        await this._delete({id_evento: id_evento});
    }
}