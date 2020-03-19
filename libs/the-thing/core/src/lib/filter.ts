import { extend, isEmpty, assign } from 'lodash';
import { TheThing } from './the-thing';
import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/data-access';
import { Tags } from '@ygg/tags/core';
import { __assign } from 'tslib';

export class TheThingFilter implements SerializableJSON {
  name: string;
  tags: string[] = [];
  ownerId: string;
  keywordName: string = '';
  flags: { [name: string]: boolean } = {};

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

  merge(filter: TheThingFilter): TheThingFilter {
    if (!filter) {
      return this.clone();
    } else {
      const name = `${this.name} ＆ ${filter.name}`;
      const tags = new Tags(this.tags)
        .merge(new Tags(filter.tags))
        .toNameArray();
      const keywordName = `${this.keywordName} ${filter.keywordName}`;
      const ownerId = !!filter.ownerId ? filter.ownerId : this.ownerId;
      const flags = assign({}, this.flags, filter.flags);
      return new TheThingFilter(name, {
        tags: tags,
        ownerId: ownerId,
        keywordName: keywordName,
        flags: flags
      });
    }
  }

  test(theThing: TheThing): boolean {
    // console.log(`${this.ownerId} ?== ${theThing.ownerId}`);
    if (!!this.ownerId && theThing.ownerId !== this.ownerId) {
      return false;
    }
    if (!isEmpty(this.tags) && !theThing.tags.include(this.tags)) {
      return false;
    }
    const seachText = JSON.stringify(theThing).toLowerCase();
    const keywords: string[] = this.keywordName.split(' ,');
    if (!isEmpty(keywords)) {
      for (const keyword of keywords) {
        if (!seachText.includes(keyword.toLowerCase())) {
          return false;
        }
      }
    }
    for (const name in this.flags) {
      if (this.flags.hasOwnProperty(name)) {
        const value = this.flags[name];
        if (theThing.getFlag(name) !== value) {
          return false;
        }
      }
    }
    return true;
  }

  addFlags(flags: { [name: string]: boolean }) {
    assign(this.flags, flags);
  }

  clone(): TheThingFilter {
    return new TheThingFilter().fromJSON(this.toJSON());
  }

  fromJSON(data: any): this {
    extend(this, data);
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
