import {z} from "zod";

const articuloTecnicoSchema = z.object({
    id: z.number(),
    titulo: z.string().max(128),
    descripcion: z.string().max(1024),
    fecha_creacion: z.date(),
    url: z.string().url(),
    image: z.string().optional().nullable(),
});
export type ArticuloTecnicoSchema = z.infer<typeof articuloTecnicoSchema>;

export const createArticuloTecnico = articuloTecnicoSchema.omit({
    id: true, 
    image: true, 
    fecha_creacion: true
});

export type CreateArticuloTecnico = z.infer<typeof createArticuloTecnico>;

export const updateArticuloTecnico = createArticuloTecnico.partial();
export type UpdateArticuloTecnico = z.infer<typeof updateArticuloTecnico>;
