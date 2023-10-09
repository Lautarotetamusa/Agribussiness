import { Request, Response } from "express";
import { Cotizacion } from "../models/cotizacion.model";
import { 
    CreateProductosCotizacion, 
    createCotizacion, 
    createProductosCotizacion
}from "../schemas/cotizacion.schema";
import { Persona } from "../models/persona.model";
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
    await Persona.exists_tipo(body.cliente, roles.cliente);
    //await Persona.exists_tipo(body.colaborador, roles.colaborador); No lo valido ya que es la persona loogeada en ese momento, se supone que existe xd
 
    /*TEST*/
    const cotizacion = await Cotizacion.get_one(1);
    let prods_with_names: (CreateProductosCotizacion & {nombre: string})[] = productos.map(p => {return {...p, nombre: ""}});
    for (let i in productos){
        prods_with_names[i].nombre = db_prods[i].nombre;
    }
    await generate_cotizacion_pdf(cotizacion, prods_with_names);
    return res.send(`${files_url}/${Cotizacion.file_route}/${cotizacion.file}`);
    /*TEST*/

    try {
        await conn.beginTransaction();
        const inserted = await Cotizacion.create(body, productos);
        const cotizacion = await Cotizacion.get_one(inserted.nro_cotizacion);

        //Agregar el nombre a los productos
        let prods_with_names: (CreateProductosCotizacion & {nombre: string})[] = productos.map(p => {return {...p, nombre: ""}});
        for (let i in productos){
            prods_with_names[i].nombre = db_prods[i].nombre;
        }

        await generate_cotizacion_pdf(cotizacion, prods_with_names);
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
    return res.status(200).json({
        success: true,
        data: cotizacion
    })
}

export default {
    get_all,
    get_one,
    create
}