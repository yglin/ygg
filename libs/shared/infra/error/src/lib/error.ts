export class YGGError extends Error {
  code: number;
  data: any;

  constructor(
    code: number = 0,
    message: string = 'Unknown error',
    data: any = {}
  ) {
    super(message);
    this.code = code;
    this.data = data;
  }

  isError(code: number) {
    return this.code === code;
  }
}

export enum ErrorCode {
  Unknown = 0,
  BadFunctionArgument,
  InvalidUrlPath
}

export enum BadValueErrorCode {
  Unknown = 54088,
  BadArgument,
  BadIdentify
}
export class BadValueError extends YGGError {
  code: BadValueErrorCode;
}

