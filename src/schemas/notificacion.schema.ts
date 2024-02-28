import { Cotizacion } from '../models/cotizacion.model';
import { Solicitud } from '../models/solicitud.model';
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

export const notifications = {
    //Direct notifications
    'cotizacion:new': (cotizacion: Cotizacion) => {return{
        [cotizacion.colaborador?.cedula || '']: `Nueva cotizacion ${cotizacion.nro_cotizacion} creada con exito`,
        [cotizacion.cliente?.cedula || '']: `Recibiste una cotizacion ${cotizacion.nro_cotizacion} de parte de ${cotizacion.colaborador?.nombre}`
    }},
    'message:new': (cedula: string, nombre: string, message: string) => {return{
        [cedula]: `Tienes un nuevo mensaje de ${nombre}: ${message}`
    }},
    'solicitud:accept': (solicitud: Solicitud) => {return {
        [solicitud.solicitante]: `Su solicitud con codigo: ${solicitud.cod_solicitud} ha sido aceptada`,
        [solicitud.solicitado]: `Aceptaste la solicitud ${solicitud.cod_solicitud} correctamente`
    }},
    'solicitud:new': (solicitud: Solicitud) => {return {
        [solicitud.solicitante]: `Su solicitud con codigo: ${solicitud.cod_solicitud} ha sido elaborada`,
        [solicitud.solicitado]: `Recibiste una nueva solicitud de parte de ${solicitud.solicitante}`
    }},
    //Broadcast
    'evento:new': (titulo: string): BroadCastNotification => {return {
        to: ['cliente', 'colaborador'],
        message: `Evento nuevo: ${titulo}` as const
    }},
    'evento:update': (titulo: string): BroadCastNotification => {return {
        to: ['cliente', 'colaborador'] ,
        message: `Evento actualizado: ${titulo}` as const
    }},
    'producto:new': (nombre: string): BroadCastNotification => {return {
        to: ['cliente', 'colaborador'] ,
        message: `Producto nuevo: ${nombre}` as const
    }}, 
    'producto:list': (): BroadCastNotification => {return {
        to: ['cliente', 'colaborador'],
        message: `Nueva lista de precios!` as const
    }}, 
    'producto:update': (nombre: string): BroadCastNotification => {return {
        to: ['cliente', 'colaborador'],
        message: `Producto actualizado: ${nombre}`
    }},    
    'producto:imagen:new': (nombre: string): BroadCastNotification => {return {
        to: ['cliente', 'colaborador'],
        message: `Nueva imagen para producto: ${nombre}` as const
    }}, 
    'articulo_tecnico:update': (titulo: string): BroadCastNotification => {return {
        to: ['cliente', 'colaborador'],
        message: `Articulo tecnico actualizado: ${titulo}` as const
    }}, 
    'articulo_tecnico:new': (titulo: string): BroadCastNotification => {return {
        to: ['cliente', 'colaborador'],
        message: `Nuevo articulo tecnico: ${titulo}` as const
    }}
} as const;

export type Notifications = typeof notifications;
