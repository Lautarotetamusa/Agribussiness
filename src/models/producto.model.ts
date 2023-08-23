import { BuildProducto, CreateProducto, UpdateProducto, createProducto } from '../schemas/producto.schema';
import {BaseModel} from './base.model';

export class Producto extends BaseModel{
    static table_name: string = "Productos";
    static fields = ["id_producto", "precio", "nombre", "presentacion", "descripcion", "descripcion"];
    static pk = "id_producto";

    id_producto: number;
    precio: number;
    nombre: string;
    presentacion: string;
    descripcion: string;

    constructor(body: BuildProducto){
        super();

        this.id_producto = body.id_producto;
        this.precio = body.precio;
        this.nombre = body.nombre;
        this.presentacion = body.presentacion;
        this.descripcion = body.descripcion;
    }

    static async get_one(cedula: string): Promise<Producto>{
        return await this.find_one<BuildProducto, Producto>({cedula: cedula})
    }

    static async get_all(): Promise<BuildProducto[]>{ 
        return await this.find_all<BuildProducto>();
    }

    static async create(body: CreateProducto): Promise<Producto>{
        return await Producto._insert<CreateProducto, Producto>(body);
    }

    static async update(body: UpdateProducto, id_producto: number) {
        await Producto._update<UpdateProducto>(body, {id_producto: id_producto});
    }

    static async bulk_insert(req: CreateProducto[]): Promise<void> {
        return await Producto._bulk_insert<CreateProducto>(req);
    }
}