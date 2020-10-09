import { TheThing } from '../the-thing';
import { TheThingFilter } from '../filter';
import { Observable, throwError } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { DataAccessor, Query } from '@ygg/shared/infra/core';
import { Tags } from '@ygg/tags/core';
import { isEmpty, every, castArray } from 'lodash';

export abstract class TheThingAccessor {
  constructor(protected dataAccessor: DataAccessor) {}

  async load(
    id: string,
    collection: string = TheThing.collection
  ): Promise<TheThing> {
    const data = await this.dataAccessor.load(collection, id);
    return new TheThing().fromJSON(data);
  }

  load$(
    id: string,
    collection: string = TheThing.collection
  ): Observable<TheThing> {
    return this.dataAccessor
      .load$(collection, id)
      .pipe(map(data => new TheThing().fromJSON(data)));
  }

  list$(collection: string = TheThing.collection): Observable<TheThing[]> {
    return this.dataAccessor
      .list$(collection)
      .pipe(map(items => items.map(item => new TheThing().fromJSON(item))));
  }

  listByFilter$(
    filter: TheThingFilter,
    collection: string = TheThing.collection
  ): Observable<TheThing[]> {
    // TODO: Apply more efficient query on server side
    return this.list$(collection).pipe(
      map(theThings => filter.filter(theThings))
    );
  }

  listByOwner$(ownerId: string): Observable<TheThing[]> {
    const query = new Query('ownerId', '==', ownerId);
    return this.dataAccessor
      .find$(TheThing.collection, [query])
      .pipe(map(items => items.map(item => new TheThing().fromJSON(item))));
  }

  listByIds$(
    ids: string[],
    collection: string = TheThing.collection
  ): Observable<TheThing[]> {
    return this.dataAccessor
      .listByIds$(collection, ids)
      .pipe(map(items => items.map(item => new TheThing().fromJSON(item))));
  }

  async listByIds(
    ids: string[],
    collection: string = TheThing.collection
  ): Promise<TheThing[]> {
    const dataItems: any[] = await this.dataAccessor.listByIds(collection, ids);
    return dataItems.map(dataItem => new TheThing().fromJSON(dataItem));
  }

  findByTags$(tags: Tags | string[]): Observable<TheThing[]> {
    if (!isEmpty(tags)) {
      // XXX yglin 2020/01/06 "array-contains" can be applied only once in compound query
      // So we use array-contains for the first type, i.e. tags[0].
      // Then filter the result in client side with rest tags, i.e. tags[1-].
      // Ugly I know, Elasticsearch could be a better alternative
      // https://firebase.google.com/docs/firestore/query-data/queries
      const [firstTag, ...restTags] = Tags.isTags(tags)
        ? tags.tags
        : tags;
      const queries: Query[] = [];
      queries.push(new Query('tags', 'array-contains', firstTag));
      return this.dataAccessor.find$(TheThing.collection, queries).pipe(
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
    await this.dataAccessor.save(
      theThing.collection,
      theThing.id,
      theThing.toJSON()
    );
    return this.load(theThing.id, theThing.collection);
  }

  async update(theThing: TheThing, fieldPath: string, data: any) {
    const updatePayload = {};
    updatePayload[fieldPath] = data;
    return this.dataAccessor.update(
      theThing.collection,
      theThing.id,
      updatePayload
    );
  }

  async delete(
    theThings: TheThing | TheThing[]
  ): Promise<TheThing | TheThing[]> {
    const victims: TheThing[] = castArray(theThings);
    const promises: Promise<any>[] = [];
    for (const victim of victims) {
      promises.push(this.dataAccessor.delete(TheThing.collection, victim.id));
    }
    await Promise.all(promises);
    return theThings;
  }
}
