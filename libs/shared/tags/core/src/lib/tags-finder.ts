import { DataAccessor } from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { flatten, get, orderBy, set, uniq } from 'lodash';
import { TagRecord } from './tag-record';

export class TagsFinder {
  cacheTopTags: { [subjectCollection: string]: string[] } = {};
  cacheTagRecords: {
    [subjectCollection: string]: { [id: string]: TagRecord };
  } = {};

  constructor(private dataAccessor: DataAccessor) {}

  async listAll(subjectCollection: string): Promise<TagRecord[]> {
    try {
      const tagsCollection = TagRecord.tagsCollectionName(subjectCollection);
      const dataItems = await this.dataAccessor.list(tagsCollection);
      return dataItems.map(data => TagRecord.deserialize(data));
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to list all tag-records`);
      return Promise.reject(wrpErr);
    }
  }

  async findTopTags(
    subjectCollection: string,
    count: number
  ): Promise<string[]> {
    try {
      if (
        subjectCollection in this.cacheTopTags &&
        this.cacheTopTags[subjectCollection].length >= count
      ) {
        return this.cacheTopTags[subjectCollection].slice(0, count);
      } else {
        const tagRecords: TagRecord[] = await this.listAll(subjectCollection);
        const topTags = orderBy(
          tagRecords,
          (tr: TagRecord) => tr.count,
          'desc'
        ).map(tr => tr.tag);
        this.cacheTopTags[subjectCollection] = topTags;
        // console.log(topTags);
        return topTags.slice(0, count);
      }
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to find top ${count} tags`);
      return Promise.reject(wrpErr);
    }
  }

  async getById(subjectCollection: string, id: string): Promise<TagRecord> {
    try {
      let tagRecord = get(
        this.cacheTagRecords,
        `${subjectCollection}.${id}`,
        null
      );
      if (!tagRecord) {
        const tagsCollection = TagRecord.tagsCollectionName(subjectCollection);
        const data = await this.dataAccessor.load(tagsCollection, id);
        tagRecord = TagRecord.deserialize(data);
        set(this.cacheTagRecords, `${subjectCollection}.${id}`, tagRecord);
      }
      return tagRecord;
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to get tag-record by id ${id}`);
      return Promise.reject(wrpErr);
    }
  }

  async findIdsByTags(
    subjectCollection: string,
    tags: string[]
  ): Promise<string[]> {
    try {
      const tagRecords: TagRecord[] = await Promise.all(
        tags.map(tag => this.getById(subjectCollection, tag))
      );
      return uniq(flatten(tagRecords.map(tr => tr.subjectIds)));
    } catch (error) {
      const wrpErr = wrapError(
        error,
        `Failed to find ${subjectCollection} ids by tags ${tags}`
      );
      return Promise.reject(wrpErr);
    }
  }

  // async findByTag(tag: string): Promise<TagRecords> {
  //   const data = await this.dataAccessor.load(TagRecords.subjectCollection, tag);
  //   return TagRecords.deserialize(data);
  // }
}
