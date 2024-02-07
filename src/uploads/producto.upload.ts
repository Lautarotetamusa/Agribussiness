import { Imagen } from "../models/producto.model";
import { filePaths } from "../schemas/files.schema";
import { uploadBuilder } from "../uploads";

export const uploadImagenProducto = uploadBuilder(filePaths.imagenes, ["image/jpg", "image/jpeg", "image/png"], "image")
