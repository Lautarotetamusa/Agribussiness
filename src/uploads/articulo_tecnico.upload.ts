import { uploadBuilder } from "../uploads";
import { filePaths } from "../schemas/files.schema";

export const articuloTecnicoUpload = uploadBuilder(filePaths.articulosTecnicos, ["image/jpg", "image/jpeg", "image/png"]).single("image");  
