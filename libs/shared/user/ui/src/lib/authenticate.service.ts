import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { sample, get } from 'lodash';
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
import { User, Authenticator, TestAccount } from '@ygg/shared/user/core';
import { UserService } from './user.service';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { getEnv } from '@ygg/shared/infra/core';

@Injectable({ providedIn: 'root' })
export class AuthenticateService implements OnDestroy {
  currentUser: User;
  currentUser$: BehaviorSubject<User>;
  subscription: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private angularFireAuth: AngularFireAuth,
    private emcee: EmceeService
  ) {
    this.currentUser$ = new BehaviorSubject(null);
    this.subscription.add(
      this.currentUser$.subscribe(user => (this.currentUser = user))
    );
    this.subscription.add(
      this.angularFireAuth.authState
        .pipe(
          switchMap(firebaseUser => {
            if (!firebaseUser) {
              return of(null);
            } else {
              return this.syncUser(firebaseUser);
            }
          }),
          tap(user => this.currentUser$.next(user)),
          catchError(error => {
            this.emcee.error(`登入失敗，錯誤原因：${error.message}`);
            return of(null);
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async loginAnonymously() {
    this.currentUser$.next(sample(this.userService.anonymousUsers));
  }

  async loginTestAccount(account: TestAccount) {
    try {
      await this.angularFireAuth.auth.signInWithEmailAndPassword(
        account.email,
        account.password
      );
      const user: User = await this.userService.findByEmail(account.email);
      this.currentUser$.next(user);
    } catch (error) {
      const wrapError = new Error(
        `登入測試帳號失敗，錯誤原因：\n${error.message}`
      );
      this.emcee.error(`<h3>${wrapError.message}</h3>`);
      return Promise.reject(error);
    }
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
      this.emcee.warning(`無法登入，錯誤原因如下：${error.message}`);
    }
  }

  async syncUser(firebaseUser: firebase.User): Promise<User> {
    try {
      const userId = firebaseUser.uid;
      let user = await this.userService.get(userId);
      // console.log(user);
      if (user) {
        this.syncFromFirebase(user, firebaseUser);
      } else {
        user = new User().connectProvider(
          firebaseUser.providerId,
          firebaseUser
        );
      }
      // console.log(user);
      await this.userService.upsert(user);
      return user;
    } catch (error) {
      const wrapError = new Error(
        `Failed to sync user profile with firebase user: ${firebaseUser.uid}.\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }

  syncFromFirebase(user: User, firebaseUser: firebase.User) {
    if (firebaseUser.photoURL) {
      user.avatarUrl = new URL(firebaseUser.photoURL);
    }
    if (firebaseUser.displayName) {
      user.name = firebaseUser.displayName;
    }
    if (firebaseUser.phoneNumber) {
      user.phone = firebaseUser.phoneNumber;
    }
  }

  async logout() {
    this.angularFireAuth.auth.signOut().then(() => {
      if (this.currentUser$.value) {
        this.currentUser$.next(null);
      }
    });
  }
}
