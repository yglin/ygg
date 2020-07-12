import {
  DataAccessor,
  DeserializerJSON,
  Query,
  SerializerJSON
} from '@ygg/shared/infra/core';
import { TheThing, TheThingAccessor, TheThingFilter } from '@ygg/the-thing/core';
import { isEmpty } from 'lodash';
import { combineLatest, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

export class TheThingAccessorFunctions extends TheThingAccessor {
  get = this.load;
  serializer: SerializerJSON = (thing: TheThing) => thing.toJSON();
  deserializer: DeserializerJSON = (data: any) => new TheThing().fromJSON(data);

  constructor(protected dataAccessor: DataAccessor) {
    super();
  }

  async save(entity: TheThing, collection: string = TheThing.collection) {
    return this.dataAccessor.save(
      collection,
      entity.id,
      this.serializer(entity)
    );
  }

  load$(
    id: string,
    collection: string = TheThing.collection
  ): Observable<TheThing> {
    // console.log(`load$ ${this.collection}/${id}`);
    return this.dataAccessor.load$(collection, id).pipe(
      // tap(entityData => console.log(entityData)),
      map(entityData => this.deserializer(entityData))
      // tap(entity => console.log(entity))
    );
  }

  async delete(id: string, collection: string = TheThing.collection) {
    return this.dataAccessor.delete(collection, id);
  }

  find$(
    queries: Query[],
    collection: string = TheThing.collection
  ): Observable<TheThing[]> {
    return this.dataAccessor
      .find$(collection, queries)
      .pipe(map(dataItems => dataItems.map(dt => this.deserializer(dt))));
  }

  async load(
    id: string,
    collection: string = TheThing.collection
  ): Promise<TheThing> {
    return this.load$(id, collection)
      .pipe(take(1))
      .toPromise();
  }

  listByIds$(ids: string[], collection: string = TheThing.collection): Observable<TheThing[]> {
    if (isEmpty(ids)) {
      return of([]);
    } else
      return combineLatest(ids.map(id => this.load$(id, collection))).pipe(
        map(items => items.filter(item => !!item))
      );
  }

  listByFilter$(filter: TheThingFilter, collection?: string): Observable<TheThing[]> {
    throw new Error("Method not implemented.");
  }
}
