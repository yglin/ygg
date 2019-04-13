import {Injectable} from '@angular/core';
import {DataAccessService, Query} from '@ygg/shared/data-access';
import {DataAccessError, DataAccessErrorCode} from '@ygg/shared/data-access';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {UserError, UserErrorCode} from './error';
import {User} from './models/user';

@Injectable({providedIn: 'root'})
export class UserService {
  collection = 'users';
  anonymousUser: User;

  constructor(private dataAccessService: DataAccessService) {
    this.anonymousUser = User.newAnonymous();
  }

  get$(id: string): Observable<User> {
    if (id === this.anonymousUser.id) {
      return of(this.anonymousUser);
    } else {
      return this.dataAccessService.get$(this.collection, id, User)
          .pipe(catchError(error => {
            const dataAccessError: DataAccessError = error;
            if (dataAccessError.code === DataAccessErrorCode.DataNotFound) {
              throw new UserError(
                  UserErrorCode.UserNotFound, `Not found user with id: ${id}`);
            } else {
              throw error;
            }
          }));
    }
  }

  findWithIdOrEmail$(id: string, email: string): Observable<User[]> {
    const queries =
        [new Query('id', '==', id), new Query('email', '==', email)];
    return this.dataAccessService.findWithOr$(this.collection, queries, User);
  }

  async upsert(user: User): Promise<User> {
    return this.dataAccessService.upsert(this.collection, user, User);
  }
}
