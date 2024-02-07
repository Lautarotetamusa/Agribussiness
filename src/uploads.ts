import multer from "multer";
import { ValidationError } from "./errors";
import fs from "fs";
import {files_path} from "./server";
import { FilePath } from "./schemas/files.schema";

type MimeTypes = 
      "image/jpg"  
	| "image/png" 
    | "image/jpeg"
    | "text/csv"
    | "application/pdf";

export const uploadBuilder = (path: FilePath, validTypes: MimeTypes[], size: number = 10*1024*1024) => {
    const storage = multer.diskStorage({
        destination: (_req, _file, cb) => {
            const file_path =  files_path + "/" + path;

            fs.mkdirSync(file_path, { recursive: true })
            return cb(null, file_path);
        },
        filename: (_req, file, cb) => {
            const date = Date.now()
            const [_, format] = file.originalname.split('.');
            return cb(null, `${date}.${format}`);
        }
    });
    return multer({
        storage: storage,
        limits: { fileSize: size }, 
        fileFilter: (_req, file, cb) => {
            console.log(file.mimetype, typeof file.mimetype);
            console.log(validTypes);
            if (!validTypes.includes(file.mimetype as MimeTypes)){
                const formats = validTypes.map(t => t.split('/')[1]).join(', ');
                return cb(new ValidationError(`El archivo solo puede ser de los siguientes formatos: ${formats}`));
            }

            return cb(null, true);
        }
    });
}
