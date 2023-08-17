import {BaseModel} from './base.model';
import {z} from "zod";

export const retrieveDepartamento = z.object({
    cod_zona: z.number(),
    nombre: z.string()
});

export type RetrieveDepartamento = z.infer<typeof retrieveDepartamento>;

export class Departamento extends BaseModel{
    static table_name: string = "Departamentos"; 

    id_depto: number;
    nombre: string;

    constructor(body: RetrieveDepartamento){
        super();
        this.id_depto = body.cod_zona;
        this.nombre = body.nombre;
    }

    static async get_one(id_depto: number): Promise<Departamento>{
        return await this.find_one<RetrieveDepartamento, Departamento>({id_depto: id_depto})
    }
}