import { SerializableJSON } from '@ygg/shared/infra/data-access';

export class Html implements SerializableJSON {
  content: string;

  static forge(options: any = {}): Html {
    return new Html().fromJSON('<div><h3>The is a piece of HTML</h3></div>');
  }

  constructor(...args: any[]) {
    if (args.length === 1 && typeof (args[0] === 'string')) {
      this.fromJSON(args[0]);
    }
  }

  fromJSON(data: any): this {
    if (typeof data === 'string') {
      this.content = data;
    }
    return this;
  }

  toJSON(): string {
    return this.content;
  }
}
