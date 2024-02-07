import multer from "multer";
import { ValidationError } from "../errors";
import { Producto } from "../models/producto.model";
import { files_path } from "../server";

const price_list_storage = multer.diskStorage({
    destination: "files/price_lists/",
    filename: (req, file, cb) => {;
        const date = Date.now()
        const [name, format] = file.originalname.split('.')
        return cb(null,  `${name}_${date}.${format}`);
    }
});

const ficha_storage = multer.diskStorage({
    destination: files_path + "/" + Producto.fichaTecnicaPath,
    filename: (req, file, cb) => {
        const id = Number(req.params.id);
        const date = Date.now();
        const [_, format] = file.originalname.split('.')
        cb(null,  `${id}_${date}.${format}`);
    }
});

export let uploadPriceListFile = multer({
    storage: price_list_storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype != "text/csv")
            return cb(new ValidationError("El archivo debe ser .csv"));
        
        cb(null, true);
    }
}).single("file");

export let uploadFichaTecnicaFile = multer({
    storage: ficha_storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype != "application/pdf")
            return cb(new ValidationError("El archivo debe ser .pdf"));
        
        cb(null, true);
    }
}).single("file");
