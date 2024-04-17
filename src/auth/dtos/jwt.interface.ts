import { Request } from 'express';

export interface JwtRequest extends Request {
  token?: string;
}
