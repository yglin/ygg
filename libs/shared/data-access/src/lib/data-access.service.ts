import { Injectable } from '@angular/core';
import { DataItem } from '@ygg/interfaces';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {
  cache: { [id: string]: any };

  constructor() {
    this.cache = {};
  }

  get$<T extends DataItem>(collection: string, id: string, constructor: { new(): T }): Observable<T> {
    // TODO implement using firebase firestore
    let dataFetching: Observable<any>;
    // XXX Fake data in cache
    if (id in this.cache) {
      dataFetching = of(this.cache[id]);
    } else {
      dataFetching = of({
        id: id
      });
    }
    return dataFetching.pipe(map(data => new constructor().fromData(data)));
  }

  upsert<T extends DataItem>(collection: string, item: T, constructor: { new(): T }): Promise<T> {
    // TODO implement using firebase firestore
    this.cache[item.id] = item;
    return Promise.resolve(item);
  }
}
