import '@ygg/shared/functions';
import { RelationFactoryFunctions, TheThingFactoryFunctions } from './factories';
import {
  RelationAccessorFunctions,
  DataAccessorFunctions,
  TheThingAccessorFunctions
} from './data-accessors';

export const dataAccessor = new DataAccessorFunctions();
export const theThingAccessor = new TheThingAccessorFunctions(dataAccessor);
export const theThingFactory = new TheThingFactoryFunctions(theThingAccessor);
export const relationAccessor = new RelationAccessorFunctions(dataAccessor);
export const relationFactory = new RelationFactoryFunctions(relationAccessor);
