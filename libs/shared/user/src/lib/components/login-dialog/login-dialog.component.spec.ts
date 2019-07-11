import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from "ng-mocks";
import { LoginDialogComponent } from './login-dialog.component';
import { AuthenticateService } from '../../authenticate.service';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../models/user';
import { MatButtonModule } from '@angular/material';

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  let testUser: User;

  @Injectable()
  class MockMatDialogRef {
    close$ = new Subject();
    afterClosed(): Observable<any> {
      return this.close$;
    }
    close(data: any) {
      this.close$.next(data);
    }
  }

  @Injectable()
  class MockAuthenticateService {
    currentUser$ = new BehaviorSubject(null);
    login() {
      this.currentUser$.next(testUser);
    }
  }

  beforeAll(() => {
    testUser = User.forge();
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginDialogComponent],
      imports: [MockModule(MatButtonModule)],
      providers: [
        { provide: MatDialogRef, useClass: MockMatDialogRef },
        {
          provide: AuthenticateService,
          useClass: MockAuthenticateService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('login() should call AuthenticateService.login() and pass provider id', () => {
    const mockAuthenticateService: MockAuthenticateService = TestBed.get(
      AuthenticateService
    );
    jest.spyOn(mockAuthenticateService, 'login');
    const fakeProviderId = 'ygooygle';
    component.login(fakeProviderId);
    expect(mockAuthenticateService.login).toHaveBeenCalledWith(fakeProviderId);
  });

  it('if login success when open, close dialog and resolve with the login user', done => {
    const mockDialogRef: MockMatDialogRef = TestBed.get(MatDialogRef);
    const mockAuthenticateService: MockAuthenticateService = TestBed.get(
      AuthenticateService
    );
    mockDialogRef.afterClosed().subscribe(user => {
      expect(user).toBe(testUser);
      done();
    });
    mockAuthenticateService.login();
  });
});
