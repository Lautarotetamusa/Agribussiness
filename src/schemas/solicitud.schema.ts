import {number, z} from "zod";

const iSolicitud = z.object({
    cod_solicitud: z.number(),
    solicitante: z.string(),
    solicitado: z.string(),
    fecha_creacion: z.date(),
    descripcion: z.string(),
    aceptada: z.boolean(),
});
export const createSolicitud = iSolicitud.omit({cod_solicitud: true});

export type ISolicitud = z.infer<typeof iSolicitud>;
export type CreateSolicitud = z.infer<typeof createSolicitud>;

