import { Query } from './query';
import { Observable } from 'rxjs';

export abstract class DataAccessor {
  abstract async save(collection: string, id: string, data: any);
  abstract has$(collection: string, id: string): Observable<boolean>;
  abstract load$(collection: string, id: string): Observable<any>;
  abstract async load(collection: string, id: string): Promise<any>;
  abstract async delete(collection: string, id: string);
  abstract find$(collection: string, queries: Query[]): Observable<any[]>;
}
