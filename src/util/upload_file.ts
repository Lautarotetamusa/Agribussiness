import { uploadBuilder } from "../uploads";
import { filePaths } from "../schemas/files.schema";

export const uploadPriceListFile = uploadBuilder(filePaths.priceLists, ["text/csv"], "file", 2*1024*1024);

export const uploadFichaTecnicaFile = uploadBuilder(filePaths.fichasTecnicas, ["application/pdf"], "file", 2*1024*1024);
