import { SerializableJSON } from '@ygg/shared/infra/core';
import { isArray, isEmpty, range, random, find, remove, every } from 'lodash';
import { Tag } from './tag';

export class Tags implements SerializableJSON {
  private tags: Tag[];

  static isTags(value: any): value is Tags {
    return !!(value && isArray(value.tags));
  }

  static forge(): Tags {
    return new Tags(range(random(2, 7)).map(() => Tag.forge()));
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

  constructor(arg1?: Tags | Tag[] | string[]) {
    this.tags = [];

    let sourceTags: Tag[] | string[];
    if (Tags.isTags(arg1)) {
      sourceTags = arg1.tags;
    } else if (isArray(arg1) && !isEmpty(arg1)) {
      sourceTags = arg1;
    }
    if (!isEmpty(sourceTags)) {
      this.push(...sourceTags);
    }
  }

  isEmpty(): boolean {
    return isEmpty(this.tags);
  }

  getNames(): string[] {
    return this.tags.map(tag => tag.name);
  }

  has(tag: Tag | string): boolean {
    return !!find(this.tags, _tag => _tag.name === Tag.toName(tag));
  }

  include(tags: string[]): boolean {
    if (isEmpty(tags)) {
      return true;
    } else {
      return every(tags, tag => this.has(tag));
    }
  }

  toTagsArray(): Tag[] {
    return this.tags;
  }

  toIDArray(): string[] {
    return this.tags.map(tag => tag.id);
  }

  toNameArray(): string[] {
    return this.tags.map(tag => tag.name);
  }

  push(...tags: Tag[] | string[]) {
    for (const tag of tags) {
      if (!this.has(tag)) {
        this.tags.push(new Tag(tag));
      }
    }
  }

  merge(tags: Tags): Tags {
    return new Tags(this.toTagsArray().concat(tags.toTagsArray()));
  }

  forEach(iterator: (value: Tag, index: number, array: Tag[]) => void) {
    this.tags.forEach(iterator);
  }

  clear() {
    this.tags.length = 0;
  }

  remove(tag: Tag | string) {
    remove(this.tags, _tag => _tag.name === Tag.toName(tag));
  }

  filter(filterFn: (tag: Tag) => boolean): Tags {
    return new Tags(this.tags.filter(filterFn));
  }

  fromJSON(data: any = []): this {
    throw new Error(`Deprecated, use Tags.fromJSON() instead`);
  }

  toJSON(): any {
    return this.toIDArray();
  }
}
