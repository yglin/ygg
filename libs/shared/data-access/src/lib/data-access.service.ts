import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { DataItem } from '@ygg/shared/interfaces';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataAccessModule } from './data-access.module';

@Injectable({
  providedIn: DataAccessModule,
})
export class DataAccessService {
  collections: { [name: string]: AngularFirestoreCollection };

  constructor(
    protected firestore: AngularFirestore
  ) {
    this.collections = {};
  }

  getCollection(name: string): AngularFirestoreCollection {
    if (!(name in this.collections)) {
      this.collections[name] = this.firestore.collection(name);
    }
    return this.collections[name];
  }

  get$<T extends DataItem>(collection: string, id: string, constructor: { new(): T }): Observable<T> {
    // TODO implement using firebase firestore
    let dataFetching: Observable<any>;
    // // XXX Fake data in cache
    // if (id in this.cache) {
    //   dataFetching = of(this.cache[id]);
    // } else {
    //   dataFetching = of({
    //     id: id
    //   });
    // }
    dataFetching = this.getCollection(collection).doc(id).valueChanges();
    return dataFetching.pipe(map(data => new constructor().fromData(data)));
  }

  upsert<T extends DataItem>(collection: string, item: T, constructor: { new(): T }): Promise<T> {
    return this.getCollection(collection).doc(item.id).set(item.toData()).then(() => item);
  }
}
