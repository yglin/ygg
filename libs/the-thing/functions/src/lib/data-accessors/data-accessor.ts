import { DataAccessor, Query } from '@ygg/shared/infra/core';
import * as admin from 'firebase-admin';
import { Observable, ReplaySubject } from 'rxjs';

type FireQueryRef =
  | FirebaseFirestore.CollectionReference
  | FirebaseFirestore.Query;

export class DataAccessorFunctions extends DataAccessor {
  firestore: FirebaseFirestore.Firestore;
  ObservablesCache: { [path: string]: ReplaySubject<any> } = {};

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

  load$(collection: string, id: string): Observable<any> {
    const path = `${collection}/${id}`;
    if (!(path in this.ObservablesCache)) {
      const docRef = this.firestore.doc(path);
      this.ObservablesCache[path] = new ReplaySubject(1);
      docRef.onSnapshot(
        snapshot => {
          this.ObservablesCache[path].next(snapshot.data());
        },
        error => {
          this.ObservablesCache[path].error(error);
        }
      );
    }
    return this.ObservablesCache[path];
  }

  async delete(collection: string, id: string) {
    const path = `${collection}/${id}`;
    await this.firestore.doc(path).delete();
    if (path in this.ObservablesCache) {
      delete this.ObservablesCache[path];
    }
  }

  find$(collection: string, queries: Query[]): Observable<any[]> {
    const cachedId = `${collection}?${queries
      .map(q => q.toString())
      .join('&')}`;
    if (!(cachedId in this.ObservablesCache)) {
      // console.log(
      //   `Find collection ${collection} with queries ${queries
      //     .map(q => q.toString())
      //     .join('&')}`
      // );
      const ref = this.transformQueries(
        this.firestore.collection(collection),
        queries
      );
      this.ObservablesCache[cachedId] = new ReplaySubject(1);
      ref.onSnapshot(
        snapshot => {
          this.ObservablesCache[cachedId].next(
            snapshot.docs.map(docSnapshot => docSnapshot.data())
          );
        },
        error => {
          this.ObservablesCache[cachedId].error(error);
        }
      );
    }
    return this.ObservablesCache[cachedId];
  }
}
