import { sql } from "../db";
import { z } from "zod";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ErrorResponse, notFound } from "../errors";

const table_name = "Chats";

const chat_message = z.object({
    chat_id: z.number(),
    message: z.string(),
    sender: z.string().max(10),
    created_at: z.date()
});
type ChatMessage = z.infer<typeof chat_message>;

// Esta funcion nos devuelve el chat id entre un cliente y un colaborador
// Si el chat no existe, lo crea y devuelve su id
export async function get_chat(persona_1: string, persona_2: string): Promise<number | ErrorResponse>{
    let query = `
        SELECT id
        FROM ${table_name}
        WHERE cliente = ? AND colaborador = ?
        OR colaborador = ? AND cliente = ?
    `;

    const [rows] = await sql.query<RowDataPacket[]>(query, [persona_1, persona_2, persona_1, persona_2]);

    if (rows.length > 0){ //No existe el chat, vamos a crear uno nuevo
        return rows[0].id
    }

    //No existe el chat, vamos a crear uno nuevo
    query = `
        INSERT INTO ${table_name}
        (cliente, colaborador) VALUES (?, ?)
    `;

    try{
        const [result] = await sql.query<ResultSetHeader>(query, [persona_1, persona_2]);
        return result.insertId;
    }catch(error: any){
        console.log("ERROR: ", error);
        return notFound(`La persona con cedula ${persona_1} o ${persona_2} no existe`);
    }
}

//Devuelve todos los mensajes de un chat
export async function get_messages(chat_id: number): Promise<ChatMessage[]>{
    const query = `
        SELECT * FROM Messages
        WHERE chat_id = ?
    `;
    const [rows] = await sql.query<RowDataPacket[]>(query, [chat_id]);
    return rows as ChatMessage[];
}

//Crea un nuevo mensaje, validando que el sender se encuentre dentro del chat
export async function create_message(chat_id: number, sender: string, message: string): Promise<number | ErrorResponse>{
    //Verificar si el remitente está dentro del chat
    /*let query = `
        SELECT COUNT(*) as valid_sender
        FROM Chats
        WHERE id = ? AND (cliente = ? OR colaborador = ?);
    `
    const [rows] = await sql.query<RowDataPacket[]>(query, [chat_id, sender, sender]);
    if (rows[0].valid_sender < 0){
        return notFound("La persona que envia el mensaje no se encuentra dentro del chat");
    }*/
    const query = `
        INSERT INTO Messages
        (chat_id, sender, message)
        VALUES(?, ?, ?)
    `;
    const [result] = await sql.query<ResultSetHeader>(query, [chat_id, sender, message]);
    return result.insertId;
}
