import { Request, Response } from "express";
import {Producto} from "../models/producto.model";
import { ValidationError } from "../errors";
import { 
    createProducto, updateProducto,
    CreateProducto
} from "../schemas/producto.schema";
import { csv2arr } from "../util/csv_to_arr";

const get_all = async (req: Request, res: Response): Promise<Response> => {
    const productos = await Producto.get_all();
    return res.status(200).json(productos);
}

const get_one = async (req: Request, res: Response): Promise<Response> => {
    const id: number = res.locals.id;
    const producto = await Producto.get_one(id);
    let _:void = await producto.get_proveedor();
    return res.status(200).json(producto);
}

const file_insert = async (req: Request, res: Response): Promise<Response> => {
    if (!req.file) throw new ValidationError("El archivo no se subio correctamente");
    
    const productos = csv2arr<CreateProducto>(req.file.path, createProducto);
    let _: void = await Producto.bulk_insert(productos);

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
    let _:void = await producto.update({ficha_tecnica: req.file.path});

    return res.status(201).json({
        success: true,
        message: "Ficha tecnica subida correctamente",
        data: producto
    });
}

const create = async (req: Request, res: Response): Promise<Response> => {
    const body: CreateProducto = createProducto.parse(req.body);
    const producto: Producto = await Producto.create(body);

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
    let _:void = await producto.update(body);

    return res.status(201).json({
        success: true,
        message: "Producto actualizado correctamente",
        data: producto
    });
}

export default {
    get_all,
    get_one,
    create,
    update,
    file_insert,
    create_ficha_tecnica
}