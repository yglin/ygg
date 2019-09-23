import { SerializableJSON } from '@ygg/shared/infra/data-access';
import { isArray, isEmpty, sample, range, random, find, remove } from 'lodash';
import { Tag } from "../tag";

export class Tags implements SerializableJSON {
  private tags: Tag[];

  static isTags(value: any): value is Tags {
    return !!(value && isArray(value.tags));
  }

  static forge(): Tags {
    return new Tags(range(random(5,10)).map(() => Tag.forge()));
  }

  static fromJSON(data: any): Tags {
    return new Tags().fromJSON(data);
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

  toTagsArray(): Tag[] {
    return this.tags;
  }

  toNameArray(): string[] {
    return this.tags.map(tag => tag.name);
  }

  push(...tags: Tag[] | string[]) {
    for (const tag of tags) {
      if (!this.has(tag)) {
        if (Tag.isTag(tag)) {
          this.tags.push(tag);
        } else if (typeof tag === 'string') {
          this.tags.push(new Tag(tag));
        }
      }
    }
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
    if (isArray(data)) {
      this.push(...data.map(tag => new Tag(tag)));
    }
    return this;
  }

  toJSON(): any {
    return this.tags.map(tag => tag.id);
  }
}
