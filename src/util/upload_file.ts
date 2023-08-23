import multer from "multer";
import { ValidationError } from "../errors";

let storage = multer.diskStorage({
    destination: "files/price_lists/",
    filename: (req, file, cb) => {;
        const uniqueSuffix = Date.now()
        const [name, format] = file.originalname.split('.')
        cb(null,  `${name}_${uniqueSuffix}.${format}`);
    }
});

export let uploadFile = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype != "text/csv")
            cb(new ValidationError("El archivo debe ser .csv"));
        
        cb(null, true);
    }
}).single("file");