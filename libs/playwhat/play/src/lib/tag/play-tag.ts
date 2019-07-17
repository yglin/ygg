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
    this.id = this.name;
  }

  fromJSON(data: any): this {
    extend(this, data);
    this.id = this.name;
    return this;
  }

  toJSON(): any {
    this.id = this.name;
    return toJSONDeep(this);
  }
}