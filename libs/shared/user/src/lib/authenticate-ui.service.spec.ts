import { TestBed } from '@angular/core/testing';

import { AuthenticateUiService } from './authenticate-ui.service';
import { User } from './models/user';
import { Injectable } from '@angular/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { Subject } from 'rxjs';

describe('AuthenticateUiService', () => {
  let testUser: User;

  @Injectable()
  class MockDialogService {
    close$ = new Subject();
    dialogRef = {
      afterClosed: () => this.close$ 
    };

    open() {
      // Immediately, but asyncronously, close itself, resolve with testUser
      setTimeout(() => {
        this.close$.next(testUser);
        this.close$.complete();
      }, 0);
      return this.dialogRef;
    }
  }

  beforeAll(function() {
    testUser = User.forge();
  });
  
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthenticateUiService,
      {provide: YggDialogService, useClass: MockDialogService}
    ]
  }));

  it('openLoginDialog() should open login dialog, wait for it close and resolve login user', done => {
    const service: AuthenticateUiService = TestBed.get(AuthenticateUiService);
    const mockDialogService: MockDialogService = TestBed.get(YggDialogService);
    jest.spyOn(mockDialogService, 'open');
    service.openLoginDialog().then(user => {
      expect(mockDialogService.open).toHaveBeenCalledWith(LoginDialogComponent);
      expect(user).toBe(testUser);
      done();
    });
  });
});
