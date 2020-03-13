import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { sample } from 'lodash';
import {
  BehaviorSubject,
  from,
  Observable,
  of,
  Subscription,
  throwError
} from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { UserError, UserErrorCode } from './error';
import { User } from './models/user';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthenticateService {
  currentUser: User;
  currentUser$: BehaviorSubject<User>;

  constructor(
    private userService: UserService,
    private angularFireAuth: AngularFireAuth
  ) {
    this.currentUser$ = new BehaviorSubject(null);
    this.angularFireAuth.authState
      .pipe(
        switchMap(firebaseUser => {
          if (!firebaseUser) {
            return of(null);
          } else {
            return this.findOrCreateUser$(firebaseUser);
          }
        })
      )
      .pipe(tap(user => (this.currentUser = user)))
      .subscribe(this.currentUser$);
  }

  async loginAnonymously() {
    this.currentUser$.next(sample(this.userService.anonymousUsers));
  }

  async login(providerName: string) {
    try {
      let provider:
        | firebase.auth.GoogleAuthProvider
        | firebase.auth.FacebookAuthProvider;
      switch (providerName) {
        case 'google':
          provider = new firebase.auth.GoogleAuthProvider();
          provider.addScope('profile');
          provider.addScope('email');
          break;

        case 'facebook':
          provider = new firebase.auth.FacebookAuthProvider();
          provider.addScope('email');
          provider.addScope('user_link');
          break;

        default:
          throw new Error(`Unknown auth provider: ${providerName}`);
      }

      await this.angularFireAuth.auth.signInWithPopup(provider);
    } catch (error) {
      alert(`無法登入，錯誤原因如下：${error.message}`);
    }
  }

  findOrCreateUser$(firebaseUser: firebase.User): Observable<User> {
    const userId = firebaseUser.uid;
    return this.userService.get$(userId).pipe(
      catchError(error => {
        const userError: UserError = error;
        if (userError.code === UserErrorCode.UserNotFound) {
          const newUser = new User().connectProvider(
            firebaseUser.providerId,
            firebaseUser
          );
          return this.userService.upsert(newUser);
        } else {
          return throwError(error);
        }
      })
    );
  }

  async logout() {
    this.angularFireAuth.auth.signOut().then(() => {
      if (this.currentUser$.value) {
        this.currentUser$.next(null);
      }
    });
  }
}
