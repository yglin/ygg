import { SerializableJSON } from '@ygg/shared/infra/core';
import { extend } from 'lodash';

export class Html implements SerializableJSON {
  content: string;

  static isHtml(value: any): value is Html {
    return value && value.content !== undefined;
  }

  static forge(options: any = {}): Html {
    return new Html().fromJSON('<div><h3>The is a piece of HTML</h3></div>');
  }

  constructor(content?: string) {
    this.content = content;
  }

  fromJSON(data: any): this {
    if (typeof data === 'string') {
      this.content = data;
    } else if (Html.isHtml(data)) {
      extend(this, data);
    }
    return this;
  }

  toJSON(): string {
    return this.content;
  }
}
