import multer from "multer";
import { ValidationError } from "../errors";
import fs from "fs";
import { Evento } from "../models/evento.model";
import {files_path} from "../server";
import { uploadBuilder } from "../uploads";

export const eventoUpload = uploadBuilder(Evento.image_route, ["image/jpg", "image/png", "image/jpeg"], "image");
