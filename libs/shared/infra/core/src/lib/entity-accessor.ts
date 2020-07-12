import { DataAccessor } from './data-accessor';
import { Entity, SerializerJSON, DeserializerJSON } from './entity';
import { map, take, tap } from 'rxjs/operators';
import { Observable, of, combineLatest } from 'rxjs';
import { Query } from './query';
import { isEmpty } from 'lodash';

export class EntityAccessor<T extends Entity> {
  protected collection: string;
  protected serializer: SerializerJSON;
  protected deserializer: DeserializerJSON;

  constructor(protected dataAccessor: DataAccessor) {
    this.collection = this.collection || 'the-things';
    if (typeof this.serializer !== 'function') {
      this.serializer = (entity: any) => entity;
    }
    if (typeof this.deserializer !== 'function') {
      this.deserializer = (entity: any) => entity;
    }
  }

  async save(entity: T) {
    return this.dataAccessor.save(
      this.collection,
      entity.id,
      this.serializer(entity)
    );
  }

  load$(id: string): Observable<T> {
    // console.log(`load$ ${this.collection}/${id}`);
    return this.dataAccessor.load$(this.collection, id).pipe(
      // tap(entityData => console.log(entityData)),
      map(entityData => this.deserializer(entityData))
      // tap(entity => console.log(entity))
    );
  }

  async delete(id: string) {
    return this.dataAccessor.delete(this.collection, id);
  }

  find$(queries: Query[]): Observable<T[]> {
    return this.dataAccessor
      .find$(this.collection, queries)
      .pipe(map(dataItems => dataItems.map(dt => this.deserializer(dt))));
  }

  async load(id: string): Promise<T> {
    return this.load$(id)
      .pipe(take(1))
      .toPromise();
  }

  listByIds$(ids: string[]): Observable<T[]> {
    if (isEmpty(ids)) {
      return of([]);
    } else
      return combineLatest(ids.map(id => this.load$(id))).pipe(
        map(items => items.filter(item => !!item))
      );
  }
}
