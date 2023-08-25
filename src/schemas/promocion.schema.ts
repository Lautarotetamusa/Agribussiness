import z from 'zod';

export const createPromocion = z.object({
    cod_zona: z.number(),
    titulo: z.string(),
    fecha_expiracion: z.date(),
    descripcion: z.string()
});
export type CreatePromocion = z.infer<typeof createPromocion>;
const iPromocion = createPromocion.extend({
    id_depto: z.number(),
})
export type iPromocion = z.infer<typeof iPromocion>;