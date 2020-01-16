import { extend, isEmpty } from 'lodash';
import { TheThing } from './the-thing';
import { SerializableJSON, toJSONDeep } from "@ygg/shared/infra/data-access";

export class TheThingFilter implements SerializableJSON {
  name: string;
  tags: string[] = [];
  keywordName: string = '';

  constructor(...args: any[]) {
    if (!isEmpty(args)) {
      if (typeof args[0] === 'string') {
        this.name = args[0];
        if (args.length >= 2 && typeof args[1] === 'object') {
          extend(this, args[1]);
        }
      } else if (typeof args[0] === 'object') {
        extend(this, args[0]);
      }
    }
  }

  filter(theThings: TheThing[]): TheThing[] {
    return theThings.filter(theThing => this.test(theThing));
  }

  test(theThing: TheThing): boolean {
    if (!isEmpty(this.tags) && !theThing.tags.include(this.tags)) {
      return false;
    }
    if (!!this.keywordName) {
      const keyword = this.keywordName.toLowerCase();
      const name = theThing.name.toLowerCase();
      if (!name.includes(keyword)) {
        return false;
      }
    }
    return true;
  }

  fromJSON(data: any): this {
    extend(this, data);
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
 }
