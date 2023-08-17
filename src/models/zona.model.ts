import {BaseModel} from './base.model';
import {z} from "zod";

export const retrieveZona = z.object({
    cod_zona: z.number(),
    nombre: z.string()
});

export type RetrieveZona = z.infer<typeof retrieveZona>;

export class Zona extends BaseModel{
    static table_name: string = "Zonas"; 

    cod_zona: number;
    nombre: string;

    constructor(body: RetrieveZona){
        super();
        this.cod_zona = body.cod_zona;
        this.nombre = body.nombre;
    }

    static async get_one(cod_zona: number): Promise<Zona>{
        return await this.find_one<RetrieveZona, Zona>({cod_zona: cod_zona})
    }
}