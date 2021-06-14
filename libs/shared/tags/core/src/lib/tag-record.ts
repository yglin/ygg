import { toJSONDeep } from '@ygg/shared/infra/core';
import { extend } from 'lodash';

export class TagRecord {
  id: string;
  subjectCollection: string;
  subjectIds: string[] = [];

  constructor(options: any = {}) {
    extend(this, options);
  }

  static tagsCollectionName(subjectCollection: string): string {
    return `tags_${subjectCollection}`;
  }

  static serialize(tagRecord: TagRecord): any {
    return toJSONDeep(tagRecord);
  }

  static deserialize(data): TagRecord {
    return new TagRecord(data);
  }

  get tag() {
    return this.id;
  }

  get count() {
    return this.subjectIds.length;
  }
}
