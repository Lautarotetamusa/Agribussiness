import multer from "multer";
import { ValidationError } from "../errors";
import fs from "fs";
import { Proveedor } from "../models/proveedor.model";
import {files_path} from "../server";

export const proveedorUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            let file_path = files_path;
            
            if(file.fieldname == "photo")
                file_path += "/" + Proveedor.photo_route;

            // Make the folder if not exists
            fs.mkdirSync(file_path, { recursive: true })
            return cb(null, file_path);
        },
        filename: (req, file, cb) => {
            const date = Date.now()
            const [_, format] = file.originalname.split('.');
            
            return cb(null, `${date}.${format}`);
        }
    }),
    fileFilter: (_req, file, cb) => {
        if(file.fieldname == "photo"){
            if (
                file.mimetype != "image/jpg" && 
                file.mimetype != "image/png" &&
                file.mimetype != "image/jpeg"
            )
                return cb(new ValidationError("La foto debe ser jpg, jpeg o png"));
        }else{
            return cb(new ValidationError("No se acepta ningun otro archivo que no sea photo, se encontro "+file.fieldname));
        }

        return cb(null, true);
    }
}).fields([
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
