import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthenticateService } from '../authenticate.service';
import { AuthorizeService } from '../authorize.service';
import { switchMap, tap, take } from 'rxjs/operators';
import { User } from "../models/user";
import { LoggedInGuard } from './logged-in-guard.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivateChild {

  constructor(
    private authenticateService: AuthenticateService,
    private authorizeService: AuthorizeService,
    private loggedinGuard: LoggedInGuard,
    private router: Router
  ) { }

  async canActivateChild(): Promise<boolean> {
    const isLoggedIn = await this.loggedinGuard.checkLoggedIn();
    if (!isLoggedIn) {
      return isLoggedIn;
    } else {
      return await this.checkAdmin();
    }
  }

  async checkAdmin(): Promise<boolean> {
    const currentUser = await this.authenticateService.currentUser$.pipe(take(1)).toPromise();
    const isAdmin = await this.authorizeService.isAdmin(currentUser.id).pipe(take(1)).toPromise();
    if (!isAdmin) {
      alert('請用管理者身份登入才能繼續喔');
      this.router.navigate(['home']);
    }
    return isAdmin;
  }
}
