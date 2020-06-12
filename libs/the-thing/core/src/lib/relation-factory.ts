import { extend } from 'lodash';
import { DataAccessor } from '@ygg/shared/infra/core';
import { Observable } from 'rxjs';
import { Query } from '@ygg/shared/infra/data-access';
import { RelationCollection, RelationAccessor } from './relation-accessor';
import { RelationRecord } from './relation';

export abstract class RelationFactory {
  constructor(protected relationAccessor: RelationAccessor) {}

  async create(options: {
    subjectCollection: string;
    subjectId: string;
    objectCollection: string;
    objectId: string;
    objectRole: string;
  }) {
    try {
      const id = `${options.subjectId}_${options.objectRole}_${options.objectId}`;
      const relationRecord: RelationRecord = extend(options, { id });
      await this.relationAccessor.save(relationRecord);
    } catch (error) {
      const wrapError = new Error(
        `Failed to create relation record; \n${error.message}`
      );
      throw wrapError;
    }
  }

  findBySubjectAndRole$(
    subjectId: string,
    objectRole: string
  ): Observable<RelationRecord[]> {
    const queries = [];
    queries.push(new Query('subjectId', '==', subjectId));
    queries.push(new Query('objectRole', '==', objectRole));
    return this.relationAccessor.find$(queries);
  }
}
