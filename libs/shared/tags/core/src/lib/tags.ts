import {
  castArray,
  every,
  isArray,
  isEmpty,
  isSet,
  random,
  sampleSize
} from 'lodash';

export class Tags {
  private tags: Set<string>;

  constructor(tags?: string[]) {
    this.tags = new Set();
    if (isArray(tags)) {
      this.add(tags);
    }
  }

  static isTags(value: any): value is Tags {
    return !!value && isSet(value.tags);
  }

  static forge(): Tags {
    return new Tags(
      sampleSize(
        [
          '3C',
          '塑膠',
          '小家電',
          '衣服',
          '鞋子',
          '家具',
          '桌椅',
          '衛浴用具',
          '電腦週邊',
          '文創小物',
          '玩具',
          '食品',
          '玻璃',
          '廚房用具',
          '金屬',
          '寵物',
          '藥妝品',
          '運動',
          '桌椅'
        ],
        random(2, 7)
      )
    );
  }

  get length(): number {
    return this.tags.size;
  }

  isEmpty(): boolean {
    return !this.tags || this.tags.size <= 0;
  }

  getTags(): string[] {
    return Array.from(this.tags);
  }

  has(tag: string): boolean {
    return this.tags.has(tag.toLowerCase());
  }

  include(tags: string[]): boolean {
    if (isEmpty(tags)) {
      return true;
    } else {
      return every(tags, tag => this.has(tag));
    }
  }

  add(tags: string | string[]) {
    tags = castArray(tags);
    for (const tag of tags) {
      this.tags.add(tag.toLowerCase());
    }
  }

  clear() {
    this.tags.clear();
  }

  remove(tag: string) {
    this.tags.delete(tag);
  }

  toJSON(): any {
    return Array.from(this.tags);
  }

  toString(): string {
    return this.tags.toString();
  }
}
