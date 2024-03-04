import {z} from "zod";

const iEvento = z.object({
    id_evento: z.number(),
    titulo: z.string().max(128, {message: "El titulo es demasiado largo"}).min(1, {message: "El titulo es obligatorio"}),
    descripcion: z.string().max(1024, {message: "La descripcion es demasiado larga"}).min(1, {message: "La descripcion es obligatoria"}),
    fecha_creacion: z.date(),
    image: z.string().optional().nullable(),
});
export type IEvento = z.infer<typeof iEvento>;

export const createEvento = iEvento.omit({
    id_evento: true, 
    image: true, 
    fecha_creacion: true
});
export type CreateEvento = z.infer<typeof createEvento>;

export const updateEvento = createEvento.partial();
export type UpdateEvento = z.infer<typeof updateEvento>;
