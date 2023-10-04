import { BaseModel } from "./base.model"
import {
    CreateCotizacion, 
    CreateProductosCotizacion, 
    EstadoKeys, 
    FormaPago, 
    ICotizacion, 
    ProductosCotizacion
} from "../schemas/cotizacion.schema";
import { files_url } from "../server";

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
}

export class Cotizacion extends BaseModel{
    static table_name = "Cotizaciones";
    static pk = "nro_cotizacion";
    static file_route = "cotizaciones";

    nro_cotizacion: number;
    fecha_creacion: Date;
    estado: EstadoKeys;
    colaborador: string;
    cliente: string;
    file: string
    forma_pago: FormaPago;
    tiempo_entrega: number;
    productos?: ProductosCotizacion[];

    constructor(req: ICotizacion){
        super();

        this.nro_cotizacion = req.nro_cotizacion;
        this.fecha_creacion = req.fecha_creacion;
        this.estado = req.estado;
        this.colaborador = req.colaborador;
        this.cliente = req.cliente;
        this.file = req.file;
        this.forma_pago = req.forma_pago;
        this.tiempo_entrega = req.tiempo_entrega
    }

    static async create(body: CreateCotizacion, productos: CreateProductosCotizacion[]): Promise<Cotizacion>{
        const cotizacion = await this._insert<CreateCotizacion & {file: string}, Cotizacion>({
            ...body,
            file: String(Date.now()) + '.pdf'
        });
        let prods = productos.map(p => {return {...p, nro_cotizacion: cotizacion.nro_cotizacion}})
        await CotizacionProducto.bulk_insert(prods);
        cotizacion.productos = prods;
        return cotizacion;
    }

    static async get_one(nro_cotizacion: number){
        const cotizacion = await this.find_one<ICotizacion, Cotizacion>({nro_cotizacion: nro_cotizacion});
        //cotizacion.file = `${files_url}/${Cotizacion.file_route}/${cotizacion.file}`;
        return cotizacion;
    }

    static async get_all(){
        const cotizaciones = await this.find_all<ICotizacion>();
        cotizaciones.map(c => `${files_url}/${Cotizacion.file_route}/${c.file}`);
        return cotizaciones;
    }
}