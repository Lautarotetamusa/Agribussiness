import { sql } from "../db";
import { z } from "zod";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ErrorResponse, notFound } from "../errors";
import { Persona } from "./persona.model";
import { TokenData, roles } from "../schemas/persona.schema";

const table_name = "Chats";

const iChat = z.object({
    id: z.number(),
    persona_1: z.string().max(10),
    persona_2: z.string().max(10)
});
type IChat = z.infer<typeof iChat>;

const chat = z.object({
    chat_id: z.number(),
    reciver: z.string().max(10),
    reciver_name: z.string()
});
const chatKeys = Object.keys(chat) as [keyof typeof chat];
type Chat = z.infer<typeof chat>;

const chat_message = z.object({
    //chat_id: z.number(),
    message: z.string(),
    sender: z.string().max(10),
    created_at: z.date()
});
type ChatMessage = z.infer<typeof chat_message>;

/**
    @returns chat_id 
    Esta funcion nos devuelve el chat_id entre dos personas 
    Si el chat no existe, lo crea y devuelve su id
*/
export async function get_chat(persona_1: string, persona_2: string): Promise<number | ErrorResponse>{
    let query = `
        SELECT id
        FROM ${table_name}
        WHERE persona_1 = ? AND persona_2 = ?
        OR persona_2 = ? AND persona_1 = ?
    `;

    const [rows] = await sql.query<RowDataPacket[]>(query, [persona_1, persona_2, persona_1, persona_2]);

    if (rows.length > 0){ //El chat ya existe
        return rows[0].id
    }

    //No existe el chat, vamos a crear uno nuevo
    query = `
        INSERT INTO ${table_name}
        (persona_1, persona_2) VALUES (?, ?)
    `;

    try{
        const [result] = await sql.query<ResultSetHeader>(query, [persona_1, persona_2]);
        return result.insertId;
    }catch(error: any){
        console.log("ERROR: ", error);
        return notFound(`La persona con cedula ${persona_1} o ${persona_2} no existe`);
    }
}

export async function get_one(id: number): Promise<IChat>{
   const query = `
        SELECT *
        FROM ${table_name}
        WHERE id = ?
   `; 

    const [rows] = await sql.query<RowDataPacket[]>(query, id);
    return rows[0] as IChat;
}

export async function get_all(): Promise<IChat[]>{
   const query = `
        SELECT *
        FROM ${table_name}
   `; 

    const [rows] = await sql.query<RowDataPacket[]>(query);
    return rows as IChat[];
}

/**
@param cedula cedula de la persona
@param rol_persona rol de la persona
Devuelve todos los chats de una persona, no depende de si esta como persona_1 o como persona_2
Devuelve el nombre y cedula de la otra persona del chat
* */
export async function get_chats(cedula: string): Promise<Chat[]>{
    const query = `
        SELECT id as chat_id, P.cedula as reciver, P.nombre as reciver_name 
        FROM ${table_name}
        INNER JOIN ${Persona.table_name} P
            ON persona_1 = P.cedula 
            OR persona_2 = P.cedula
        WHERE ? in (persona_1, persona_2)
        AND cedula != ?
        ORDER BY chat_id DESC
    `;

    const [rows] = await sql.query<RowDataPacket[]>(query, [cedula, cedula]);
    return rows as Chat[];
}

/** 
@param chat_id id del chat que se busca
Devuelve todos los mensajes de un chat
**/
export async function get_messages(chat_id: number): Promise<ChatMessage[]>{
    const query = `
        SELECT sender, message, created_at
        FROM Messages
        WHERE chat_id = ?
    `;
    const [rows] = await sql.query<RowDataPacket[]>(query, [chat_id]);
    return rows as ChatMessage[];
}

/**
Crea un nuevo mensaje
*/ 
export async function create_message(chat_id: number, sender: string, message: string): Promise<number | ErrorResponse>{
    const query = `
        INSERT INTO Messages
        (chat_id, sender, message)
        VALUES(?, ?, ?)
    `;
    const [result] = await sql.query<ResultSetHeader>(query, [chat_id, sender, message]);
    return result.insertId;
}

export async function init_chat(cedula: string, motivo: string): Promise<TokenData | undefined>{
    const cargoBuscado = "Representante Técnico Comercial";
    const query = `
        WITH Cliente as (
            SELECT cedula, cod_zona
            FROM Personas
            WHERE cedula = ?
        )
        SELECT P.cedula, P.nombre, rol
        FROM Personas P
        INNER JOIN Cargos Ca
            ON P.cod_cargo = Ca.cod_cargo
        INNER JOIN Cliente C
            ON P.cod_zona = C.cod_zona 
            AND rol = '${roles.colaborador}'
        WHERE Ca.nombre LIKE '${cargoBuscado}'
    `;

    const [rows] = await sql.query<RowDataPacket[]>(query, [cedula]);
    return rows[0] as TokenData;
}
