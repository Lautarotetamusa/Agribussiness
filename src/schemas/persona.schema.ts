import {z} from "zod";

type ObjectValues<T> = T[keyof T];
type ObjectKeys<T> = keyof T;

export const roles = {
    admin: 'admin',
    cliente: 'cliente',
    colaborador: 'colaborador'
} as const;
export type RolesKeys = ObjectKeys<typeof roles>;
const rolesKeys = Object.keys(roles) as [RolesKeys];

export const createUser = z.object({
    cedula: z.string(),
    password: z.string(),
    id_depto: z.number(),
    cod_zona: z.number(),
    nombre: z.string(),
    correo: z.string().email(),
    telefono: z.string().min(10).optional(),
    direccion: z.string(),
    rol: z.enum(rolesKeys)
});

export const loginUser = z.object({
    cedula: z.string(),
    password: z.string()
});

export const updateUser = z.object({
    cedula: z.string().optional(),
    password: z.string().optional(),
    id_depto: z.number().optional(),
    cod_zona: z.number().optional(),
    nombre: z.string().optional(),
    correo: z.string().email().optional(),
    telefono: z.string().min(10).optional(),
    direccion: z.string().optional(),
});

export type CreateUser = z.infer<typeof createUser>;
export type LoginUser = z.infer<typeof loginUser>;
export type UpdateUser = z.infer<typeof updateUser>;