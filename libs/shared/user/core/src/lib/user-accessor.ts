import { User } from './user';
import { Observable } from 'rxjs';

export abstract class UserAccessor {
  abstract async get(id: string): Promise<User>;
  abstract get$(id: string): Observable<User>;
  abstract listByIds$(ids: string[]): Observable<User[]>;
  
}
