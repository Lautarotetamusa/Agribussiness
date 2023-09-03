import {BaseModel} from './base.model';
import { IProveedor, CProveedor } from '../schemas/proveedor.schema';

export class Proveedor extends BaseModel{
    static table_name: string = "Proveedores"; 
    static pk: string = "id_proveedor";

    id_proveedor: number;
    nombre: string;
    photo?: string;
    ficha_tecnica?: string;

    constructor(body: IProveedor){
        super();
        this.id_proveedor = body.id_proveedor
        this.nombre = body.nombre;
        this.photo = body.photo;
        this.ficha_tecnica = body.ficha_tecnica
    }

    static async create(body: CProveedor): Promise<Proveedor>{
        return await this._insert<CProveedor, Proveedor>(body);
    }

    static async get_one(id_proveedor: number): Promise<Proveedor>{
        return await this.find_one<IProveedor, Proveedor>({id_proveedor: id_proveedor})
    }

    static async get_all(): Promise<IProveedor[]>{
        return await this.find_all<IProveedor>();
    }
}