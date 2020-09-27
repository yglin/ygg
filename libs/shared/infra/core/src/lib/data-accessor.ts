import { Query } from './query';
import { Observable } from 'rxjs';
import { isEmpty } from 'lodash';

export abstract class DataAccessor {
  abstract async save(collection: string, id: string, data: any);
  abstract async update(collection: string, id: string, data: any);
  abstract has$(collection: string, id: string): Observable<boolean>;
  abstract load$(collection: string, id: string): Observable<any>;
  abstract list$(collection: string): Observable<any[]>;
  abstract listByIds$(collection: string, ids: string[]): Observable<any[]>;
  abstract async load(collection: string, id: string): Promise<any>;
  abstract async delete(collection: string, id: string);
  abstract find$(collection: string, queries: Query[]): Observable<any[]>;
  abstract async find(collection: string, queries: Query[]): Promise<any[]>; 

  async listByIds(collection: string, ids: string[]): Promise<any[]> {
    if (isEmpty(ids)) {
      return [];
    } else {
      return Promise.all(ids.map(id => this.load(collection, id)));
    }
  }

}
