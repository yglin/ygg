import { TestBed } from '@angular/core/testing';

import { AdminGuard } from './admin-guard.service';
import { Injectable } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { User } from "@ygg/shared/user/core";
import { AuthenticateService } from '../authenticate.service';
import { AuthorizeService } from '../authorize.service';
import { Router } from '@angular/router';

describe('AdminGuardService', () => {
  const testUser = User.forge();

  @Injectable()
  class MockRouter {
    navigate() {}
  }

  @Injectable()
  class MockAuthenticateService {
    currentUser$ = new BehaviorSubject(testUser);
  }

  @Injectable()
  class MockAuthorizeService {
    isAdmin() {
      return of(true);
    }
  }

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthenticateService, useClass: MockAuthenticateService },
        { provide: AuthorizeService, useClass: MockAuthorizeService },
        { provide: Router, useClass: MockRouter }
      ]
    })
  );

  it('should implement canActivateChild(), call AdminGuard.isAdmin$() directly', done => {
    const adminGuard: AdminGuard = TestBed.get(AdminGuard);
    jest.spyOn(adminGuard, 'isAdmin').mockImplementation(() => of(true));
    adminGuard.canActivateChild().subscribe(can => {
      expect(can).toBe(true);
      expect(adminGuard.isAdmin).toHaveBeenCalled();
      done();
    });
  });
  

  it('should implement AdminGuard.isAdmin$(), pipe AuthenticateService.currentUser$, AuthorizeService.isAdmin$() and return the result', done => {
    const adminGuard: AdminGuard = TestBed.get(AdminGuard);
    // const mockAuthenticateService = TestBed.get(AuthenticateService);
    const mockAuthorizeService: MockAuthorizeService = TestBed.get(AuthorizeService);

    jest.spyOn(mockAuthorizeService, 'isAdmin');
    adminGuard.isAdmin$().subscribe(isAdmin => {
      expect(isAdmin).toBe(true);
      expect(mockAuthorizeService.isAdmin).toHaveBeenCalledWith(testUser.id);
      done();
    });
  });

  it('if not admin, should alert and redirect back to home page', done => {
    const adminGuard: AdminGuard = TestBed.get(AdminGuard);
    const mockAuthorizeService = TestBed.get(AuthorizeService);
    const mockRouter: MockRouter = TestBed.get(Router);
    jest.spyOn(mockAuthorizeService, 'isAdmin').mockImplementation(() => of(false));
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(mockRouter, 'navigate');
    // expect(false).toBe(true);
    adminGuard.isAdmin$().subscribe(isAdmin => {
      expect(isAdmin).toBe(false);
      expect(window.alert).toHaveBeenCalledWith('請用管理者身份登入才能繼續喔');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['home']);
      done();
    });
    
  });
  
});
