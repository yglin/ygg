import { Injectable } from '@angular/core';
import { CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticateService } from '../authenticate.service';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { tap, map } from 'rxjs/operators';
import { User } from '../models/user';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivateChild {
  constructor(
    private authenticateService: AuthenticateService,
    private yggDialogService: YggDialogService
  ) {}

  canActivateChild(): Observable<boolean> {
    return this.isLoggedIn();
  }

  isLoggedIn(): Observable<boolean> {
    return this.authenticateService.currentUser$.pipe(
      // tap(currentUser => console.log(currentUser)),
      map(currentUser => User.isUser(currentUser)),
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          alert('請先登入才能繼續喔');
          this.yggDialogService.open(LoginDialogComponent);
        }
      })
    );
  }
}
