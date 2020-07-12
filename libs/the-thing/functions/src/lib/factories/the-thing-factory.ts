import {
  TheThing,
  TheThingFactory,
  TheThingImitation,
  TheThingState,
  TheThingAccessor
} from '@ygg/the-thing/core';
import { Observable } from 'rxjs';
import { TheThingAccessorFunctions } from '../data-accessors';

export class TheThingFactoryFunctions extends TheThingFactory {
  constructor(protected theThingAccessor: TheThingAccessor) {
    super();
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

  async setState(
    thing: TheThing,
    imitation: TheThingImitation,
    state: TheThingState,
    options?: { force?: boolean }
  ) {
    imitation.setState(thing, state);
    return this.theThingAccessor.save(thing, thing.collection);
  }
}
