import {z} from "zod";

export const roles = {
    admin: 'admin',
    cliente: 'cliente',
    colaborador: 'colaborador',
    invitado: 'invitado'
} as const;
export type RolesKeys = keyof typeof roles;
const rolesKeys = Object.keys(roles) as [RolesKeys];

const iImagen = z.object({
    id_producto: z.number(),
    nro_imagen: z.number(),
    path: z.string(),
    comentarios: z.string()
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
    telefono: z.string().optional(),
    direccion: z.string(),
    rol: z.enum(rolesKeys)
});
const tokenData = createUser.pick({
    cedula: true,
    nombre: true,
    rol: true
});

export const createColaborador = createUser.extend({
    cod_cargo: z.number()
});

export const loginUser = createUser.pick({
    cedula: true, 
    password: true
}).and(z.object({
    expo_token: z.string().optional()
}));

export const logoutUser = createUser.pick({
    cedula: true, 
}).and(z.object({
    expo_token: z.string()
}));

export const updateUser = createUser.omit({rol: true}).partial();

export const updateColaborador = createColaborador.partial();

const retrieveColaborador = createColaborador.pick({
    cedula: true,
    nombre: true,
    correo: true,
    telefono: true,
    direccion: true
});
export type RetrieveColaborador = z.infer<typeof retrieveColaborador>;

export type CreateUser = z.infer<typeof createUser>;
export type TokenData = z.infer<typeof tokenData>;
export type LoginUser = z.infer<typeof loginUser>;
export type UpdateUser = Partial<CreateUser>;
export type CreateColaborador = z.infer<typeof createColaborador>;
export type UpdateColaborador = Partial<CreateColaborador>;

export type IImagen = z.infer<typeof iImagen>;
export type CreateImagen = z.infer<typeof createImagen>;
