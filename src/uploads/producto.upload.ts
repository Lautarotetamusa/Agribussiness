import { filePaths } from "../schemas/files.schema";
import { uploadBuilder } from "../uploads";

export const uploadImagenProducto = uploadBuilder(filePaths.imagenes, ["image/jpg", "image/jpeg", "image/png"]).single("image");

export const uploadPriceListFile = uploadBuilder(filePaths.priceLists, ["text/csv"], 2*1024*1024).single("file");

export const uploadFichaTecnicaFile = uploadBuilder(filePaths.fichasTecnicas, ["application/pdf"], 2*1024*1024).single("file");
