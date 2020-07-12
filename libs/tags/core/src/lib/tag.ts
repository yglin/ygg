import { sample } from 'lodash';
import { v4 as uuid } from 'uuid';
import { Entity } from '@ygg/shared/infra/core';

export class Tag implements Entity {
  static collectionName = 'tags';

  readonly id: string;
  readonly name: string;

  constructor(arg1: string | Tag) {
    if (!arg1) {
      throw new Error(`Invalid tag name for Tag constructor: ${arg1}`);
    }
    if (typeof arg1 === 'string') {
      this.name = arg1;
    } else if (Tag.isTag(arg1)) {
      this.name = arg1.name;
    }
    this.id = this.name.toLocaleLowerCase().normalize();
  }

  static fromJSON(data: any): Tag {
    return new Tag(data);
  }

  static isTag(value: any): value is Tag {
    return !!(value && typeof value.name === 'string' && value.name);
  }

  static toName(value: Tag | string): string {
    if (Tag.isTag(value)) {
      return value.name;
    } else {
      return value;
    }
  }

  static forge(): Tag {
    return new Tag(uuid());
  }

  fromJSON(data: any = {}): this {
    throw new Error(`Deprecated, use Tag.fromJSON() instead`);
  }

  toJSON(): any {
    return {
      id: this.id,
      name: this.name
    };
  }
}
