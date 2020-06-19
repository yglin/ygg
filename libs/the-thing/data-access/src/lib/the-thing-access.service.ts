import { isEmpty, every, castArray } from 'lodash';
import { Injectable } from '@angular/core';
import {
  TheThing,
  TheThingFilter,
  TheThingAccessor
} from '@ygg/the-thing/core';
// import { IDataAccessor } from '@ygg/shared/infra/core';
import { DataAccessService, Query } from '@ygg/shared/infra/data-access';
import { Observable, throwError } from 'rxjs';
import { map, shareReplay, tap, take } from 'rxjs/operators';
import { Tags } from '@ygg/tags/core';

@Injectable({
  providedIn: 'root'
})
export class TheThingAccessService implements TheThingAccessor {
  save = this.upsert;

  // cache: { [id: string]: Observable<TheThing> } = {};
  constructor(private dataAccessService: DataAccessService) {}

  get(id: string, collection: string = TheThing.collection): Promise<TheThing> {
    return this.get$(id, collection)
      .pipe(take(1))
      .toPromise();
  }

  get$(
    id: string,
    collection: string = TheThing.collection
  ): Observable<TheThing> {
    // if (!(id in this.cache)) {
    // console.log(`To fetch ${id}`);
    return this.dataAccessService.get$(collection, id).pipe(
      map(data => new TheThing().fromJSON(data))
      // tap(thing => console.log(`Get new version thing ${thing.id}`)),
      // shareReplay(1)
      // tap(thing => console.log(`Get the thing ${thing.id}`))
    );
    // }
    // return this.cache[id];
  }

  list$(): Observable<TheThing[]> {
    return this.dataAccessService
      .list$(TheThing.collection)
      .pipe(map(items => items.map(item => new TheThing().fromJSON(item))));
  }

  listByFilter$(filter: TheThingFilter): Observable<TheThing[]> {
    // TODO: Apply more efficient query on server side
    return this.list$().pipe(map(theThings => filter.filter(theThings)));
  }

  listByOwner$(ownerId: string): Observable<TheThing[]> {
    const query = new Query('ownerId', '==', ownerId);
    return this.dataAccessService
      .find$(TheThing.collection, query)
      .pipe(map(items => items.map(item => new TheThing().fromJSON(item))));
  }

  listByIds$(ids: string[]): Observable<TheThing[]> {
    return this.dataAccessService
      .listByIds$(TheThing.collection, ids)
      .pipe(map(items => items.map(item => new TheThing().fromJSON(item))));
  }

  findByTags$(tags: Tags | string[]): Observable<TheThing[]> {
    if (!isEmpty(tags)) {
      // XXX yglin 2020/01/06 "array-contains" can be applied only once in compound query
      // So we use array-contains for the first type, i.e. tags[0].
      // Then filter the result in client side with rest tags, i.e. tags[1-].
      // Ugly I know, Elasticsearch could be a better alternative
      // https://firebase.google.com/docs/firestore/query-data/queries
      const [firstTag, ...restTags] = Tags.isTags(tags)
        ? tags.toNameArray()
        : tags;
      const queries: Query[] = [];
      queries.push(new Query('tags', 'array-contains', firstTag));
      return this.dataAccessService.find$(TheThing.collection, queries).pipe(
        map(items => {
          let theThings = items.map(item => new TheThing().fromJSON(item));
          if (!isEmpty(restTags)) {
            theThings = theThings.filter(theThing => {
              if (isEmpty(theThing.tags) || theThing.tags.isEmpty()) {
                return false;
              }
              return every(restTags, restTag => theThing.tags.has(restTag));
            });
          }
          return theThings;
        })
      );
    } else {
      return throwError(new Error(`Require arguments tags, but get ${tags}`));
    }
  }


  async upsert(theThing: TheThing): Promise<TheThing> {
    await this.dataAccessService.upsert(theThing.collection, theThing.toJSON());
    // if (theThing.id in this.cache) {
    // delete this.cache[theThing.id];
    // }
    return this.get(theThing.id, theThing.collection);
  }

  async delete(
    theThings: TheThing | TheThing[]
  ): Promise<TheThing | TheThing[]> {
    const victims: TheThing[] = castArray(theThings);
    const promises: Promise<any>[] = [];
    for (const victim of victims) {
      promises.push(
        this.dataAccessService.delete(TheThing.collection, victim.id)
      );
    }
    await Promise.all(promises);
    return theThings;
  }
}
