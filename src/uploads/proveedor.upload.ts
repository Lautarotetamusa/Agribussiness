import { filePaths } from "../schemas/files.schema";
import { uploadBuilder } from "../uploads";

export const proveedorUpload = uploadBuilder(
    filePaths.proveedores, 
    ["image/jpg", "image/jpeg", "image/png"],
    5*1024*1024
).fields([
    {
        name:'photo',
        maxCount: 1
    },
    {
        name: "nombre",
        maxCount: 1
    },{
        name: "id_linea",
        maxCount: 1
    }
]);
