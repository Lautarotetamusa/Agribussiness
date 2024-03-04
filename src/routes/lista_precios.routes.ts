import { Router,  Request, Response } from "express"
import { Producto } from "../models/producto.model";
import { generateListaPreciosPDF } from "../util/generate_lista_precios";

const router = Router();

const createListaPrecios = async (req: Request, res: Response): Promise<Response> => {
    const productos = await Producto.get_all();
    const filePath = generateListaPreciosPDF(productos);

    return res.status(201).json({
        success: true,
        message: "Lista de precios creada con exito",
        data: {
            url: filePath
        }
    });
}

router.get('/', createListaPrecios);

export default router;
