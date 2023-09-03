import multer from "multer";
import { ValidationError } from "../errors";
import fs from "fs";

let price_list_storage = multer.diskStorage({
    destination: "files/price_lists/",
    filename: (req, file, cb) => {;
        const uniqueSuffix = Date.now()
        const [name, format] = file.originalname.split('.')
        cb(null,  `${name}_${uniqueSuffix}.${format}`);
    }
});

let ficha_storage = multer.diskStorage({
    destination: "files/fichas_tecnicas/",
    filename: (req, file, cb) => {
        const id = Number(req.params.id);
        if (!id) throw new ValidationError(`Parametro '${req.params.id}' url invalido`);
        const date = Date.now()
        const [name, format] = file.originalname.split('.')
        cb(null,  `${id}_${date}_${name}.${format}`);
    }
});

export let uploadPriceListFile = multer({
    storage: price_list_storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype != "text/csv")
            cb(new ValidationError("El archivo debe ser .csv"));
        
        cb(null, true);
    }
}).single("file");

export let uploadFichaTecnicaFile = multer({
    storage: ficha_storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype != "application/pdf")
            cb(new ValidationError("El archivo debe ser .pdf"));
        
        cb(null, true);
    }
}).single("file");

/* Proveedor */
export const proveedorUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            console.log(file);
            
            let path = "files/proveedores/";
            if(file.fieldname == "photo")
                path += "images/";
            else if (file.fieldname == "ficha_tecnica")
                path += "fichas/"

            // Make the folder if not exists
            fs.mkdirSync(path, { recursive: true })
            cb(null, path);
        },
        filename: (req, file, cb) => {
            const date = Date.now()
            const [name, format] = file.originalname.split('.');
            console.log(req.body.nombre);
            
            cb(null, `${req.body.nombre}_${date}.${format}`);
        }
    }),
    fileFilter: (_req, file, cb) => {
        console.log("filefilter: ", file);
        
        if(file.fieldname == "photo"){
            if (file.mimetype != "image/jpg" && file.mimetype != "image/png")
                cb(new ValidationError("La foto debe ser jpg o png"));
        }
        else if (file.fieldname == "ficha_tecnica"){
            if (file.mimetype != "application/pdf")
                cb(new ValidationError("La ficha tecnica debe ser .pdf"));
        }else{
            cb(new ValidationError("filefilter: No se acepta ningun otro archivo que no sea ficha_tecnica o photo, se encontro "+file.fieldname));
        }

        cb(null, true);
    }
}).fields([
    {
        name: 'ficha_tecnica',
        maxCount: 1
    },
    {
        name:'photo',
        maxCount: 1
    }
]);