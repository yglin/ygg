import { TheThing } from './the-thing';
import { TheThingFilter } from './filter';
import { Observable } from 'rxjs';

export abstract class TheThingAccessor {
  abstract async get(id: string, collection?: string): Promise<TheThing>;
  abstract async save(theThing: TheThing, collection?: string);
  abstract listByIds$(
    ids: string[],
    collection?: string
  ): Observable<TheThing[]>;
  abstract listByFilter$(
    filter: TheThingFilter,
    collection?: string
  ): Observable<TheThing[]>;
}
