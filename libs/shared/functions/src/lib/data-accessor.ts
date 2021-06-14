import { DataAccessor, Query } from '@ygg/shared/infra/core';
import * as firebase from 'firebase';
import * as admin from 'firebase-admin';
import { isEmpty } from 'lodash';
import { combineLatest, Observable, of, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

type FireQueryRef =
  | FirebaseFirestore.CollectionReference
  | FirebaseFirestore.Query;

export class DataAccessorFunctions extends DataAccessor {
  firestore: FirebaseFirestore.Firestore;
  observablesCache: { [path: string]: ReplaySubject<any> } = {};

  constructor() {
    super();
    this.firestore = admin.firestore();
  }

  transformQueries(ref: FireQueryRef, queries: Query[] = []): FireQueryRef {
    queries.forEach(query => {
      if (query.fieldPath && query.comparator && query.value) {
        // console.log(
        //   `Add query condition ${query.fieldPath}${query.comparator}${query.value}`
        // );
        ref = ref.where(
          query.fieldPath,
          <firebase.firestore.WhereFilterOp>query.comparator,
          query.value
        );
      }
    });
    return ref;
  }

  async save(collection: string, id: string, data: any) {
    return this.firestore
      .collection(collection)
      .doc(id)
      .set(data);
  }

  async update(collection: string, id: string, data: any) {
    return this.firestore
      .collection(collection)
      .doc(id)
      .update(data);
  }

  load$(collection: string, id: string): Observable<any> {
    const path = `${collection}/${id}`;
    if (!(path in this.observablesCache)) {
      const docRef = this.firestore.doc(path);
      this.observablesCache[path] = new ReplaySubject(1);
      docRef.onSnapshot(
        snapshot => {
          if (snapshot.exists) {
            this.observablesCache[path].next(snapshot.data());
          } else {
            this.observablesCache[path].next(null);
          }
        },
        error => {
          this.observablesCache[path].error(error);
        }
      );
    }
    return this.observablesCache[path];
  }

  has$(collection: string, id: string): Observable<boolean> {
    return this.load$(collection, id).pipe(map(data => !!data));
  }

  async has(collection: string, id: string): Promise<boolean> {
    try {
      const snapshot = await this.firestore
        .collection(collection)
        .doc(id)
        .get();
      return snapshot.exists;
    } catch (error) {
      const wrapError = new Error(
        `Fail to check doc "${id}" in collection "${collection}".\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }

  async load(collection: string, id: string): Promise<any> {
    try {
      const snapshot = await this.firestore
        .collection(collection)
        .doc(id)
        .get();
      if (snapshot.exists) {
        return snapshot.data();
      } else {
        throw new Error(`Document "${collection}/${id}" not exist`);
      }
    } catch (error) {
      const wrapError = new Error(
        `Fail to load doc "${id}" in collection "${collection}".\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }

  async delete(collection: string, id: string) {
    const path = `${collection}/${id}`;
    await this.firestore.doc(path).delete();
    if (path in this.observablesCache) {
      delete this.observablesCache[path];
    }
  }

  async find(collection: string, queries: Query[]): Promise<any[]> {
    try {
      const ref = this.transformQueries(
        this.firestore.collection(collection),
        queries
      );
      const snapshot = await ref.get();
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      const wrapError = new Error(
        `Failed to find in collection "${collection} with queries:\n${JSON.stringify(
          queries
        )}.\n${error.message}"`
      );
      return Promise.reject(wrapError);
    }
  }

  find$(collection: string, queries: Query[]): Observable<any[]> {
    const cachedId = `${collection}?${queries
      .map(q => q.toString())
      .join('&')}`;
    if (!(cachedId in this.observablesCache)) {
      // console.log(
      //   `Find collection ${collection} with queries ${queries
      //     .map(q => q.toString())
      //     .join('&')}`
      // );
      const ref = this.transformQueries(
        this.firestore.collection(collection),
        queries
      );
      this.observablesCache[cachedId] = new ReplaySubject(1);
      ref.onSnapshot(
        snapshot => {
          this.observablesCache[cachedId].next(
            snapshot.docs.map(docSnapshot => docSnapshot.data())
          );
        },
        error => {
          this.observablesCache[cachedId].error(error);
        }
      );
    }
    return this.observablesCache[cachedId];
  }

  list$(collection: string): Observable<any[]> {
    const cachedId = collection;
    if (!(cachedId in this.observablesCache)) {
      this.observablesCache[cachedId] = new ReplaySubject(1);
      this.firestore.collection(collection).onSnapshot(
        snapshot => {
          this.observablesCache[cachedId].next(
            snapshot.docs.map(docSnapshot => docSnapshot.data())
          );
        },
        error => {
          this.observablesCache[cachedId].error(error);
        }
      );
    }
    return this.observablesCache[cachedId];
  }

  async list(collection: string): Promise<any[]> {
    return this.list$(collection)
      .pipe(take(1))
      .toPromise();
  }

  listByIds$(collection: string, ids: string[]): Observable<any[]> {
    if (isEmpty(ids)) {
      return of([]);
    } else {
      return combineLatest(ids.map(id => this.load$(collection, id)));
    }
  }
}
