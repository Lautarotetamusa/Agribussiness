import { BuildProducto, CreateProducto } from '../schemas/producto.schema';
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

    static async get_all(): Promise<CreateProducto[]>{
        
        return await this.find_all<CreateProducto>();
    }

    static async create(body: CreateProducto): Promise<Producto>{
        return await Producto._insert<CreateProducto, Producto>(body);
    }
}