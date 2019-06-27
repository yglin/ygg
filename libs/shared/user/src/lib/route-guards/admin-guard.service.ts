import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthenticateService } from '../authenticate.service';
import { AuthorizeService } from '../authorize.service';
import { switchMap, tap } from 'rxjs/operators';
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivateChild {

  constructor(
    private authenticateService: AuthenticateService,
    private authorizeService: AuthorizeService,
    private router: Router
  ) { }

  canActivateChild(): Observable<boolean> {
    return this.isAdmin();
  }

  isAdmin(): Observable<boolean> {
    return this.authenticateService.currentUser$.pipe(
      switchMap(currentUser => {
        if (User.isUser(currentUser)) {
          return this.authorizeService.isAdmin(currentUser.id);
        } else {
          return of(false);
        }
      }),
      tap(isAdmin => {
        if (!isAdmin) {
          alert('請用管理者身份登入才能繼續喔');
          this.router.navigate(['home']);
        }
      })
    )
  }
}
