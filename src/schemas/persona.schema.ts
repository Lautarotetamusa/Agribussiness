import {z} from "zod";
import { Departamento } from "../models/departamento.model";

export const roles = {
    'admin': 0,
    'cliente': 1,
    'colaborador': 2
} as const;
type ObjectValues<T> = T[keyof T];
type ObjectKeys<T> = keyof T;

export type RolesValues = ObjectValues<typeof roles>;
export type RolesKeys = ObjectKeys<typeof roles>;

//export type RolPersona = typeof roles[number];

export const createUser = z.object({
    cedula: z.string(),
    password: z.string(),
    id_depto: z.number(),
    cod_zona: z.number(),
    nombre: z.string(),
    correo: z.string().email(),
    telefono: z.string().min(10).optional(),
    direccion: z.string(),
    rol: z.enum(['admin', 'cliente', 'colaborador'])
});

export type CreateUser = z.infer<typeof createUser>;