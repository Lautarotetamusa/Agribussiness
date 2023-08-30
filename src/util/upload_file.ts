import multer from "multer";
import { ValidationError } from "../errors";

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