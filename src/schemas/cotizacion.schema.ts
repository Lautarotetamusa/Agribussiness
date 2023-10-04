import {number, z} from "zod";

export const estados = {
    creada: "creada",
    aprobada: "aprobada"
} as const;
export type EstadoKeys = keyof typeof estados;
const formas_pago = {
    "Contado": "Contado",
    "Credito 15": "Credito 15",
    "Credito 30": "Credito 30",
    "Credito 45": "Credito 45"
} as const;
export type FormaPago = keyof typeof formas_pago;

export const iCotizacion = z.object({
    nro_cotizacion: z.number(),
    fecha_creacion: z.date(),
    estado: z.enum(Object.keys(estados) as [EstadoKeys]),
    colaborador: z.string().max(10),
    cliente: z.string().max(10),
    file: z.string(),
    forma_pago: z.enum(Object.keys(formas_pago) as [FormaPago]),
    tiempo_entrega: z.number().max(9).min(1)
});

const iproductosCotizacion = z.object({
    nro_cotizacion: z.number(),
    id_producto: z.number(),
    cantidad: z.number(),
    precio_final: z.number()
});
export const  createProductosCotizacion = iproductosCotizacion.omit({nro_cotizacion: true});

export const createCotizacion = iCotizacion.omit({
    nro_cotizacion: true,
    fecha_creacion: true,
    estado: true,
    file: true
}).extend({
    forma_pago: z.enum(Object.keys(formas_pago) as [FormaPago]).default(formas_pago.Contado),
    tiempo_entrega: z.number().max(9).min(1).default(1),
});

export type ICotizacion = z.infer<typeof iCotizacion>;
export type CreateCotizacion = z.infer<typeof createCotizacion>;
export type ProductosCotizacion = z.infer<typeof iproductosCotizacion>;
export type CreateProductosCotizacion = z.infer<typeof createProductosCotizacion>;