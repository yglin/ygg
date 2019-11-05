import { extend } from "lodash";
import { DataItem, toJSONDeep } from "@ygg/shared/infra/data-access";

export class Schedule implements DataItem {
  id: string;

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