import { extend } from "lodash";
import { DataItem, toJSONDeep } from '@ygg/shared/infra/data-access';
import { v4 as uuid } from "uuid";

export class PlayTag implements DataItem {
  id: string;
  name: string;

  constructor() {
    this.id = uuid();
  }

  fromJSON(data: any): this {
    extend(this, data);
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}