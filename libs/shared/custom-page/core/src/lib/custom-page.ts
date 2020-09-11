import {
  generateID,
  SerializableJSON,
  toJSONDeep
} from '@ygg/shared/infra/core';
import { Html } from '@ygg/shared/omni-types/core';
import { extend } from 'lodash';

export class CustomPage implements SerializableJSON {
  id: string;
  label: string;
  content: Html;

  constructor(options?: any) {
    this.id = generateID();
    this.fromJSON(options);
  }

  fromJSON(data: any): this {
    extend(this, data);
    if (data.content) {
      this.content = new Html().fromJSON(data.content);
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
