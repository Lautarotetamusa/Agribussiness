import {z} from "zod";

export const roles = {
    admin: 'admin',
    cliente: 'cliente',
    colaborador: 'colaborador'
} as const;
export type RolesKeys = keyof typeof roles;
const rolesKeys = Object.keys(roles) as [RolesKeys];

export const createUser = z.object({
    cedula: z.string(),
    password: z.string(),
    nombre: z.string(),
    correo: z.string().email(),
    telefono: z.string().min(10).optional(),
    direccion: z.string(),
    rol: z.enum(rolesKeys)
});

export const createColaborador = createUser.extend({
    id_depto: z.number(),
    cod_zona: z.number()
});

export const loginUser = z.object({
    cedula: z.string(),
    password: z.string()
});

export const updateUser = z.object({
    cedula: z.string().optional(),
    password: z.string().optional(),
    nombre: z.string().optional(),
    correo: z.string().email().optional(),
    telefono: z.string().min(10).optional(),
    direccion: z.string().optional(),
});

export const updateColaborador = updateUser.extend({
    id_depto: z.number().optional(),
    cod_zona: z.number().optional()
});

export type CreateUser = z.infer<typeof createUser>;
export type LoginUser = z.infer<typeof loginUser>;
export type UpdateUser = z.infer<typeof updateUser>;
export type CreateColaborador = z.infer<typeof createColaborador>;
export type UpdateColaborador = z.infer<typeof updateColaborador>;