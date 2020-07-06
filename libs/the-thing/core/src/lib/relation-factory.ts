import { extend } from 'lodash';
import { DataAccessor } from '@ygg/shared/infra/core';
import { Observable } from 'rxjs';
import { Query } from '@ygg/shared/infra/data-access';
import { RelationCollection, RelationAccessor } from './relation-accessor';
import { RelationRecord } from './relation';
import { map } from 'rxjs/operators';

export abstract class RelationFactory {
  constructor(protected relationAccessor: RelationAccessor) {}

  constructId(subjectId: string, objectRole: string, objectId: string): string {
    return `${subjectId}_${objectRole}_${objectId}`;
  }

  async create(options: {
    subjectCollection: string;
    subjectId: string;
    objectCollection: string;
    objectId: string;
    objectRole: string;
  }) {
    try {
      const id = this.constructId(
        options.subjectId,
        options.objectRole,
        options.objectId
      );
      const relationRecord: RelationRecord = extend(options, {
        id,
        createAt: new Date()
      });
      await this.relationAccessor.save(relationRecord);
    } catch (error) {
      const wrapError = new Error(
        `Failed to create relation record; \n${error.message}`
      );
      throw wrapError;
    }
  }

  async delete(subjectId: string, objectRole: string, objectId: string) {
    const id = this.constructId(subjectId, objectRole, objectId);
    return this.relationAccessor.delete(id);
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

  findByObjectAndRole$(
    objectId: string,
    objectRole: string
  ): Observable<RelationRecord[]> {
    const queries = [];
    queries.push(new Query('objectId', '==', objectId));
    queries.push(new Query('objectRole', '==', objectRole));
    return this.relationAccessor.find$(queries);
  }

  hasRelation$(
    subjectId: string,
    objectId: string,
    objectRole: string
  ): Observable<boolean> {
    const id = this.constructId(subjectId, objectRole, objectId);
    return this.relationAccessor
      .load$(id)
      .pipe(map(relationRecord => !!relationRecord));
  }

  async hasRelation(
    subjectId: string,
    objectId: string,
    objectRole: string
  ): Promise<boolean> {
    try {
      const id = this.constructId(subjectId, objectRole, objectId);
      const relationRecord = await this.relationAccessor.load(id);
      return !!relationRecord;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
