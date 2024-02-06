import z from 'zod';

const retrieveDepartamento = z.object({
    id_depto: z.number(),
    nombre: z.string(),
    telefono: z.string().length(15)
});
export type RetrieveDepartamento = z.infer<typeof retrieveDepartamento>;
