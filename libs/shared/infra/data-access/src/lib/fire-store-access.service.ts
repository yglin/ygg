import { Injectable } from '@angular/core';
import { DataAccessor } from '@ygg/shared/infra/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { LogService } from '@ygg/shared/infra/log';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Query } from './query';

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
      if (query.fieldPath && query.comparator && query.value) {
        ref = ref.where(
          query.fieldPath,
          <firebase.firestore.WhereFilterOp>query.comparator,
          query.value
        );
      }
    });
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

  load$(collection: string, id: string): Observable<any> {
    return this.getCollection(collection)
      .doc(id)
      .snapshotChanges()
      .pipe(
        map(action => {
          const snapshot = action.payload;
          if (snapshot.exists) {
            return snapshot.data();
          } else {
            this.logService.warning(
              `Not found document in collection ${collection} with id: ${id}`
            );
            return null;
          }
        })
      );
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
