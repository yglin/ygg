import { Injectable } from '@angular/core';
import { CanActivateChild, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticateService } from '../authenticate.service';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { tap, map, take } from 'rxjs/operators';
import { User } from '@ygg/shared/user/core';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';
import { AuthenticateUiService } from '../authenticate-ui.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate, CanActivateChild {
  constructor(
    private authenticateService: AuthenticateService,
    private authenticateUiService: AuthenticateUiService
  ) {}

  canActivate(): Promise<boolean> {
    return this.checkLoggedIn();
  }

  canActivateChild(): Promise<boolean> {
    return this.checkLoggedIn();
  }

  async checkLoggedIn(): Promise<boolean> {
    const currentUser = await this.authenticateUiService.requestLogin();
    if (!currentUser) {
      alert('請先登入才能繼續喔');
      return User.isUser(currentUser);
    } else {
      return true;
    }
  }
}
