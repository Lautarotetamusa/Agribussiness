import { createPool } from "mysql2/promise";

const port: number = Number(process.env.DB_PORT) || 3306; //SI no existe usamos el 3306

const options = {
    host:       process.env.DB_HOST,
    user:       process.env.DB_USER,
    password:   process.env.DB_PASS,
    port:       port, 
    database:   process.env.DB_NAME
  }

export const sql = createPool(options);
