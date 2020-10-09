import '@ygg/shared/functions';
import {
  RelationFactoryFunctions,
  TheThingFactoryFunctions
} from './factories';
import {
  RelationAccessorFunctions,
  TheThingAccessorFunctions,
  LocationRecordAccessFunctions
} from './data-accessors';
import { dataAccessor } from '@ygg/shared/functions';
import { TagsAccessor } from '@ygg/tags/core';

export const tagsAccessor = new TagsAccessor(dataAccessor);
export const theThingAccessor = new TheThingAccessorFunctions(dataAccessor);
export const theThingFactory = new TheThingFactoryFunctions(theThingAccessor);
export const relationAccessor = new RelationAccessorFunctions(dataAccessor);
export const relationFactory = new RelationFactoryFunctions(relationAccessor);
export const locationRecordAccessor = new LocationRecordAccessFunctions(
  dataAccessor
);
