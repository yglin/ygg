import { DataAccessor, EntityAccessor } from '@ygg/shared/infra/core';
import { RelationAccessor, TheThing } from '@ygg/the-thing/core';
import { ImitationItem } from '../models';


export class ItemAccessor extends EntityAccessor<TheThing> {
  collection = ImitationItem.collection;
  serializer = TheThing.serializerJSON;
  deserializer = TheThing.deserializerJSON;

  constructor(
    protected relationAccessor: RelationAccessor,
    protected dataAccessor: DataAccessor
  ) {
    super(dataAccessor);
  }
}
