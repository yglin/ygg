import { Injectable } from '@angular/core';
import { DataItem } from '@ygg/interfaces';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {
  cache: { [id: string]: any };

  constructor() {
    this.cache = {};
  }

  get$(collection: string, id: string): Observable<any> {
    // XXX Fake data in cache
    if (id in this.cache) {
      return of(this.cache[id]);
    }
    // TODO implement using firebase firestore
    return of({
      id: id
    });
  }

  upsert(collection: string, item: DataItem): Promise<any> {
    // TODO implement using firebase firestore
    this.cache[item.id] = item;
    return Promise.resolve(item);
  }
}
