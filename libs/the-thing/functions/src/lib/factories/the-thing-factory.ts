import {
  TheThing,
  TheThingFactory,
  TheThingImitation,
  TheThingState,
  TheThingAccessor,
  TheThingStateChangeRecord
} from '@ygg/the-thing/core';
import { Observable } from 'rxjs';
import { TheThingAccessorFunctions } from '../data-accessors';

export class TheThingFactoryFunctions extends TheThingFactory {
  constructor(theThingAccessor: TheThingAccessor) {
    super(theThingAccessor);
  }

  create(
    options:
      | {
          imitationId?: string;
          imitation: TheThingImitation;
        }
      | TheThingImitation
  ): Promise<TheThing> {
    throw new Error('Method not implemented.');
  }

  load$(id: string, collection: string): Observable<TheThing> {
    throw new Error('Method not implemented.');
  }

  load(id: string, collection: string): Promise<TheThing> {
    throw new Error('Method not implemented.');
  }

  save(
    theThing: TheThing,
    options?: {
      requireOwner?: boolean;
      imitation?: TheThingImitation;
      force?: boolean;
    }
  ): Promise<TheThing> {
    throw new Error('Method not implemented.');
  }

  async setState(
    thing: TheThing,
    imitation: TheThingImitation,
    state: TheThingState,
    options?: { force?: boolean }
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
