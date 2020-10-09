import { EntityAccessor } from '@ygg/shared/infra/core';
import { Tag } from '../models';

export class TagsAccessor extends EntityAccessor<Tag> {
  collection = Tag.collection;
  serializer = (tag: Tag): any => tag.toJSON();
  deserializer = (data: any): Tag => new Tag().fromJSON(data);
}
