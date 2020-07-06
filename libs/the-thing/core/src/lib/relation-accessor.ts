import { EntityAccessor } from '@ygg/shared/infra/core';
import { Observable } from 'rxjs';
import { RelationRecord } from './relation';
import { Query } from '@ygg/shared/infra/data-access';
import { cloneDeep } from 'lodash';

export const RelationCollection = 'relations';

export class RelationAccessor extends EntityAccessor<RelationRecord> {
  collection = RelationCollection;

  serializer = (relationRecord: RelationRecord): any => {
    const data: any = cloneDeep(relationRecord);
    if (relationRecord && relationRecord.createAt) {
      data.createAt = relationRecord.createAt.toISOString();
    }
    return data;
  };

  deserializer = (data: any): RelationRecord => {
    const relationRecord: RelationRecord = cloneDeep(data);
    if (data && data.createAt) {
      relationRecord.createAt = new Date(data.createAt);
    }
    return relationRecord;
  };
}
