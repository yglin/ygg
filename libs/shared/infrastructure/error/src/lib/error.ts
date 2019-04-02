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