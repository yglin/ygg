import { isArray, sample } from 'lodash';

export class Tags {
  _values: Set<string>;

  static forge(): Tags {
    const forged = new Tags();
    const sampleTags = ['生態', '手作', '飲食', '遊戲', '教學', '購物', '住宿', '運動', '尋寶', '展覽', '人文', '自然'];
    for (const tag of sampleTags) {
      forged.add(sample(sampleTags));
    }
    return forged;
  }

  constructor(values: string[] = []) {
    this._values = new Set(values);
  }

  get length(): number {
    return this._values ? this._values.size : 0;
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