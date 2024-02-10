import * as amqp from 'amqplib'
import { CreateNotification, NotificationSchema } from './schemas/notificacion.schema';

class AMQPConnection{
    private static connection: amqp.Connection;
    private static url = `amqp://${process.env.AMQP_USER}:${process.env.AMQP_PASS}@${process.env.AMQP_HOST}:${process.env.AMQP_PORT}`;

    static async connect(){
        if (!this.connection){
            this.connection = await amqp.connect(this.url);
        }
        return this.connection;
    }
}

function newNotification(body: CreateNotification): NotificationSchema {
    return {
        message: body.message,
        type: body.type,
        created_at: new Date()
    }
}
/**
    * @brief Envia una notificacion a todos los usuarios subscriptos a ese tipo
    * @param notification Notificacion que vamos a enviar
    * @returns None
*/
export async function broadcastNotification(body: CreateNotification):Promise<NotificationSchema>{
    const connection = await AMQPConnection.connect();
    const channel = await connection.createChannel();
    const exchange = 'events';
    const notification = newNotification(body);

    //El modo fanout envia un mensaje a todas las colas asociadas al exchange
    channel.assertExchange(exchange, 'direct', {
        durable: false
    })

    channel.publish(exchange, notification.type, Buffer.from(JSON.stringify(notification)));

    return notification;
}

/**
    * @param to Cedula de la persona que recibe la notificacion
    * @param message Mensaje a enviar 
    * @returns None
 */
export async function directNotification(to: string, body: CreateNotification): Promise<NotificationSchema>{
    const connection = await AMQPConnection.connect();
    const channel = await connection.createChannel();
    const exchange = 'direct';
    const notification = newNotification(body);

    //El modo fanout envia un mensaje a todas las colas asociadas al exchange
    channel.assertExchange(exchange, 'direct', {
        durable: false
    });

    channel.publish(exchange, to, Buffer.from(JSON.stringify(notification)));

    return notification;
}
