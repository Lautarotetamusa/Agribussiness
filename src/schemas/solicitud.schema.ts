import {number, z} from "zod";

const iSolicitud = z.object({
    cod_solicitud: z.number(),
    solicitante: z.string(),
    solicitado: z.string(),
    fecha_creacion: z.date(),
    descripcion: z.string(),
    aceptada: z.boolean(),
});
export const createSolicitud = iSolicitud.omit({cod_solicitud: true, fecha_creacion: true, aceptada: true});
const listSolicitudesColaborador = iSolicitud.omit({solicitante: true});

export type ISolicitud = z.infer<typeof iSolicitud>;
export type CreateSolicitud = z.infer<typeof createSolicitud>;
export type ListSolicitudesColaborador = z.infer<typeof listSolicitudesColaborador>;

export const tipoSolicitud = {
    enviada: "enviada", 
    recibida: "recibida"
} as const;
export type TipoSolicitud = keyof typeof tipoSolicitud;

