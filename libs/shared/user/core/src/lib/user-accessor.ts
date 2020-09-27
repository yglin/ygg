import { User } from './user';
import { Observable, of } from 'rxjs';
import { DataAccessor, Query } from '@ygg/shared/infra/core';
import { size, isEmpty } from 'lodash';
import { map, catchError } from 'rxjs/operators';

export abstract class UserAccessor {
  // abstract async get(id: string): Promise<User>;
  // abstract get$(id: string): Observable<User>;
  // abstract listByIds$(ids: string[]): Observable<User[]>;

  collection = 'users';
  anonymousUsers: { [id: string]: User };

  constructor(private dataAccessor: DataAccessor) {
    // Create 10 anonymous users
    this.anonymousUsers = {};
    while (size(this.anonymousUsers) < 10) {
      const newAnonymous = User.forge();
      this.anonymousUsers[newAnonymous.id] = newAnonymous;
    }
  }

  listAll$(): Observable<User[]> {
    return this.dataAccessor
      .list$(this.collection)
      .pipe(map(dataItems => dataItems.map(item => new User().fromJSON(item))));
  }

  async get(id: string): Promise<User> {
    try {
      const dataItem = await this.dataAccessor.load(this.collection, id);
      if (isEmpty(dataItem)) {
        return null;
      } else {
        return new User().fromJSON(dataItem);
      }
    } catch (error) {
      const wrapError = new Error(
        `Failed to get User by id ${id}.\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }

  get$(id: string): Observable<User> {
    if (id in this.anonymousUsers) {
      return of(this.anonymousUsers[id]);
    } else {
      return this.dataAccessor
        .load$(this.collection, id)
        .pipe(map(dataItem => new User().fromJSON(dataItem)));
    }
  }

  listByIds$(ids: string[]): Observable<User[]> {
    return this.dataAccessor
      .listByIds$(this.collection, ids)
      .pipe(map(dataItems => dataItems.map(item => new User().fromJSON(item))));
  }

  async upsert(user: User): Promise<User> {
    return this.dataAccessor.save(this.collection, user.id, user.toJSON());
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const queries: Query[] = [new Query('email', '==', email)];
      const result = await this.dataAccessor.find(this.collection, queries);
      if (isEmpty(result)) {
        throw new Error(`Not found any user`);
      } else {
        return new User().fromJSON(result[0]);
      }
    } catch (error) {
      const wrapError = new Error(
        `Can not find user by email: ${email}\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }
}
