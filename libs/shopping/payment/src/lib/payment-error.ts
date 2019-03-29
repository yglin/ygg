export enum PaymentErrorCode {
  UNKNOWN = 5000,
  INVALID_METHOD_ID,
  NOT_IMPLEMENT_METHOD,
  NOT_ACTIVE_METHOD
}

export class PaymentError extends Error {
  code: PaymentErrorCode;

  constructor(code: PaymentErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}