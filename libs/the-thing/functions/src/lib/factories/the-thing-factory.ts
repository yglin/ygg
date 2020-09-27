import {
  TheThing,
  TheThingFactory,
  TheThingImitation,
  TheThingState,
  TheThingAccessor,
  TheThingStateChangeRecord,
  TheThingFactoryBasic
} from '@ygg/the-thing/core';
import { Observable } from 'rxjs';
import { TheThingAccessorFunctions } from '../data-accessors';

export class TheThingFactoryFunctions extends TheThingFactoryBasic {
  constructor(private theThingAccessor: TheThingAccessor) {
    super();
  }

  async setState(
    thing: TheThing,
    imitation: TheThingImitation,
    state: TheThingState
  ): Promise<TheThingStateChangeRecord> {
    try {
      imitation.setState(thing, state);
      await this.theThingAccessor.upsert(thing);
      return Promise.resolve(null);
    } catch (error) {
      const wrapError = new Error(
        `Failed to set theThing ${thing.id} of state ${state.label}.\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }
}
