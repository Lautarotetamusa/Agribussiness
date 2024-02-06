import z from 'zod';

export const createPromocion = z.object({
    cod_zona: z.number(),
    titulo: z.string(),
    fecha_expiracion: z.coerce.date(),
    descripcion: z.string()
});
export type CreatePromocion = z.infer<typeof createPromocion>;

const promocionSchema = createPromocion.extend({
    id_promo: z.number(),
})
export type PromocionSchema = z.infer<typeof promocionSchema>;

export const updatePromocion = createPromocion.partial();

export type UpdatePromocion = Partial<CreatePromocion>;
