import {connect} from 'amqplib'
import { CreateNotification, NotificationSchema } from './schemas/notificacion.schema';

const amqp_url = `amqp://${process.env.AMQP_USER}:${process.env.AMQP_PASS}@${process.env.AMQP_HOST}:${process.env.AMQP_PORT}`;

function new_notification(body: CreateNotification): NotificationSchema {
    return {
        message: body.message,
        type: body.type,
        created_at: new Date()
    }
}
/**
@param notification Notificacion que vamos a enviar
@returns None
*/
export async function broadcast_notification(body: CreateNotification): Promise<NotificationSchema>{
    const connection = await connect(amqp_url);
    const channel = await connection.createChannel();
    const exchange = 'events';
    const notification = new_notification(body);

    //El modo fanout envia un mensaje a todas las colas asociadas al exchange
    channel.assertExchange(exchange, 'direct', {
        durable: false
    })

    channel.publish(exchange, notification.type, Buffer.from(JSON.stringify(notification)));

    return notification;
}

/**
@param to Cedula de la persona que recibe la notificacion
@param message Mensaje a enviar 
@returns None
 **/
export async function direct_notification(to: string, body: CreateNotification): Promise<NotificationSchema>{
    const connection = await connect(amqp_url);
    const channel = await connection.createChannel();
    const exchange = 'direct';
    const notification = new_notification(body);

    //El modo fanout envia un mensaje a todas las colas asociadas al exchange
    channel.assertExchange(exchange, 'direct', {
        durable: false
    });

    channel.publish(exchange, to, Buffer.from(JSON.stringify(notification)));

    return notification;
}
