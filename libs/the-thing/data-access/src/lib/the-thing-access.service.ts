import { isEmpty } from 'lodash';
import { Injectable } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { DataAccessService, Query } from '@ygg/shared/infra/data-access';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

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

  listByIds$(ids: string[]): Observable<TheThing[]> {
    return this.dataAccessService
      .listByIds$(TheThing.collection, ids)
      .pipe(map(items => items.map(item => new TheThing().fromJSON(item))));
  }

  findByTypes$(types: string[]): Observable<TheThing[]> {
    if (!isEmpty(types)) {
      // XXX yglin 2020/01/06 "array-contains" can be applied only once in compound query
      // So we use array-contains for the first type, i.e. types[0].
      // Then filter the result in client side with rest types, i.e. types[1-].
      // Ugly I know, Elasticsearch could be a better alternative
      // https://firebase.google.com/docs/firestore/query-data/queries
      const [firstType, ...restTypes] = types;
      const queries: Query[] = [];
      queries.push(new Query('types', 'array-contains', firstType));
      return this.dataAccessService.find$(TheThing.collection, queries).pipe(
        map(items => {
          if (!isEmpty(restTypes)) {
            return items.filter(theThing => {
              for (const type of restTypes) {
                if (!(theThing.types && theThing.types.includes(type))) {
                  return false;
                }
              }
              return true;
            });
          } else return items;
        }),
        map(items => items.map(item => new TheThing().fromJSON(item)))
      );
    } else {
      return throwError(new Error(`Require arguments types, but get ${types}`));
    }
  }

  async upsert(theThing: TheThing): Promise<TheThing> {
    await this.dataAccessService.upsert(theThing.collection, theThing.toJSON());
    return Promise.resolve(theThing);
  }
}
