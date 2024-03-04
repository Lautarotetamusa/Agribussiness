import 'express';
import { TokenData } from './schemas/persona.schema';

declare module 'express' {
  export interface Response  {
    locals: {
        user: TokenData
    };
  }
}
