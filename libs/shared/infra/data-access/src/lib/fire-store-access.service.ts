import { Injectable } from '@angular/core';
import { DataAccessor, Query } from '@ygg/shared/infra/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { LogService } from '@ygg/shared/infra/log';
import { Observable, race, NEVER, of, combineLatest } from 'rxjs';
import { map, filter, timeout, take, shareReplay } from 'rxjs/operators';
import { isEmpty } from 'lodash';

type FireQueryRef =
  | firebase.firestore.CollectionReference
  | firebase.firestore.Query;

@Injectable({
  providedIn: 'root'
})
export class FireStoreAccessService extends DataAccessor {
  collections: { [name: string]: AngularFirestoreCollection } = {};

  constructor(
    private firestore: AngularFirestore,
    private fireRealDB: AngularFireDatabase,
    private logService: LogService
  ) {
    super();
  }

  transformQueries(ref: FireQueryRef, queries: Query[] = []): FireQueryRef {
    queries.forEach(query => {
      if (query && query.isValid()) {
        ref = ref.where(
          query.fieldPath,
          <firebase.firestore.WhereFilterOp>query.comparator,
          query.value
        );
      }
    });
    // console.log(ref);
    return ref;
  }

  getCollection(name: string): AngularFirestoreCollection {
    if (!(name in this.collections)) {
      this.collections[name] = this.firestore.collection(name);
    }
    return this.collections[name];
  }

  async save(collection: string, id: string, data: any) {
    try {
      data.refPath = `${collection}/${id}`;
      data.modifyAt = Date().valueOf();
      await this.getCollection(collection)
        .doc(id)
        .set(data);
      return data;
    } catch (error) {
      const wrapError = new Error(
        `Failed to save ${collection}/${id};\n${error.message}`
      );
      this.logService.error(wrapError.message);
      throw wrapError;
    }
  }

  async update(collection: string, id: string, data: any) {
    try {
      data.refPath = `${collection}/${id}`;
      data.modifyAt = Date().valueOf();
      await this.getCollection(collection)
        .doc(id)
        .update(data);
      return data;
    } catch (error) {
      const wrapError = new Error(
        `Failed to update ${collection}/${id};\n${error.message}`
      );
      this.logService.error(wrapError.message);
      throw wrapError;
    }
  }

  has$(collection: string, id: string): Observable<boolean> {
    return this.getCollection(collection)
      .doc(id)
      .snapshotChanges()
      .pipe(map(action => action.payload.exists));
  }

  load$(collection: string, id: string): Observable<any> {
    return this.getCollection(collection)
      .doc(id)
      .snapshotChanges()
      .pipe(
        filter(action => action.payload.exists),
        map(action => action.payload.data()),
        shareReplay(1)
      );
  }

  load(collection: string, id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getCollection(collection)
        .doc(id)
        .snapshotChanges()
        .pipe(
          take(1)
          // map(action => action.payload.exists)
        )
        .subscribe(
          action => {
            if (action && action.payload && action.payload.exists) {
              resolve(action.payload.data());
            } else {
              resolve(null);
            }
          },
          error => reject(error)
        );
    });
  }

  list$(collection: string): Observable<any[]> {
    return this.getCollection(collection).valueChanges();
  }

  listByIds$(collection: string, ids: string[]): Observable<any[]> {
    if (isEmpty(ids)) {
      return of([]);
    } else {
      const arrayGet$: Observable<any>[] = ids.map(id =>
        this.load$(collection, id)
      );
      return combineLatest(arrayGet$);
    }
  }

  async delete(collection: string, id: string) {
    try {
      return this.getCollection(collection)
        .doc(id)
        .delete();
    } catch (error) {
      this.logService.error(
        `Failed to delete ${collection}/${id};\n${error.message}`
      );
      throw error;
    }
  }

  find$(collection: string, queries: Query[]): Observable<any[]> {
    return this.firestore
      .collection(collection, ref => this.transformQueries(ref, queries))
      .valueChanges();
  }
}
