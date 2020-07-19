import { SerializableJSON } from '@ygg/shared/infra/core';

export class Html implements SerializableJSON {
  content: string;

  static forge(options: any = {}): Html {
    return new Html().fromJSON('<div><h3>The is a piece of HTML</h3></div>');
  }

  constructor(content?: string) {
    this.content = content;
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
