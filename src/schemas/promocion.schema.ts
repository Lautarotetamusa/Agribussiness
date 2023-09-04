import z from 'zod';

export const createPromocion = z.object({
    cod_zona: z.number(),
    titulo: z.string(),
    fecha_expiracion: z.coerce.date(),
    descripcion: z.string()
});
export type CreatePromocion = z.infer<typeof createPromocion>;

const iPromocion = createPromocion.extend({
    id_promo: z.number(),
})
export type iPromocion = z.infer<typeof iPromocion>;

export const uPromocion = createPromocion.partial();

export type UPromocion = Partial<CreatePromocion>;