import { Query } from './query';
import { Observable } from 'rxjs';
import { isEmpty } from 'lodash';

export abstract class DataAccessor {
  async listByIds(collection: string, ids: string[]): Promise<any[]> {
    if (isEmpty(ids)) {
      return [];
    } else {
      return Promise.all(ids.map(id => this.load(collection, id)));
    }
  }

  abstract save(collection: string, id: string, data: any);
  abstract update(collection: string, id: string, data: any);
  abstract has$(collection: string, id: string): Observable<boolean>;
  abstract has(collection: string, id: string): Promise<boolean>;
  abstract load(collection: string, id: string): Promise<any>;
  abstract load$(collection: string, id: string): Observable<any>;
  abstract list(collection: string): Promise<any[]>;
  abstract list$(collection: string): Observable<any[]>;
  abstract listByIds$(collection: string, ids: string[]): Observable<any[]>;
  abstract delete(collection: string, id: string);
  abstract find$(collection: string, queries: Query[]): Observable<any[]>;
  abstract find(collection: string, queries: Query[]): Promise<any[]>;
}
