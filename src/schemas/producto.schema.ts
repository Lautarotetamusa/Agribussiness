import {number, z} from "zod";

export const createProducto = z.object({
    precio: z.number(),
    nombre: z.string(),
    presentacion: z.string(),
    descripcion: z.string(),
    id_proveedor: z.number()
});

export const updateProducto = createProducto.partial().extend({
    ficha_tecnica: z.string().optional()
});

const buildProducto = createProducto.extend({
    id_producto: z.number(),
    ficha_tecnica: z.string().optional().nullable()
});

export const ListProducto = buildProducto.extend({
    nombre_proveedor: z.string()
});

export type ListProducto = z.infer<typeof ListProducto>;

export type CreateProducto = z.infer<typeof createProducto>;
export type BuildProducto  = z.infer<typeof buildProducto>;
export type UpdateProducto = z.infer<typeof updateProducto>;
 