import multer from "multer";
import { ValidationError } from "../errors";
import fs from "fs";
import { Imagen } from "../models/producto.model";
import {files_path} from "../server";

export const uploadImagenProducto = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            let file_path =  files_path + "/" + Imagen.image_route;

            fs.mkdirSync(file_path, { recursive: true })
            return cb(null, file_path);
        },
        filename: (req, file, cb) => {
            const date = Date.now()
            const [name, format] = file.originalname.split('.');
            return cb(null, `${date}.${format}`);
        }
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, //10MB
    fileFilter: (_req, file, cb) => {
        if (file.mimetype != "image/jpg" && file.mimetype != "image/png")
            return cb(new ValidationError("La foto debe ser jpg o png"));

        return cb(null, true);
    }
}).single("image");