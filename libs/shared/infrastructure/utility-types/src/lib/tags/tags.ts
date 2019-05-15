import { isArray } from 'lodash';

export class Tags {
  _values: Set<string>;

  constructor(values: string[] = []) {
    this._values = new Set(values);
  }

  get values(): string[] {
    return Array.from(this._values);
  }

  has(tag: string): boolean {
    return this._values.has(tag);
  }

  add(tag: string) {
    this._values.add(tag);
  }

  delete(tag: string) {
    this._values.delete(tag);
  }

  fromJSON(data: any): this {
    if (isArray(data)) {
      this._values = new Set(data);
    }
    return this;
  }

  toJSON(): any {
    return this.values;
  }
}