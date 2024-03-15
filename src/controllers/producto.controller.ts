import { Request, Response } from "express";
import {Imagen, Producto} from "../models/producto.model";
import { ValidationError } from "../errors";
import { 
    createProducto, updateProducto,
    CreateProducto,
    filterProducto
} from "../schemas/producto.schema";
import { csv2arr } from "../util/csv_to_arr";
import { Proveedor } from "../models/proveedor.model";
import { files_url } from "../server";
import { broadcastNotification } from "../notifications";
import { notifications } from "../schemas/notificacion.schema";

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const filters = filterProducto.parse(req.query);
    console.log(filters);

    const productos = await Producto.get_all(filters);
    return res.status(200).json({
        success: true,
        data: productos
    });
}

const get_one = async (req: Request, res: Response): Promise<Response> => {
    const id: number = res.locals.id;
    const producto = await Producto.get_one(id);
    let _:void = await producto.get_proveedor();
    return res.status(200).json({
        success: true,
        data: producto
    });
}

const file_insert = async (req: Request, res: Response): Promise<Response> => {
    if (!req.file) throw new ValidationError("El archivo no se subio correctamente");
    
    const productos = csv2arr(req.file.path, createProducto);
    //Validar que todos los proveedores existan
    for (const producto of productos){
        await Proveedor.get_one(producto.id_proveedor);
    }
    await Producto.bulk_insert(productos as CreateProducto[]);

    broadcastNotification(notifications['producto:list']());

    return res.status(201).json({
        success: true,
        message: "Productos subidos correctamente",
        data: productos
    });
}

const create_ficha_tecnica = async (req: Request, res: Response): Promise<Response> => {
    if (!req.file) throw new ValidationError("El archivo no se subio correctamente");
    const id: number = res.locals.id;

    const producto = await Producto.get_one(id);
    let _:void = await producto.update({ficha_tecnica: req.file.filename});

    return res.status(201).json({
        success: true,
        message: "Ficha tecnica subida correctamente",
        data: producto
    });
}

const create_imagen = (is_portada: boolean) => {
    return async (req: Request, res: Response): Promise<Response> => {
        if (!req.file) throw new ValidationError("La imagen no se subio correctamente");
        const id: number = res.locals.id;
    
        const producto = await Producto.get_one(id);
        let imagen_path: string = "";

        if (!is_portada){
            const imagen = await Imagen.insert({
                id_producto: producto.id_producto, 
                path: req.file.filename,
                comentarios: req.body.comentarios || ""
            });
            imagen_path = imagen.path;
        }else{
            let _:void = await producto.update({portada: req.file.filename});
        }
    
        broadcastNotification(notifications['producto:imagen:new'](producto.nombre));

        return res.status(201).json({
            success: true,
            message: `Imagen para el producto ${producto.nombre} cargada correctamente`,
            data: imagen_path
        });
    }
}

const get_images = async (req: Request, res: Response): Promise<Response> => {
    const id: number = res.locals.id;
    const producto = await Producto.get_one(id);
    const imagenes = await Imagen.get_all_by_prod(producto.id_producto);

    return res.status(200).json({
        success: true,
        data: {
            ...producto,
            imagenes: imagenes
        }
    });
};

const create = async (req: Request, res: Response): Promise<Response> => {
    const body: CreateProducto = createProducto.parse(req.body);
    const producto: Producto = await Producto.create(body);

    broadcastNotification(notifications['producto:new'](producto.nombre));

    return res.status(201).json({
        success: true,
        message: "Producto creado correctamente",
        data: producto
    })
}

const update = async (req: Request, res: Response): Promise<Response> => {
    const body = updateProducto.parse(req.body);
    if (Object.keys(body).length == 0) throw new ValidationError("Nada para actualizar");
    const id: number = res.locals.id;

    const producto = await Producto.get_one(id);
    const _:void = await producto.update(body);

    broadcastNotification(notifications['producto:update'](producto.nombre));

    return res.status(201).json({
        success: true,
        message: "Producto actualizado correctamente",
        data: producto
    });
}

const remove = async (req: Request, res: Response): Promise<Response> => {
    const id: number = res.locals.id;
    await Producto.remove(id);

    return res.status(200).json({
        success: true,
        message: "Producto eliminado correctamente"
    });
}

export default {
    get_all,
    get_one,
    create,
    update,
    remove,
    file_insert,
    create_ficha_tecnica,
    create_imagen,
    get_images
}
