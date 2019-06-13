import { YGGError } from '@ygg/shared/infra/error';

export enum DataAccessErrorCode {
  Unknown = 0,
  DataNotFound
}

export class DataAccessError extends YGGError {
  code: DataAccessErrorCode;
  data: any;

  constructor(
    code: DataAccessErrorCode = DataAccessErrorCode.Unknown,
    message: string = 'Data access error',
    data: any = {}
  ) {
    super(code, message, data);
  }
}
