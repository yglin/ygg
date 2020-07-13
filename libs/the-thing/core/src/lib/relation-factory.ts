import { Query } from '@ygg/shared/infra/core';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { RelationRecord } from './relation';
import { RelationAccessor } from './relation-accessor';
import { isEmpty } from 'lodash';

export abstract class RelationFactory {
  constructor(protected relationAccessor: RelationAccessor) {}

  async create(options: {
    subjectCollection: string;
    subjectId: string;
    objectCollection: string;
    objectId: string;
    objectRole: string;
  }) {
    const relationRecord: RelationRecord = new RelationRecord(options);
    return this.save(relationRecord);
  }

  async save(relationRecord: RelationRecord) {
    try {
      await this.relationAccessor.save(relationRecord);
    } catch (error) {
      const wrapError = new Error(
        `Failed to save relation record; \n${error.message}`
      );
      throw wrapError;
    }
  }

  async delete(subjectId: string, objectRole: string, objectId: string) {
    const id = RelationRecord.constructId(subjectId, objectRole, objectId);
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
    const id = RelationRecord.constructId(subjectId, objectRole, objectId);
    return this.relationAccessor.has$(id);
  }

  async hasRelation(
    subjectId: string,
    objectId: string,
    objectRole: string
  ): Promise<boolean> {
    try {
      const id = RelationRecord.constructId(subjectId, objectRole, objectId);
      const relationRecord = await this.relationAccessor.load(id);
      return !!relationRecord;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteBySubjectAndRole(subjectId: string, objectRole: string) {
    const relations = await this.findBySubjectAndRole$(subjectId, objectRole)
      .pipe(take(1))
      .toPromise();
    if (!isEmpty(relations)) {
      for (const relation of relations) {
        await this.delete(
          relation.subjectId,
          relation.objectRole,
          relation.objectId
        );
      }
    }
  }

  async replaceObject(relation: RelationRecord) {
    await this.deleteBySubjectAndRole(relation.subjectId, relation.objectRole);
    return this.save(relation);
  }
}
