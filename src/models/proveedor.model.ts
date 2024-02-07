import {BaseModel} from './base.model';
import { IProveedor, CProveedor } from '../schemas/proveedor.schema';
import { LineaNegocio } from './linea_negocio.model';
import { files_url } from '../server';
import { filePaths } from '../schemas/files.schema';

export class Proveedor extends BaseModel{
    static table_name: string = "Proveedores"; 
    static pk: string = "id_proveedor";
    static fields = ["id_proveedor", "id_linea", "nombre", "photo"];
    static photo_route = filePaths.proveedores;

    id_proveedor: number;
    nombre: string;
    photo: string;
    id_linea: number;
    linea_negocio?: LineaNegocio;

    constructor(body: IProveedor){
        super();
        this.id_proveedor = body.id_proveedor
        this.nombre = body.nombre;
        this.photo = body.photo;
        this.id_linea = body.id_linea;
    }

    private parse_path(){
        this.photo = `${files_url}/${Proveedor.photo_route}/${this.photo}`;
    }

    static async create(body: CProveedor): Promise<Proveedor>{
        const linea_negocio = await LineaNegocio.get_one(body.id_linea);

        const proveedor = await this._insert<CProveedor, Proveedor>(body);
        proveedor.linea_negocio = linea_negocio;
        proveedor.parse_path();
        return proveedor;
    }

    static async get_one(id_proveedor: number): Promise<Proveedor>{
        const proveedor = await this.find_one<IProveedor, Proveedor>({id_proveedor: id_proveedor})
        proveedor.parse_path();
        return proveedor;
    }

    static async get_all(): Promise<IProveedor[]>{
        const proveedores = await this.find_all<IProveedor>();
        proveedores.map(p => p.photo = `${files_url}/${Proveedor.photo_route}/${p.photo}`);
        return proveedores;
    }

    async get_linea(){
        const linea_negocio = await LineaNegocio.get_one(this.id_linea);
        this.linea_negocio = linea_negocio;
        return linea_negocio;
    }
}
