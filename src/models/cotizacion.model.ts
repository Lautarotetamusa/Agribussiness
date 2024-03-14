import { BaseModel } from "./base.model"
import {
    CreateCotizacion, 
    EstadoKeys, 
    FormaPago, 
    ICotizacion, 
    ProductosCotizacion,
    ProductosCotizacionArchivo
} from "../schemas/cotizacion.schema";
import { files_url } from "../server";
import { Cliente, Colaborador } from "./persona.model";
import { Producto } from "./producto.model";
import { sql } from "../db";
import { RowDataPacket } from "mysql2";
import { CreateProducto } from "../schemas/producto.schema";

export class CotizacionProducto extends BaseModel{
    static table_name = "CotizacionProducto";

    nro_cotizacion: number;
    id_producto: number;
    cantidad: number;
    precio_final: number;

    constructor(req: ProductosCotizacion){
        super();

        this.nro_cotizacion =  req.nro_cotizacion;
        this.id_producto =  req.id_producto;
        this.cantidad =  req.cantidad;
        this.precio_final =  req.precio_final;
    }
    static async bulk_insert(productos: ProductosCotizacion[]){
        return await this._bulk_insert<ProductosCotizacion>(productos);
    }
    static async remove(nro_cotizacion: number){
        await this._delete({nro_cotizacion: nro_cotizacion})
    }
}

export class Cotizacion extends BaseModel{
    static table_name = "Cotizaciones";
    static pk = "nro_cotizacion";
    static file_route = "cotizaciones";

    nro_cotizacion: number;
    fecha_creacion: Date;
    estado: EstadoKeys;
    colaborador_cedula: string;
    cliente_cedula?: string;
    cliente_nuevo?: string;
    file: string
    forma_pago: FormaPago;
    tiempo_entrega: number;
    disposiciones: string;
    
    colaborador?: Colaborador;
    productos?: ProductosCotizacion[];
    cliente?: Cliente;

    constructor(req: ICotizacion){
        super();

        this.nro_cotizacion = req.nro_cotizacion;
        this.fecha_creacion = req.fecha_creacion;
        this.estado = req.estado;
        this.colaborador_cedula = req.colaborador;
        this.cliente_cedula = req.cliente;
        this.cliente_nuevo = req.cliente_nuevo;
        this.file = req.file;
        this.forma_pago = req.forma_pago;
        this.tiempo_entrega = req.tiempo_entrega;
        this.disposiciones = req.disposiciones;
    }

    static async create(body: CreateCotizacion, productos: ProductosCotizacion[]): Promise<Cotizacion>{
        const cotizacion = await this._insert<CreateCotizacion & {file: string}, Cotizacion>({
            ...body,
            file: String(Date.now()) + '.pdf'
        });
        //sacarle el nombre y agregar el nro_cotizacion
        let prods = productos.map(p => {
            return {...p, nro_cotizacion: cotizacion.nro_cotizacion};
        })
        await CotizacionProducto.bulk_insert(prods);
        cotizacion.fecha_creacion = new Date();
        cotizacion.productos = productos;
        return cotizacion;
    }
    
    async update(body: CreateCotizacion){
        await Cotizacion._update(body, {
            nro_cotizacion: this.nro_cotizacion
        });
        for (let i in body){
            let value = body[i as keyof typeof body];
            this[i as keyof typeof this] = value as never;
        }
    }

    static async get_one(nro_cotizacion: number, parsePath=true){
        const cotizacion = await this.find_one<ICotizacion, Cotizacion>({nro_cotizacion: nro_cotizacion});
        if (parsePath){
            cotizacion.file = `${files_url}/${Cotizacion.file_route}/${cotizacion.file}`;
        }
        return cotizacion;
    }

    async get_productos(){
        const query = `
            SELECT P.* FROM ${CotizacionProducto.table_name} CP
            INNER JOIN ${Producto.table_name} P
                ON P.id_producto = CP.id_producto
            WHERE CP.nro_cotizacion = ?
        `;
        
        const [productos] = await sql.query<RowDataPacket[]>(query, this.nro_cotizacion);
        return productos as CreateProducto[];
    }

    static async get_all(){
        const path = `${files_url}/${Cotizacion.file_route}/`
        const query = `
            SELECT *, CONCAT('${path}', file) as file
            FROM Cotizaciones
            ORDER BY nro_cotizacion DESC
        `;

        const [cotizaciones] = await sql.query<RowDataPacket[]>(query);
        return cotizaciones;
    }
}
