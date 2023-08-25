import {BaseModel} from './base.model';
import {z} from "zod";

export const createFichaTecnica = z.object({
    archivo: z.string(),
    id_producto: z.number()
});
export const retrieveFichaTecnica = createFichaTecnica.extend({
    id_ficha: z.number(),
    fecha: z.date(),
});
export type RetrieveFichaTecnica = z.infer<typeof retrieveFichaTecnica>;
export type CreateFichaTecnica = z.infer<typeof createFichaTecnica>;

export class FichaTecnica extends BaseModel{
    static table_name: string = "FichaTecnica"; 

    id_ficha: number;
    fecha: Date;
    archivo: string;

    constructor(body: RetrieveFichaTecnica){
        super();
        this.id_ficha = body.id_ficha;
        this.fecha = body.fecha;
        this.archivo = body.archivo
    }

    static async get_one(id_ficha: number): Promise<FichaTecnica>{
        return await this.find_one<RetrieveFichaTecnica, FichaTecnica>({id_ficha: id_ficha})
    }

    static async create(req: CreateFichaTecnica): Promise<FichaTecnica>{
        return await this._insert<CreateFichaTecnica, FichaTecnica>(req);
    }

    static async get_all(): Promise<RetrieveFichaTecnica[]>{
        return await this.find_all<RetrieveFichaTecnica>();
    }
}