import { RolesKeys } from './persona.schema';

export type BroadCastNotification = {
    to: RolesKeys[],
    message: string
}
export type DirectNotification = {
    to: string[],
    messages?: string[],
    message?: string
}

export const directNotis = {
    'cotizacion:new': (cedulas: string[], nro_cotizacion: number) => {return{
        to: cedulas,
        messages: [`Nueva cotizacion ${nro_cotizacion}`, 'hola']
    }},
    'message:new': (cedulas: string[], nombre: string, message: string) => {return{
        to: cedulas,
        message: `Tienes un nuevo mensaje de ${nombre}: ${message}`
    }},
    'solicitud:new': () => {}
} as const;

export const broadcastNotis: Record<string, (...args: any[]) => BroadCastNotification> = {
    'evento:new': (titulo: string) => {return {
        to: ['cliente', 'colaborador'],
        message: `Evento nuevo: ${titulo}` as const
    }},
    'evento:update': (titulo: string) => {return {
        to: ['cliente', 'colaborador'],
        message: `Evento actualizado: ${titulo}` as const
    }},
    'producto:new': (nombre: string) => {return {
        to: ['cliente', 'colaborador'],
        message: `Producto nuevo: ${nombre}` as const
    }}, 
    'producto:list': () => {return {
        to: ['cliente', 'colaborador'],
        message: `Nueva lista de precios!` as const
    }}, 
    'producto:update': (nombre: string) => {return {
        to: ['cliente', 'colaborador'],
        message: `Producto actualizado: ${nombre}`
    }},    
    'producto:imagen:new': (nombre: string) => {return {
        to: ['cliente', 'colaborador'],
        message: `Nueva imagen para producto: ${nombre}` as const
    }}, 
    'articulo_tecnico:update': (titulo: string) => {return {
        to: ['cliente', 'colaborador'],
        message: `Articulo tecnico actualizado: ${titulo}` as const
    }}, 
    'articulo_tecnico:new': (titulo: string) => {return {
        to: ['cliente', 'colaborador'],
        message: `Nuevo articulo tecnico: ${titulo}` as const
    }}
} as const;

export type Notifications = typeof broadcastNotis;
