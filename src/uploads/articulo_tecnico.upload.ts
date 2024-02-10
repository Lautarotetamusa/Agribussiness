import { filePaths } from "../schemas/files.schema";
import { uploadBuilder } from "../uploads";

export const articuloTecnicoUpload = uploadBuilder(filePaths.articulosTecnicos, ["image/jpg", "image/jpeg", "image/png"]).single("image");  
