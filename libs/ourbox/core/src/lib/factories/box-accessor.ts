import { TheThing } from '@ygg/the-thing/core';
import { DataAccessor, EntityAccessor } from '@ygg/shared/infra/core';

export const BoxCollection = 'ourboxes';

export class BoxAccessor extends EntityAccessor<TheThing> {
  collection = BoxCollection;
  serializer = TheThing.serializerJSON;
  deserializer = TheThing.deserializerJSON;
}
