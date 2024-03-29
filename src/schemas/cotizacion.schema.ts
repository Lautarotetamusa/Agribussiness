import {z} from "zod";

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
    colaborador: z.string().max(10).min(1, {message: "Debes ingresar un colaborador"}),
    cliente: z.string().max(10).min(1, {message: "Debes ingresar un cliente"}).optional(),
    cliente_nuevo: z.string().max(64).min(1, {message: "Debes ingresar un cliente"}).optional(),
    file: z.string(),
    forma_pago: z.enum(Object.keys(formas_pago) as [FormaPago]),
    tiempo_entrega: z.number().min(1),
    disposiciones: z.string()
});

const iproductosCotizacion = z.object({
    nro_cotizacion: z.number(),
    id_producto: z.number(),
    cantidad: z.number(),
    precio_final: z.number()
});
export const createProductosCotizacion = iproductosCotizacion.omit({
    nro_cotizacion: true
}).extend({
    precio_final: z.number().optional()
});

export const createCotizacion = iCotizacion.omit({
    nro_cotizacion: true,
    fecha_creacion: true,
    estado: true,
    file: true
}).extend({
    forma_pago: z.enum(Object.keys(formas_pago) as [FormaPago]).default(formas_pago.Contado),
    tiempo_entrega: z.number().min(1).default(1),
}).refine(schema => !(
    schema.cliente !== undefined && schema.cliente_nuevo !== undefined
),  "Una cotizacion no puede tener dos clientes")
.refine(schema => !(
    schema.cliente === undefined && schema.cliente_nuevo === undefined
), "Una cotizacion necesita al menos un cliente");

export const updateCotizacion = createCotizacion;
export type UpdateCotizacion = z.infer<typeof updateCotizacion>;

export type ICotizacion = z.infer<typeof iCotizacion>;
export type CreateCotizacion = z.infer<typeof createCotizacion>;
export type ProductosCotizacion = z.infer<typeof iproductosCotizacion>;

const createProds = createProductosCotizacion.extend({precio_final: z.number()});
export type CreateProductosCotizacion = z.infer<typeof createProductosCotizacion>;
const productosCotizacionArchivo = createProductosCotizacion.extend({
    precio_final: z.number(),
    nombre: z.string()
})
export type ProductosCotizacionArchivo = z.infer<typeof productosCotizacionArchivo>;
