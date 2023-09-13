import {z} from "zod";

const iEvento = z.object({
    id_evento: z.number(),
    titulo: z.string().max(128),
    descripcion: z.string().max(1024),
    fecha_creacion: z.date(),
    image: z.string().optional().nullable(),
});
export type IEvento = z.infer<typeof iEvento>;

export const createEvento = iEvento.omit({id_evento: true, image: true, fecha_creacion: true});
export type CreateEvento = z.infer<typeof createEvento>;

export const updateEvento = createEvento.partial();
export type UpdateEvento = z.infer<typeof updateEvento>;