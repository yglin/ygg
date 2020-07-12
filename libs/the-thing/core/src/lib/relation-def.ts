import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/core';
import { extend } from 'lodash';

interface IRelationDefine {
  name: string;
  imitationId?: string;
}

export class RelationDefine implements SerializableJSON {
  name: string;
  imitationId: string;

  constructor(options?: IRelationDefine) {
    this.fromJSON(options);
  }

  fromJSON(data: any): this {
    extend(this, data);
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
