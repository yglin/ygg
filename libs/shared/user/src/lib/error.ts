import { YGGError } from '@ygg/shared/infrastructure/error';

export enum UserErrorCode {
  Unknown = 0,
  UserNotFound,
  LoginFailed
}

export class UserError extends YGGError {
  code: UserErrorCode;
  data: any;

  constructor(
    code: UserErrorCode = UserErrorCode.Unknown,
    message: string = 'User error',
    data: any = {}
  ) {
    super(code, message, data);
  }
}
