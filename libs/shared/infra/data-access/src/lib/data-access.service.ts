import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
// import { DataAccessModule } from './data-access.module';
import { Query } from '@ygg/shared/infra/core';
import { LogService } from '@ygg/shared/infra/log';
import { flatten, isArray, isEmpty, uniqBy } from 'lodash';
import { combineLatest, NEVER, Observable, of, race } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { DataItem } from './data-item';
import { DataAccessError, DataAccessErrorCode } from './error';

type FireQueryRef =
  | firebase.firestore.CollectionReference
  | firebase.firestore.Query;

@Injectable({ providedIn: 'root' })
export class DataAccessService {
  config: {
    dataLoadingTimeout: number;
  } = {
    dataLoadingTimeout: 5000
  };
  collections: { [name: string]: AngularFirestoreCollection };

  // TO BE DEPRECATED: For back compatibilty
  getByIds$ = this.listByIds$;

  constructor(
    private firestore: AngularFirestore,
    private fireRealDB: AngularFireDatabase,
    private logService: LogService
  ) {
    this.collections = {};
  }

  transformQueries(ref: FireQueryRef, queries: Query[] = []): FireQueryRef {
    if (isArray(queries)) {
      queries.forEach(query => {
        if (query.fieldPath && query.comparator && query.value) {
          ref = ref.where(
            query.fieldPath,
            <firebase.firestore.WhereFilterOp>query.comparator,
            query.value
          );
        }
      });
    }
    return ref;
  }

  getCollection(name: string): AngularFirestoreCollection {
    if (!(name in this.collections)) {
      this.collections[name] = this.firestore.collection(name);
    }
    return this.collections[name];
  }

  list$<T extends DataItem>(
    collection: string,
    constructor?: new () => T
  ): Observable<T[]> {
    return this.firestore
      .collection<T>(collection)
      .valueChanges()
      .pipe(
        map(items => {
          if (constructor) {
            return items.map(item => new constructor().fromJSON(item));
          } else {
            return items;
          }
        })
      );
  }

  get$<T extends DataItem>(
    collection: string,
    id: string,
    constructor?: new () => T
  ): Observable<T> {
    return this.getCollection(collection)
      .doc<T>(id)
      .snapshotChanges()
      .pipe(
        map(action => {
          const snapshot = action.payload;
          if (snapshot.exists) {
            if (constructor) {
              return new constructor().fromJSON(snapshot.data());
            } else {
              return snapshot.data();
            }
          } else {
            throw new DataAccessError(
              DataAccessErrorCode.DataNotFound,
              `Not found document in collection ${collection} with id: ${id}`,
              { collection, id }
            );
          }
        })
      );
  }

  listByIds$<T extends DataItem>(
    collection: string,
    ids: string[],
    constructor?: new () => T
  ): Observable<T[]> {
    if (isEmpty(ids)) {
      return of([]);
    } else {
      const arrayGet$: Observable<T>[] = ids.map(id =>
        this.get$(collection, id, constructor).pipe(
          catchError(error => {
            console.error(error);
            this.logService.error(error);
            return of(null);
          })
        )
      );
      return combineLatest(arrayGet$).pipe(
        map(items => items.filter(item => item !== null))
      );
    }
  }

  find$<T extends DataItem>(
    collection: string,
    query: Query | Query[],
    constructor?: new () => T
  ): Observable<T[]> {
    let queries: Query[];
    if (isArray(query)) {
      queries = query;
    } else {
      queries = [query];
    }
    return this.firestore
      .collection<T>(collection, ref => this.transformQueries(ref, queries))
      .valueChanges()
      .pipe(
        map(items => {
          if (constructor) {
            return items.map(item => new constructor().fromJSON(item));
          } else {
            return items;
          }
        })
      );
  }

  findWithOr$<T extends DataItem>(
    collection: string,
    queries: Query[],
    constructor: new () => T
  ): Observable<T[]> {
    const findings = queries.map(query =>
      this.find$(collection, query, constructor)
    );
    return combineLatest(findings).pipe(
      map(items => {
        return uniqBy(flatten(items), item => item.id);
      })
    );
  }

  async upsert<T extends DataItem>(
    collection: string,
    item: T,
    constructor?: new () => T
  ): Promise<T> {
    const data: DataItem =
      typeof item.toJSON === 'function' ? item.toJSON() : item;
    data.refPath = `${collection}/${item.id}`;
    data.modifyAt = Date().valueOf();
    try {
      await this.getCollection(collection)
        .doc(item.id)
        .set(data);
      return item;
    } catch (error) {
      this.logService.error(error.message);
      throw error;
    }
  }

  // async save(collection: string, entity: Entity, serializer?: SerializerJSON) {
  //   const dataItem =
  //     typeof serializer === 'function' ? serializer(entity) : entity;
  //   return this.upsert(collection, dataItem);
  // }

  // async load(
  //   collection: string,
  //   id: string,
  //   deserializer?: DeserializerJSON
  // ): Promise<any> {
  //   const entity = await this.get$(collection, id)
  //     .pipe(take(1))
  //     .toPromise();
  //   return typeof deserializer === 'function' ? deserializer(entity) : entity;
  // }

  async update(collection: string, id: string, fieldPath: string, data: any) {
    const updatePackage = {};
    updatePackage[fieldPath] = data;
    return this.firestore.doc(`${collection}/${id}`).update(updatePackage);
  }

  async delete(collection: string, itemId: string) {
    return this.getCollection(collection)
      .doc(itemId)
      .delete();
  }

  async setDataObject<T>(path: string, data: T) {
    return this.fireRealDB.object<T>(path).set(data);
  }

  getDataObject$<T>(path: string): Observable<T> {
    return race(
      this.fireRealDB.object<T>(path).valueChanges(),
      /*         .pipe(
          // tap(data => console.dir(data)),
          filter(data => !!data)
        ) */ NEVER.pipe(
        timeout(this.config.dataLoadingTimeout)
      )
    );
  }
}
