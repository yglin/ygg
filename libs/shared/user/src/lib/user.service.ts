import { size } from "lodash";
import {Injectable} from '@angular/core';
import {DataAccessService, Query} from '@ygg/shared/infra/data-access';
import {DataAccessError, DataAccessErrorCode} from '@ygg/shared/infra/data-access';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {UserError, UserErrorCode} from './error';
import {User} from './models/user';

@Injectable({providedIn: 'root'})
export class UserService {
  collection = 'users';
  anonymousUsers: {[id: string]: User};

  constructor(private dataAccessService: DataAccessService) {
    // Create 10 anonymous users
    this.anonymousUsers = {};
    while (size(this.anonymousUsers) < 10) {
      const newAnonymous = User.forge();
      this.anonymousUsers[newAnonymous.id] = newAnonymous;
    }
  }

  get$(id: string): Observable<User> {
    if (id in this.anonymousUsers) {
      return of(this.anonymousUsers[id]);
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

  listByIds$(ids: string[]): Observable<User[]> {
    return this.dataAccessService.listByIds$(this.collection, ids, User);
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
