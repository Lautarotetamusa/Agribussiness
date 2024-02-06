import z from 'zod';
import { createColaborador } from './persona.schema';

const retrieveDepartamento = z.object({
    id_depto: z.number(),
    nombre: z.string(),
    telefono: z.string().length(15)
});
export type RetrieveDepartamento = z.infer<typeof retrieveDepartamento>;

const colaboradoresDepto = createColaborador.pick({
    cedula: true,
    nombre: true,
    correo: true,
    telefono: true,
    direccion: true
});
export type ColaboradoresDepto = z.infer<typeof colaboradoresDepto>;
