import { 
    BuildProducto, 
    CreateProducto, 
    UpdateProducto 
} from '../schemas/producto.schema';
import { BaseModel} from './base.model';
import { Proveedor } from './proveedor.model';

export class Producto extends BaseModel{
    static table_name: string = "Productos";
    static fields = ["id_producto", "id_proveedor", "precio", "nombre", "presentacion", "descripcion", "descripcion", "ficha_tecnica"];
    static pk = "id_producto";

    id_producto: number;
    id_proveedor: number;
    precio: number;
    nombre: string;
    presentacion: string;
    descripcion: string;
    ficha_tecnica?: string;
    proveedor?: Proveedor;

    constructor(body: BuildProducto){
        super();

        this.id_producto = body.id_producto;
        this.id_proveedor = body.id_proveedor;
        this.precio = body.precio;
        this.nombre = body.nombre;
        this.presentacion = body.presentacion;
        this.descripcion = body.descripcion;
        this.ficha_tecnica = body.ficha_tecnica;
    }

    static async create(body: CreateProducto): Promise<Producto>{
        let proveedor = await Proveedor.get_one(body.id_proveedor)

        const producto = await Producto._insert<CreateProducto, Producto>(body);
        producto.proveedor = proveedor;
        return producto;
    }

    async get_proveedor(): Promise<void>{
        this.proveedor = await Proveedor.get_one(this.id_proveedor);
    }

    static async get_one(id_producto: number): Promise<Producto>{
        return await this.find_one<BuildProducto, Producto>({id_producto: id_producto})
    }

    static async get_all(): Promise<BuildProducto[]>{ 
        return await this.find_all<BuildProducto>();
    }

    async update(body: UpdateProducto){
        for (let i in body){
            let value = body[i as keyof typeof body];
            this[i as keyof typeof this] = value as never;
        }
        
        let _:void = await this.get_proveedor();
        
        await Producto._update<UpdateProducto>(body, {id_producto: this.id_producto});
    }

    static async bulk_insert(req: CreateProducto[]): Promise<void> {
        return await Producto._bulk_insert<CreateProducto>(req);
    }
}