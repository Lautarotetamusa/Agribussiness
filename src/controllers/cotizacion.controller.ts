import { Request, Response } from "express";
import { Cotizacion } from "../models/cotizacion.model";
import { 
    CreateProductosCotizacion, 
    ProductosCotizacionArchivo, 
    createCotizacion, 
    createProductosCotizacion
}from "../schemas/cotizacion.schema";
import { Colaborador, Persona } from "../models/persona.model";
import { roles } from "../schemas/persona.schema";
import { sql } from "../db";
import { ValidationError } from "../errors";
import { Producto } from "../models/producto.model";
import { generate_cotizacion_pdf } from "../util/generate_pdf";
import { files_url } from "../server";

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

    //Validar que exista un cliente y colaborador con las cedulas que les pasamos
    const cliente = await Persona.get_by_rol(body.cliente, roles.cliente);
    //await Persona.exists_tipo(body.colaborador, roles.colaborador); No lo valido ya que es la persona loogeada en ese momento, se supone que existe xd
 
    //Agregar el nombre y el precio si es que no lo tiene a los productos
    let prods_archivo = productos.map(p => {return {...p, nombre: "", precio_final: 0}});
    for (let i in productos){
        const db_prod = db_prods.find(d => d.id_producto == productos[i].id_producto);
        if (!('precio_final' in productos[i])){
            productos[i].precio_final = db_prod?.precio
        }
        prods_archivo[i].nombre = db_prod?.nombre || "";
        prods_archivo[i].precio_final = db_prod?.precio || 0;
    }

    try {
        await conn.beginTransaction();
        const cotizacion = await Cotizacion.create(body, productos as ProductosCotizacionArchivo[]);
        cotizacion.cliente = cliente;
        //La buscamos de nuevo para obtener la fecha de creación
        //const cotizacion = await Cotizacion.get_one(inserted.nro_cotizacion);
        cotizacion.colaborador = await Persona.get_one(res.locals.user.cedula) as Colaborador;

        await generate_cotizacion_pdf(cotizacion, prods_archivo);
        cotizacion.file = `${files_url}/${Cotizacion.file_route}/${cotizacion.file}`;

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
        console.log(res.locals.user.cedula, cotizacion.colaborador_cedula);
        
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