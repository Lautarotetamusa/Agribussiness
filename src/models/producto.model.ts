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
import { CreateImagen, IImagen } from '../schemas/persona.schema';
import { files_url } from '../server';
import { filePaths } from '../schemas/files.schema';

export class Imagen extends BaseModel{
    static table_name = "Imagenes";
    static image_route = filePaths.imagenes;

    id_producto: number;
    path: string;
    nro_imagen: number;

    constructor(body: IImagen){
        super();

        this.id_producto = body.id_producto;
        this.path = body.path;
        this.nro_imagen = body.nro_imagen;
    }

    static async insert(body: CreateImagen){
        const nro_imagen = await this.get_last(body.id_producto);
        
        const imagen = await this._insert<IImagen, Imagen>({
            ...body,
            nro_imagen: nro_imagen
        });
        imagen.path = `${files_url}/${Imagen.image_route}/${imagen.path}`;
        return imagen;
    }

    //Devuelve el Nro de imagen que necesistamos pasarle a la siguiente que ingresemos
    static async get_last(id_producto: number){
        const imgs_prod = await this.find_all({id_producto: id_producto});
        return imgs_prod.length;
    }

    static async get_all_by_prod(id_producto: number){
        const images = await this.find_all<Imagen>({id_producto: id_producto});
        images.map(i => i.path = `${files_url}/${Imagen.image_route}/${i.path}`);
        return images;
    }
}

export class Producto extends BaseModel{
    static table_name: string = "Productos";
    static fields = ["id_producto", "id_proveedor", "precio", "nombre", "presentacion", "descripcion", "descripcion", "ficha_tecnica", "iva", "portada"];
    static pk = "id_producto";
    static fichaTecnicaPath = "fichas_tecnicas";

    id_producto: number;
    id_proveedor: number;
    precio: number;
    nombre: string;
    iva: number;
    portada?: string | null;
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
        this.iva = body.iva;
        this.portada = body.portada;
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
        const prod = await this.find_one<BuildProducto, Producto>({id_producto: id_producto})
        //Esto lo hacemos, porque mysql devuelve el campo DECIMAL(10, 2) como un string
        //Lo parseo a float, como ts no me deja pasarle un argumento que cree que es number, usamos as unkwnow as string
        prod.precio = parseFloat((prod.precio as unknown) as string);
        prod.portada = prod.portada != null ? `${files_url}/${Imagen.image_route}/${prod.portada}` : null;
        prod.ficha_tecnica = `${files_url}/${this.fichaTecnicaPath}/${prod.ficha_tecnica}`;
        return prod;
    }

    static async get_all(): Promise<ListProducto[]>{ 
        const portadaPath = `${files_url}/${Imagen.image_route}/`;
        const fichaPath = `${files_url}/${this.fichaTecnicaPath}/`;

        const query = `
            SELECT Prod.*, Prov.nombre as nombre_proveedor,
                CONCAT('${portadaPath}', Prod.portada) as portada,
                CONCAT('${fichaPath}', Prod.ficha_tecnica) as ficha_tecnica
            FROM ${this.table_name} Prod
            INNER JOIN ${Proveedor.table_name} Prov
                ON Prod.id_proveedor = Prov.id_proveedor
            ORDER BY Prod.id_producto DESC
        ` as const;

        const [rows] = await sql.query<RowDataPacket[]>(query);
        return rows as ListProducto[];
    }

    async update(body: UpdateProducto){
        for (let i in body){
            let value = body[i as keyof typeof body];
            this[i as keyof typeof this] = value as never;
        }
        this.portada = this.portada != null ? `${files_url}/${Imagen.image_route}/${this.portada}` : null;
        this.ficha_tecnica = `${files_url}/${Producto.fichaTecnicaPath}/${this.ficha_tecnica}`;
        
        let _:void = await this.get_proveedor();
        
        await Producto._update<UpdateProducto>(body, {id_producto: this.id_producto});
    }

    static async bulk_insert(req: CreateProducto[]): Promise<void> {        
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
