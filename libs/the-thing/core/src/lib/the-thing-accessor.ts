import { TheThing } from './the-thing';

export abstract class TheThingAccessor {
  abstract async get(id: string): Promise<TheThing>;
  abstract async save(theThing: TheThing);
}
