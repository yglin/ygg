import { flatten, isArray, uniqBy, isEmpty } from 'lodash';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataItem } from './data-item';
import { DataAccessError, DataAccessErrorCode } from './error';
// import { DataAccessModule } from './data-access.module';
import { Query } from './query';

type FireQueryRef =
  | firebase.firestore.CollectionReference
  | firebase.firestore.Query;

@Injectable({ providedIn: 'root' })
export class DataAccessService {
  collections: { [name: string]: AngularFirestoreCollection };

  // TO BE DEPRECATED: For back compatibilty
  getByIds$ = this.listByIds$;

  constructor(
    private firestore: AngularFirestore,
    private fireRealDB: AngularFireDatabase
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
    constructor: { new (): T }
  ): Observable<T[]> {
    return this.firestore
      .collection(collection)
      .valueChanges()
      .pipe(
        map(items => {
          return items.map(item => new constructor().fromJSON(item));
        })
      );
  }

  get$<T extends DataItem>(
    collection: string,
    id: string,
    constructor: {
      new (): T;
    }
  ): Observable<T> {
    return this.getCollection(collection)
      .doc(id)
      .snapshotChanges()
      .pipe(
        map(action => {
          const snapshot = action.payload;
          if (snapshot.exists) {
            return new constructor().fromJSON(snapshot.data());
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
    constructor: {
      new (): T;
    }
  ): Observable<T[]> {
    if (isEmpty(ids)) {
      return of([]);
    } else {
      const arrayGet$: Observable<T>[] = ids.map(id =>
        this.get$(collection, id, constructor)
      );
      return combineLatest(arrayGet$);
    }
  }

  find$<T extends DataItem>(
    collection: string,
    query: Query,
    constructor: {
      new (): T;
    }
  ): Observable<T[]> {
    return this.firestore
      .collection(collection, ref => this.transformQueries(ref, [query]))
      .valueChanges()
      .pipe(
        map(items => {
          return items.map(item => new constructor().fromJSON(item));
        })
      );
  }

  findWithOr$<T extends DataItem>(
    collection: string,
    queries: Query[],
    constructor: { new (): T }
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

  upsert<T extends DataItem>(
    collection: string,
    item: T,
    constructor: {
      new (): T;
    }
  ): Promise<T> {
    return this.getCollection(collection)
      .doc(item.id)
      .set(item.toJSON())
      .then(() => item);
  }

  getDataObject$<T>(path: string): Observable<T> {
    return this.fireRealDB.object<T>(path).valueChanges();
  }
}
