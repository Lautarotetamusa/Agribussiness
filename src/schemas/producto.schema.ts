import {z} from "zod";

export const createProducto = z.object({
    precio: z.number(),
    nombre: z.string().min(1, {message: "El nombre es obligatorio"}),
    presentacion: z.string().min(1, {message: "La presentacion es obligatoria"}),
    descripcion: z.string().min(1, {message: "La descripcion es obligatoria"}),
    id_proveedor: z.number(),
    iva: z.number().min(0).max(100).default(0)
});

export const updateProducto = createProducto.partial().extend({
    ficha_tecnica: z.string().optional(),
    portada: z.string().optional()
});

const buildProducto = createProducto.extend({
    id_producto: z.number(),
    ficha_tecnica: z.string().optional().nullable(),
    portada: z.string().optional().nullable()
});

export const ListProducto = buildProducto.extend({
    nombre_proveedor: z.string()
});

export type ListProducto = z.infer<typeof ListProducto>;
export type CreateProducto = z.infer<typeof createProducto>;
export type BuildProducto  = z.infer<typeof buildProducto>;
export type UpdateProducto = z.infer<typeof updateProducto>;
