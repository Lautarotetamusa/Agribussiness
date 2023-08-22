import {number, z} from "zod";

export const createProducto = z.object({
    precio: z.number(),
    nombre: z.string(),
    presentacion: z.string(),
    descripcion: z.string()

});
export type CreateProducto = z.infer<typeof createProducto>;

const buildProducto = createProducto.extend({
    id_producto: z.number()
})
export type BuildProducto = z.infer<typeof buildProducto>;