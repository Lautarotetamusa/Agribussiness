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
    return res.status(201).json(productos);
}

const file_insert = async (req: Request, res: Response): Promise<Response> => {
    if (!req.file) throw new ValidationError("El archivo no se subio correctamente");
    
    const productos = csv2arr<CreateProducto>(req.file.path, createProducto);
    let _: void = await Producto.bulk_insert(productos);

    return res.status(201).json({
        success: true,
        data: productos
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
    if (Number(req.params.id) === null) throw new ValidationError("Parametro url invalido");

    let _: void = await Producto.update(body, Number(req.params));

    return res.status(201).json({
        success: true,
        message: "Producto actualizado correctamente"
    });
}

export default {
    get_all,
    create,
    update,
    file_insert
}