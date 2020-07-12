import { EntityAccessor, toJSONDeep } from '@ygg/shared/infra/core';
import { cloneDeep } from 'lodash';
import { RelationRecord } from './relation';

export class RelationAccessor extends EntityAccessor<RelationRecord> {
  collection = RelationRecord.collection;

  serializer = (relationRecord: RelationRecord): any => relationRecord.toJSON();

  deserializer = (data: any): RelationRecord =>
    new RelationRecord().fromJSON(data);
}
