import {number, z} from "zod";

export const createProducto = z.object({
    precio: z.number(),
    nombre: z.string(),
    presentacion: z.string(),
    descripcion: z.string()
});

export const updateProducto = z.object({
    precio: z.number().optional(),
    nombre: z.string().optional(),
    presentacion: z.string().optional(),
    descripcion: z.string().optional()
})

const buildProducto = createProducto.extend({
    id_producto: z.number()
})

export type CreateProducto = z.infer<typeof createProducto>;
export type BuildProducto  = z.infer<typeof buildProducto>;
export type UpdateProducto = z.infer<typeof updateProducto>;