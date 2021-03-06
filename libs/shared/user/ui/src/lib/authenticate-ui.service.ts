import { Injectable } from '@angular/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { User, Authenticator } from '@ygg/shared/user/core';
import { AuthenticateService } from './authenticate.service';
import {
  timeout,
  first,
  filter,
  take,
  takeUntil,
  tap,
  map,
  switchMap
} from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, throwError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateUiService extends Authenticator {
  loginDialogRef: MatDialogRef<any>;
  requestLogin = this.requireLogin;

  constructor(
    private dialog: YggDialogService,
    private authenticateService: AuthenticateService
  ) {
    super();
    this.currentUser$ = this.authenticateService.currentUser$;
    this.currentUser$.subscribe(
      user => (this.currentUser = user)
    );
  }

  async requireLogin(): Promise<User> {
    if (!!this.authenticateService.currentUser) {
      return Promise.resolve(this.authenticateService.currentUser);
    } else {
      try {
        const loginUser = await this.openLoginDialog();
        return loginUser;
      } catch (error) {
        alert(`未登入，錯誤原因：${error.message}`);
        return Promise.reject(error);
      }
      // const cancel$: Observable<any> = this.loginDialogRef
      //   .afterClosed()
      //   .pipe(filter(user => !user));
      // return this.authenticateService.currentUser$
      //   .pipe(
      //     takeUntil(cancel$),
      //     filter(user => !!user),
      //     take(1),
      //     timeout(10000)
      //   )
      //   .toPromise();
    }
  }

  async openLoginDialog(): Promise<User> {
    const loginUser = await this.dialog
      .open(LoginDialogComponent, {
        title: '請選擇登入方式'
      })
      .afterClosed()
      .toPromise();
    if (loginUser) {
      return Promise.resolve(loginUser);
    } else {
      return Promise.reject(new Error(`登入已取消`));
    }
  }
}
