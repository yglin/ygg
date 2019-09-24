import { extend } from 'lodash';
import { Taggable } from './taggable';
import { Tag } from './tag';

export class Tagging {
  static collectionName = 'taggings';

  readonly id: string;
  readonly tagId: string;
  readonly taggableId: string;
  readonly taggableCollection: string;

  static isTagging(value: any): value is Tagging {
    return !!(value && value.id && value.tagId && value.taggableId && value.taggableCollection);
  }

  constructor(tag: Tag, taggable: Taggable, collection: string) {
    this.id = `${tag.id}_${taggable.id}`;
    this.tagId = tag.id;
    this.taggableId = taggable.id;
    this.taggableCollection = collection;
  }

  toJSON(): any {
    return {
      id: this.id,
      tagId: this.tagId,
      taggableId: this.taggableId,
      taggableCollection: this.taggableCollection
    };
  }
}