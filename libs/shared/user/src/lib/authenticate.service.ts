import { isEmpty } from 'lodash';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, of, from, throwError } from 'rxjs';
import { User } from './models/user';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from './user.service';
import { map, switchMap, catchError } from 'rxjs/operators';
import { UserError, UserErrorCode } from './error';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  currentUser$: Observable<User>;

  constructor(
    private userService: UserService,
    private angularFireAuth: AngularFireAuth
  ) {
    this.currentUser$ = this.angularFireAuth.authState.pipe(
      switchMap(firebaseUser => {
        if (!firebaseUser) {
          return of(null);
        } else {
          return this.findOrCreateUser$(firebaseUser);
        }
      })
    );
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
          const newUser = new User().connectProvider(firebaseUser.providerId, firebaseUser);
          return this.userService.upsert(newUser);
        } else {
          return throwError(error);
        }
      })
    );
  }

  async logout() {
    this.angularFireAuth.auth.signOut();
  }
}
