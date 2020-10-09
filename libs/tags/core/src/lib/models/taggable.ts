import { Tags } from './tags';

export class Taggable {
  id: string;
  tags: Tags;

  constructor() {
    this.tags = new Tags();
  }

  hasTags(tags: string[]): boolean {
    return this.tags.include(tags);
  }

  setTags(tags: Tags) {
    this.tags = tags;
  }

  addTag(tag: string) {
    this.tags.push(tag);
  }

}

export interface TaggableType {
  id: string;
  label: string;
  collection: string;
}

export function toTaggableTypeId(tt: TaggableType | string): string {
  if (typeof tt === 'string') {
    return tt;
  } else {
    return tt.id;
  }
}

// export class Taggable {
//   readonly id: string;
//   readonly collection: string;
//   readonly tags: Tags;

//   // static isTaggable(value: any): value is Taggable {
//   //   return !!(value && value.id && Tags.isTags(value.tags));
//   // }

//   constructor(id: string, collection: string, tags: Tags) {
//     this.id = id;
//     this.collection = collection;
//     this.tags = tags;
//   }

// }