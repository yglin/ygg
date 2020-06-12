import { EntityAccessor } from '@ygg/shared/infra/core';
import { Observable } from 'rxjs';
import { RelationRecord } from './relation';
import { Query } from '@ygg/shared/infra/data-access';

export const RelationCollection = 'relations';

export class RelationAccessor extends EntityAccessor<RelationRecord> {
  collection = RelationCollection;
}
