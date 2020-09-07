import { DataAccessor } from './data-accessor';
import { Entity, SerializerJSON, DeserializerJSON } from './entity';
import { map, take, tap, timeout } from 'rxjs/operators';
import { Observable, of, combineLatest, race, NEVER } from 'rxjs';
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
    try {
      return this.dataAccessor.save(
        this.collection,
        entity.id,
        this.serializer(entity)
      );
    } catch (error) {
      const wrapError = new Error(
        `Failed to save entity "${entity.id}" in collection "${this.collection}".\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }

  async update(id: string, data: any) {
    return this.dataAccessor.update(this.collection, id, data);
  }

  has$(id: string): Observable<boolean> {
    return this.dataAccessor.has$(this.collection, id);
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
    try {
      return this.dataAccessor.delete(this.collection, id);
    } catch (error) {
      const wrapError = new Error(
        `Failed to delete entity ${id} in colletion ${this.collection}.\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }

  find$(queries: Query[]): Observable<T[]> {
    return this.dataAccessor
      .find$(this.collection, queries)
      .pipe(map(dataItems => dataItems.map(dt => this.deserializer(dt))));
  }

  async find(queries: Query[]): Promise<T[]> {
    const dataItems: any[] = await this.dataAccessor.find(
      this.collection,
      queries
    );
    return dataItems.map(dataItem => this.deserializer(dataItem));
  }

  async load(id: string): Promise<T> {
    const entityData = await this.dataAccessor.load(this.collection, id);
    return entityData ? this.deserializer(entityData) : null;
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
