import { extend, sample } from "lodash";
import { DataItem, toJSONDeep } from '@ygg/shared/infra/data-access';
import { Tag } from '@ygg/shared/types';
import { v4 as uuid } from "uuid";

export class PlayTag extends Tag implements DataItem {
  id: string;

  static forge(): PlayTag {
    return new PlayTag(Tag.forge().name);
  }

  constructor(name?: string) {
    super(name);
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