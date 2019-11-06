import { v4 as uuid } from "uuid";
import { extend } from "lodash";
import { DataItem, toJSONDeep } from "@ygg/shared/infra/data-access";

export class Schedule implements DataItem {
  id: string;

  constructor() {
    this.id = uuid();
  }

  fromJSON(data: any): this {
    if (data) {
      extend(this, data);
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}