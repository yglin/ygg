import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/data-access';
import { TheThingImitation } from './imitation';
import { extend } from 'lodash';

interface IRelationDef {
  name: string;
  imitationId?: string;
}

export class RelationDef implements SerializableJSON {
  name: string;
  imitationId: string;

  constructor(options?: IRelationDef) {
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
