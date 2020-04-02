import { TestBed } from '@angular/core/testing';

import { LoggedInGuard } from './logged-in-guard.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { User } from "@ygg/shared/user/core";
import { AuthenticateService } from '../authenticate.service';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';

describe('LoggedInGuardService', () => {
  @Injectable()
  class MockAuthenticateService {
    currentUser$: BehaviorSubject<User>;

    constructor() {
      this.currentUser$ = new BehaviorSubject(null);
    }

    async login() {
      this.currentUser$.next(User.forge());
    }
  }

  @Injectable()
  class MockYggDialogService {
    open(): Observable<any> {
      return of(null);
    }
  }

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        LoggedInGuard,
        { provide: AuthenticateService, useClass: MockAuthenticateService },
        { provide: YggDialogService, useClass: MockYggDialogService }
      ]
    })
  );

  it('should implement canActivateChild and call isLoggedIn() directly', done => {
    const loggedInGuard = TestBed.get(LoggedInGuard);
    jest.spyOn(loggedInGuard, 'isLoggedIn').mockImplementation(() => of(true));
    loggedInGuard.canActivateChild().subscribe(can => {
      expect(can).toBe(true);
      expect(loggedInGuard.isLoggedIn).toHaveBeenCalled();
      done();
    })
  });

  it('if not logged-in, should alert and pop up the login dialog', done => {
    const loggedInGuard = TestBed.get(LoggedInGuard);
    const mockAuthenticateService = TestBed.get(AuthenticateService);
    const mockYggDialogService = TestBed.get(YggDialogService);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(mockYggDialogService, 'open').mockImplementation(() => {
      mockAuthenticateService.login();
      return of(true);
    });
    loggedInGuard.isLoggedIn().subscribe(isLoggedIn => {
      expect(isLoggedIn).toBe(true);
      expect(window.alert).toHaveBeenCalledWith('請先登入才能繼續喔');
      expect(mockYggDialogService.open).toHaveBeenCalledWith(LoginDialogComponent);
      done();
    });
  });

  it('if logged in, return true', done => {
    const loggedInGuard = TestBed.get(LoggedInGuard);
    const mockAuthenticateService = TestBed.get(AuthenticateService);
    mockAuthenticateService.login();
    loggedInGuard.isLoggedIn().subscribe(isLoggedIn => {
      expect(isLoggedIn).toBe(true);
      done();
    });
  });
});
