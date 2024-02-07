import {z} from 'zod';

const notificationType = {
    'cotizacion:new': 'cotizacion:new',
    'message:new': 'message:new',
    'evento:new': 'evento:new',
    'evento:update': 'evento:update',
    'producto:new': 'producto:new', 
    'producto:update': 'producto:update',
    'producto:imagen:new': 'producto:imagen:new', 
    'solicitud:new': 'solicitud:new', 
    'solicitud:update': 'solicitud:update', 
    'articulo_tecnico:update': 'articulo_tecnico:update', 
    'articulo_tecnico:new': 'articulo_tecnico:new', 
} as const;
type NotificationTypeKeys = keyof typeof notificationType;
export const notificationTypeKeys = Object.keys(notificationType) as [NotificationTypeKeys];

const notificationSchema = z.object({
    created_at: z.date(),
    message: z.string(),
    type: z.enum(notificationTypeKeys)
});

export const createNotification = notificationSchema.omit({
    created_at: true
});

export type NotificationSchema = z.infer<typeof notificationSchema>;
export type CreateNotification = z.infer<typeof createNotification>;
