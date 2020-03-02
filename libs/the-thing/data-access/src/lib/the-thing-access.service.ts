import { isEmpty, every } from 'lodash';
import { Injectable } from '@angular/core';
import { TheThing, TheThingFilter } from '@ygg/the-thing/core';
import { DataAccessService, Query } from '@ygg/shared/infra/data-access';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tags } from '@ygg/tags/core';

@Injectable({
  providedIn: 'root'
})
export class TheThingAccessService {
  constructor(private dataAccessService: DataAccessService) {}

  get$(id: string): Observable<TheThing> {
    return this.dataAccessService
      .get$(TheThing.collection, id)
      .pipe(map(data => new TheThing().fromJSON(data)));
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
    // console.log('Upsert the-thing');
    // console.dir(theThing);
    await this.dataAccessService.upsert(theThing.collection, theThing.toJSON());
    return Promise.resolve(theThing);
  }

  async delete(theThing: TheThing): Promise<TheThing> {
    await this.dataAccessService.delete(TheThing.collection, theThing.id);
    return theThing;
  }
}
