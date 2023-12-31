import {z} from "zod";

export const roles = {
    admin: 'admin',
    cliente: 'cliente',
    colaborador: 'colaborador'
} as const;
export type RolesKeys = keyof typeof roles;
const rolesKeys = Object.keys(roles) as [RolesKeys];

const iImagen = z.object({
    id_producto: z.number(),
    nro_imagen: z.number(),
    path: z.string()
});

const createImagen = iImagen.omit({
    nro_imagen: true,
});

export const createUser = z.object({
    cedula: z.string(),
    cod_zona: z.number(),
    password: z.string(),
    nombre: z.string(),
    correo: z.string().email(),
    telefono: z.string().min(10).optional(),
    direccion: z.string(),
    rol: z.enum(rolesKeys)
});

export const createColaborador = createUser.extend({
    cod_cargo: z.number()
});

export const loginUser = createUser.pick({cedula: true, password: true});

export const updateUser = createUser.omit({rol: true}).partial();

export const updateColaborador = createColaborador.partial();

export type CreateUser = z.infer<typeof createUser>;
export type LoginUser = z.infer<typeof loginUser>;
export type UpdateUser = Partial<CreateUser>;
export type CreateColaborador = z.infer<typeof createColaborador>;
export type UpdateColaborador = Partial<CreateColaborador>;

export type IImagen = z.infer<typeof iImagen>;
export type CreateImagen = z.infer<typeof createImagen>;