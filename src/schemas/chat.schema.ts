import {z} from "zod";

const iChat = z.object({
    id: z.number(),
    persona_1: z.string().max(10),
    persona_2: z.string().max(10)
});
export type IChat = z.infer<typeof iChat>;

const chat = z.object({
    chat_id: z.number(),
    reciver: z.string().max(10),
    reciver_name: z.string()
});
export type Chat = z.infer<typeof chat>;

const chat_message = z.object({
    message: z.string(),
    sender: z.string().max(10),
    created_at: z.date()
});
export type ChatMessage = z.infer<typeof chat_message>;

export const motivos = {
    informacion: "informacion",
    venta: "venta"
} as const;
export type Motivos = keyof typeof motivos;
const motivosKeys = Object.keys(motivos) as [Motivos];
export const createChat = z.object({
    motivo: z.enum(motivosKeys)
});
