import { SerializableJSON } from '@ygg/shared/infra/data-access';
import { isArray, isEmpty, sample, range, random, find, remove } from 'lodash';

export class Tag implements SerializableJSON {
  name: string;

  constructor(arg1?: string) {
    this.name = '';

    if (arg1) {
      this.name = arg1;
    }
  }

  static isTag(value: any): value is Tag {
    return !!(value && typeof value.name === 'string');
  }

  static toName(value: Tag | string): string {
    if (Tag.isTag(value)) {
      return value.name;
    } else {
      return value;
    }
  }

  static forge(): Tag {
    const name = sample([
      'HAVE',
      'YOU',
      'EVER',
      'SEE',
      'THE',
      'RAIN',
      'YYGG',
      'BIRD',
      'BIRB',
      'BORB',
      'ORB',
      'Cockatiel',
      'Cockatoo',
      'Eclectus',
      'Conure',
      'Parakeet',
      'Budgie',
      'Macaw',
      'Lovebird',
      'Caique',
      'Amazon'
    ]);
    return new Tag(name);
  }

  fromJSON(data: any = {}): this {
    if (typeof data === 'string') {
      this.name = data;
    }
    return this;
  }

  toJSON(): any {
    return this.name;
  }
}

export class Tags implements SerializableJSON {
  private tags: Tag[];

  static isTags(value: any): value is Tags {
    return !!(value && isArray(value.tags));
  }

  static forge(): Tags {
    return new Tags(range(random(5,10)).map(() => Tag.forge()));
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

  getNames(): string[] {
    return this.tags.map(tag => tag.name);
  }

  has(tag: Tag | string): boolean {
    return !!find(this.tags, _tag => _tag.name === Tag.toName(tag));
  }

  toTags(): Tag[] {
    return this.tags;
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
      this.push(...data.map(element => new Tag().fromJSON(element)));
    }
    return this;
  }

  toJSON(): any {
    return this.tags.map(tag => tag.toJSON());
  }
}
