import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from 'http-status-codes';
import * as HttpStatus from 'http-status-codes';

export class HttpError extends Error {
  status: HTTP_STATUS;
  body: any;

  constructor(status: HTTP_STATUS, message: string, body:any = {}) {
    super(message);
    this.status = status || HttpStatus.INTERNAL_SERVER_ERROR;
    this.body = body;
  }
}

export function httpErrorHandler(err: HttpError, req: Request, res: Response, next: NextFunction) {
  res.status(err.status).send(err.message);
}