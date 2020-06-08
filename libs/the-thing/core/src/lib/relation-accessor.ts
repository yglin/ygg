import { EntityAccessor } from '@ygg/shared/infra/core';
import { Observable } from 'rxjs';
import { RelationRecord } from './relation';
import { Query } from '@ygg/shared/infra/data-access';

export const RelationCollection = 'relations';

export class RelationAccessor extends EntityAccessor<RelationRecord> {
  collection = RelationCollection;

  findBySubjectAndRole$(
    subjectId: string,
    objectRole: string
  ): Observable<RelationRecord[]> {
    const queries = [];
    queries.push(new Query('subjectId', '==', subjectId));
    queries.push(new Query('objectRole', '==', objectRole));
    return this.find$(queries);
  }
}
