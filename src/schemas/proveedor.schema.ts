import {z} from "zod";

const iProveedor = z.object({
    id_proveedor: z.number(),
    nombre: z.string(),
    photo: z.string(),
    id_linea: z.number()
    //ficha_tecnica: z.string().optional()
});
export type IProveedor = z.infer<typeof iProveedor>;

export const cProveedor = iProveedor.omit({id_proveedor: true});
export type CProveedor = z.infer<typeof cProveedor>;