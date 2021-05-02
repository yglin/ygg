import { DataAccessor } from '@ygg/shared/infra/core';
import { isEmpty, keyBy, orderBy } from 'lodash';
import { map, take } from 'rxjs/operators';
import { TagRecords } from './tag-records';

export class TagsFinder {
  tagRecordsCache = {};

  constructor(private dataAccessor: DataAccessor) {}

  async findTopTags(count: number): Promise<string[]> {
    if (isEmpty(this.tagRecordsCache)) {
      const tagRecordsAll = await this.dataAccessor
        .list$(TagRecords.collection)
        .pipe(
          take(1),
          map((dataItems: any[]) =>
            dataItems.map(d => new TagRecords(d.id).fromJSON(d))
          )
        )
        .toPromise();
      this.tagRecordsCache = keyBy(tagRecordsAll, 'id');
    }
    // console.log(this.tagRecordsCache);
    const topTags = orderBy(
      this.tagRecordsCache,
      (tr: TagRecords) => tr.amount,
      'desc'
    )
      .slice(0, count)
      .map((tr: TagRecords) => tr.id);
    // console.log(topTags);
    return topTags;
  }
}
