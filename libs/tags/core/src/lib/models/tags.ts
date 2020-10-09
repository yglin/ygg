import { generateID, SerializableJSON } from '@ygg/shared/infra/core';
import { isArray, isEmpty, range, random, find, remove, every, some } from 'lodash';
import { Tag } from './tag';

export class Tags implements SerializableJSON {
  tags: string[];

  static isTags(value: any): value is Tags {
    return !!(value && isArray(value.tags));
  }

  static forge(): Tags {
    return new Tags(range(random(2, 7)).map(() => generateID()));
  }

  static fromJSON(data: any): Tags {
    if (isArray(data)) {
      return new Tags(data);
    } else {
      throw new Error(
        `Tags.fromJSON(): JSON Data error, need Array, received ${typeof data}`
      );
    }
  }

  get length(): number {
    return this.tags.length;
  }

  constructor(arg1?: string[]) {
    this.tags = [];
    this.push(...arg1);
  }

  isEmpty(): boolean {
    return isEmpty(this.tags);
  }

  has(tag: string): boolean {
    return this.tags.includes(tag);
  }

  include(tags: string[]): boolean {
    if (isEmpty(tags)) {
      throw new Error(`Argument tags is empty`);
    } else {
      return every(tags, tag => this.has(tag));
    }
  }

  includeAny(tags: string[]): boolean {
    if (isEmpty(tags)) {
      throw new Error(`Argument tags is empty`);
    } else {
      return some(tags, tag => this.has(tag));
    }
  }

  push(...tags: string[]) {
    for (const tag of tags) {
      if (!this.has(tag)) {
        this.tags.push(tag);
      }
    }
  }

  merge(tags: Tags): Tags {
    return new Tags(this.tags.concat(tags.tags));
  }

  clear() {
    this.tags.length = 0;
  }

  remove(tag: string) {
    remove(this.tags, _tag => _tag === tag);
  }

  filter(filterFn: (tag: string) => boolean): Tags {
    return new Tags(this.tags.filter(filterFn));
  }

  fromJSON(data: any = []): this {
    if (isArray(data) && !isEmpty(data)) {
      this.tags = data;
    }
    return this;
  }

  toJSON(): any {
    return this.tags;
  }
}
