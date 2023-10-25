import { RowDataPacket } from 'mysql2';
import { sql } from '../db';
import { 
    BuildProducto, 
    CreateProducto, 
    ListProducto, 
    UpdateProducto 
} from '../schemas/producto.schema';
import { BaseModel} from './base.model';
import { Proveedor } from './proveedor.model';
import { ValidationError } from '../errors';

export class Producto extends BaseModel{
    static table_name: string = "Productos";
    static fields = ["id_producto", "id_proveedor", "precio", "nombre", "presentacion", "descripcion", "descripcion", "ficha_tecnica", "iva"];
    static pk = "id_producto";

    id_producto: number;
    id_proveedor: number;
    precio: number;
    nombre: string;
    iva?: number;
    presentacion: string;
    descripcion: string;
    ficha_tecnica?: string | null;
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
        this.iva = body.iva || 0;
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
        let prod = await this.find_one<BuildProducto, Producto>({id_producto: id_producto})
        //Esto lo hacemos, porque mysql devuelve el campo DECIMAL(10, 2) como un string
        //Lo parseo a float, como ts no me deja pasarle un argumento que cree que es number, usamos as unkwnow as string
        //prod.precio = parseFloat((prod.precio as unknown) as string);
        return prod;
    }

    static async get_all(): Promise<ListProducto[]>{ 
        const query = `
            SELECT Prod.*, Prov.nombre as nombre_proveedor
            FROM ${this.table_name} Prod
            INNER JOIN ${Proveedor.table_name} Prov
                ON Prod.id_proveedor = Prov.id_proveedor
            ORDER BY Prod.id_producto ASC
        ` as const;

        const [rows] = await sql.query<RowDataPacket[]>(query);

        //Omito el precio porque MySQL lo devuelve como un string, debería arreglar esto. TODO!
        //Suponemos que el precio está bien
        let check = ListProducto.omit({precio: true}).parse(rows[0]); //Validate the response
        return rows as ListProducto[];

        //return await this.find_all<BuildProducto>();
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
        console.log(req);
        
        return await Producto._bulk_insert<CreateProducto>(req);
    }

    static async select(ids: number[]) {
        const productos = await this._bulk_select(ids.map(i => {return {id_producto: i}}));
        if (productos.length != ids.length){
            throw new ValidationError("Algun producto no existe en la base de datos");
        }
        //Esto lo hacemos, porque mysql devuelve el campo DECIMAL(10, 2) como un string
        //Lo parseo a float, como ts no me deja pasarle un argumento que cree que es number, usamos as unkwnow as string
        productos.map(p => p.precio = parseFloat((p.precio as unknown) as string));
        return productos as BuildProducto[];
    }
}