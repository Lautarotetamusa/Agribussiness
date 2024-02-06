import { Request, Response } from "express";
import { Cotizacion } from "../models/cotizacion.model";
import { 
    CreateProductosCotizacion, 
    ProductosCotizacionArchivo, 
    createCotizacion, 
    createProductosCotizacion
}from "../schemas/cotizacion.schema";
import { Cliente, Persona } from "../models/persona.model";
import { CreateUser, roles } from "../schemas/persona.schema";
import { sql } from "../db";
import { ValidationError } from "../errors";
import { Producto } from "../models/producto.model";
import { generate_cotizacion_pdf } from "../util/generate_pdf";
import { files_url } from "../server";
import { direct_notification } from "../notifications";

const create = async (req: Request, res: Response): Promise<Response> => {
    const conn = await sql.getConnection(); //Obtener una conexion, necesario para realizar la transaccion

    //El colaborador que crea la solicitud es el que esta loggeado en ese momento
    const body = createCotizacion.parse({...req.body, colaborador: res.locals.user.cedula});

    if (!("productos" in req.body) || !(Array.isArray(req.body.productos)) || req.body.productos.length <= 0){
        throw new ValidationError("Una cotización necesita al menos un producto");
    }
    let productos: CreateProductosCotizacion[] = [];
    for (let producto of req.body.productos){
        productos.push(createProductosCotizacion.parse(producto));
    }

    //Validar que existan y traer otros datos para generar el archivo
    let db_prods = await Producto.select(productos.map(p => p.id_producto));

    //Validar que exista un cliente con la cedula pasada
    //Si es un cliente nuevo lo creamos para tener su nombre para el pdf
    let cliente = undefined;
    if (body.cliente){
        cliente = await Persona.get_by_rol(body.cliente, roles.cliente);
    }else{
        cliente = new Cliente({nombre: body.cliente_nuevo} as CreateUser)
    }
 
    //Agregar el nombre y el precio si es que no lo tiene a los productos
    let prods_archivo = productos.map(p => {return {...p, nombre: "", precio_final: 0, iva: 0}});
    for (let i in productos){
        const db_prod = db_prods.find(d => d.id_producto == productos[i].id_producto);

        if (!('precio_final' in productos[i])){
            productos[i].precio_final = db_prod?.precio;
            prods_archivo[i].precio_final = db_prod?.precio as number;
        }else{
            prods_archivo[i].precio_final = productos[i].precio_final as number;
        }
        prods_archivo[i].nombre = db_prod?.nombre || "";
        prods_archivo[i].iva = db_prod?.iva || 0;
    }

    try {
        await conn.beginTransaction();
        const cotizacion = await Cotizacion.create(body, productos as ProductosCotizacionArchivo[]);
        cotizacion.cliente = cliente;

        //Buscamos el colaborador ya que necesitamos su nombre para el pdf.
        cotizacion.colaborador = await Persona.get_by_rol(res.locals.user.cedula, roles.colaborador);

        await generate_cotizacion_pdf(cotizacion, prods_archivo);
        cotizacion.file = `${files_url}/${Cotizacion.file_route}/${cotizacion.file}`;

        await direct_notification(cotizacion.colaborador.cedula, {
            message: `Su cotización ${cotizacion.nro_cotizacion} ha sido exitosamente elaborada, puede descargarla`,
            type: 'cotizacion:new'
        });
        await direct_notification(cotizacion.cliente.cedula, {
            message: `Recibio una nueva cotización nro: ${cotizacion.nro_cotizacion} de parte de ${cotizacion.colaborador.nombre}`,
            type: 'cotizacion:new'
        });

        await conn.commit();
        return res.status(201).json({
            success: true,
            message: "Cotizacion creada correctamente",
            data: cotizacion
        })
    } catch (error) {
        conn.rollback();
        console.info("Se realizo un rollback correctamente");
        throw error;
    }
}

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const cotizaciones = await Cotizacion.get_all();

    return res.status(200).json({
        success: true,
        data: cotizaciones
    })
}

const get_one = async (req: Request, res: Response): Promise<Response> => {
    const cotizacion = await Cotizacion.get_one(Number(req.params.nro_cotizacion));
    let productos = await cotizacion.get_productos();

    if (res.locals.user.rol != roles.admin){
        if (res.locals.user.cedula != cotizacion.colaborador_cedula){
            throw new ValidationError("No podes ver una cotizacion generada por otro colaborador, se necesita permiso admin o que se generada por vos");
        }
    }

    return res.status(200).json({
        success: true,
        data: {
            ...cotizacion,
            productos: productos
        }
    })
}

export default {
    get_all,
    get_one,
    create
}
