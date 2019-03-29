import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status-codes';

export class HttpError extends Error {
  status: number;
  body: any;

  constructor(status: number, message: string, body:any = {}) {
    super(message);
    this.status = status || HttpStatus.INTERNAL_SERVER_ERROR;
    this.body = body;
  }
}

export function httpErrorHandler(err: HttpError, req: Request, res: Response, next: NextFunction) {
  const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
  res.status(status).send(err.message);
}