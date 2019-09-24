import { Tags } from './tags';

export interface Taggable {
  id: string;
  tags: Tags;
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