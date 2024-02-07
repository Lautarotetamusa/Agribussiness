import { filePaths } from "../schemas/files.schema";
import { uploadBuilder } from "../uploads";

export const eventoUpload = uploadBuilder(filePaths.eventos, ["image/jpg", "image/png", "image/jpeg"]).single("image");
