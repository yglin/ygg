import { emcee } from '@ygg/shared/functions';
import {
  theThingAccessor,
  theThingFactory,
  relationFactory
} from '@ygg/the-thing/functions';
import { TourPlanFactoryFunctions } from './tour-plan-factory';

export const tourPlanFactory = new TourPlanFactoryFunctions(
  emcee,
  theThingAccessor,
  theThingFactory,
  relationFactory
);
