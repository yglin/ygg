import { Entity, generateID } from '@ygg/shared/infra/core';
import { extend } from 'lodash';

export class Tag implements Entity {
  static collection = 'tags';

  readonly id: string;
  readonly popularity: number;

  get name(): string {
    return this.id;
  }

  constructor(arg1?: string) {
    if (arg1 && typeof arg1 === 'string') {
      this.id = arg1;
    } else {
      this.id = generateID();
    }
    this.popularity = 1;
  }

  static isTag(value: any): value is Tag {
    return !!(
      value &&
      typeof value.id === 'string' &&
      value.id &&
      typeof value.popularity === 'number'
    );
  }

  fromJSON(data: any = {}): this {
    if (data) {
      extend(this, data);
    }
    return this;
  }

  toJSON(): any {
    return {
      id: this.id,
      popularity: this.popularity
    };
  }
}
