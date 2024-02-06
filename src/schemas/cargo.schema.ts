import {z} from "zod";

export const cargosNames = {
    gerenteGeneral: "Gerente General",
    gerenteAdministrativo: "Gerente Administrativo", // Solo al general
    coordinadorDeVentasYDesarollo: "Coordinador de Ventas y Desarollo", // Gerentes (de aca para abajo)
    representanteTecnicoComercial: "Representante Técnico Comercial",  
    asistenteTecnicoComercial: "Asistente Técnico Comercial",
    asistenteDeGerencia: "Asistente de Gerencia",
    asistenteDeDespacho: "Asistente de Despacho", 
    encargadoDeMarketing: "Encargado de Marketing",
    encargadoDeLogistica: "Encargado de Logística",
    encargadoDeCompras: "Encargado de compras"
} as const;
export type CargoName = typeof cargosNames[keyof typeof cargosNames];
const cargosKeys = Object.values(cargosNames) as [CargoName];

const iCargo = z.object({
    cod_cargo: z.number(),
    id_depto: z.number(),
    nombre: z.enum(cargosKeys) 
});
export type iCargo = z.infer<typeof iCargo>;
