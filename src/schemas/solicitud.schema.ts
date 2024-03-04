import {z} from "zod";

const iSolicitud = z.object({
    cod_solicitud: z.number(),
    solicitante: z.string().min(1, {message: "Debes ingresar un solicitante"}),
    solicitado: z.string().min(1, {message: "Debes ingresar un solicitado"}),
    fecha_creacion: z.date(),
    descripcion: z.string().min(1, {message: "La descripcion es obligatoria"}),
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

