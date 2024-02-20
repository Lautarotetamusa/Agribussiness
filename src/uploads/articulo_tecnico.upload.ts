import { filePaths } from "../schemas/files.schema";
import { uploadBuilder } from "../uploads";

export const articuloTecnicoUpload = uploadBuilder(
    filePaths.articulosTecnicos, 
    ["image/jpg", "image/jpeg", "image/png"],
    5*1024*1024
).single("image");  
