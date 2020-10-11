import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { sample, get } from 'lodash';
import {
  BehaviorSubject,
  from,
  Observable,
  of,
  Subject,
  Subscription,
  throwError
} from 'rxjs';
import { catchError, map, skip, switchMap, take, tap } from 'rxjs/operators';

import { UserError, UserErrorCode } from './error';
import {
  User,
  Authenticator,
  TestAccount,
  messages
} from '@ygg/shared/user/core';
import { UserService } from './user.service';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { getEnv } from '@ygg/shared/infra/core';

@Injectable({ providedIn: 'root' })
export class AuthenticateService implements OnDestroy {
  currentUser: User;
  currentUser$: BehaviorSubject<User>;
  toggleLoggingIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);
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
          tap(() => this.toggleLoggingIn$.next(false)),
          catchError(error => {
            this.emcee.error(`登入失敗，錯誤原因：${error.message}`);
            return of(null);
          })
        )
        .subscribe()
    );

    // Firebase initially auto login
    this.toggleLoggingIn$.next(true);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async loginAnonymously() {
    this.currentUser$.next(sample(this.userService.anonymousUsers));
  }

  async loginTestAccount(account: TestAccount) {
    try {
      this.toggleLoggingIn$.next(true);
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
    } finally {
      this.toggleLoggingIn$.next(false);
    }
  }

  async login(providerName: string) {
    try {
      this.toggleLoggingIn$.next(true);
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
          const siteMode = getEnv('siteConfig.mode');
          if (siteMode === 'develop' || siteMode === 'local') {
            await this.emcee.confirm(messages.FacebookLoginNoteInDevelopMode);
          }
          provider = new firebase.auth.FacebookAuthProvider();
          provider.addScope('email');
          provider.addScope('user_link');
          break;

        default:
          throw new Error(`Unknown auth provider: ${providerName}`);
      }

      await this.angularFireAuth.auth.signInWithPopup(provider);
    } catch (error) {
      // console.debug(error);
      let errorMessage = error.message;
      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = `相同的電子信箱帳號 ${error.email} 已存在，請嘗試用別的登入方法登入`;
      }
      this.emcee.warning(
        `<h3>無法登入，錯誤原因如下：</h3><h3>${errorMessage}</h3>`
      );
    } finally {
      this.toggleLoggingIn$.next(false);
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
