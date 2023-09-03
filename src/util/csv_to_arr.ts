import fs from "fs";
import { ValidationError } from "../errors";
import {number, z} from "zod";

/**
 * Returns the keys from a zod object
 * @param schema Zod object
 * @returns string[]
 */
const zodKeys = (schema: z.ZodType): string[] => {  // Adjusted: Signature now uses Zod.ZodType to eliminate null& undefined check
    // check if schema is nullable or optional
    if (
        schema instanceof z.ZodNullable ||
        schema instanceof z.ZodOptional
    ) {
        return zodKeys(schema.unwrap())
    }
    // check if schema is an array
    if (schema instanceof z.ZodArray) {
        return zodKeys(schema.element)
    }
    // check if schema is an object
    if (schema instanceof z.ZodObject) {
        // get key/value pairs from schema
        const entries = Object.entries<z.ZodType>(schema.shape) // Adjusted: Uses Zod.ZodType as generic to remove instanceof check. Since .shape returns ZodRawShape which has Zod.ZodType as type for each key.
        // loop through key/value pairs
        return entries.flatMap(([key, value]) => {
            // get nested keys
            const nested = zodKeys(value).map(
                (subKey) => `${key}.${subKey}`
            )
            // return nested keys
            return nested.length ? nested : key
        })
    }
    // return empty array
    return []
}

/**
 * Convert csv file to array of objects with valid fields.
 * Validate the file contains the correct headers in the first line.
 * 
 * @param T type of the return object
 * @param file_path file path to csv file
 * @param schema Zod object that parse the csv data
 * @returns Array of objects with correct types
 */
export function csv2arr<T>(
        file_path: string, 
        schema: z.Schema<T>
    ): Array<T> {
    const data = fs.readFileSync(file_path, 'utf-8').split(/\r?\n/);
    const keys = zodKeys(schema);
    let faltantes: string[] = Object.assign([], keys);
    let values_keys: Record<string, number> = {}; //Headers to position
    let objects: Array<T> = [];

    if (data.length < 2) throw new ValidationError("El archivo esta vacio");

    let position = 0;
    for (const value of data[0].split(',')){
        if (keys.indexOf(value) > -1){
            let index = faltantes.indexOf(value);
            faltantes.splice(index, 1);
            values_keys[value] = position;
        }
        position += 1;
    }
    data.shift(); //Remove headers
    
    if (faltantes.length != 0)
        throw new ValidationError(`El archivo .csv no contiene las columnas ${faltantes}`);

    for (const line of data){
        const values = line.split(',');

        let object: Record<string, any> = {};
        for (const key of keys){
            const str_val = values[values_keys[key]];
            if (str_val === ""){
                delete object[key]
                continue;
            }
            
            let number_val = Number(str_val); //Hago esto porque Number("") = 0 y no quiero que los campos vacios se completen con 0
            object[key] = Number.isNaN(number_val) ? str_val : number_val;
        }

        objects.push(schema.parse(object));
    }

    return objects;
}