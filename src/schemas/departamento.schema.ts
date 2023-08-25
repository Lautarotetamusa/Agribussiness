import z from 'zod';

export const retrieveDepartamento = z.object({
    id_depto: z.number(),
    nombre: z.string(),
    telefono: z.string().length(15)
});
export type RetrieveDepartamento = z.infer<typeof retrieveDepartamento>;

export type ColaboradoresDepto = Array<{
    cedula: string,
    nombre: string,
    correo: string,
    telefono: string,
    direccion: string
}>