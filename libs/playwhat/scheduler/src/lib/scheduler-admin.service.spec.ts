import { TestBed } from '@angular/core/testing';

import { SchedulerAdminService } from './scheduler-admin.service';
import { User, UserService } from '@ygg/shared/user';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

describe('SchedulerAdminService', () => {
  let agentUsers: User[];

  @Injectable()
  class MockDataAccessService {
    getDataObject$(path: string): Observable<any> {
      return of({});
    }
  }

  @Injectable()
  class MockUserService {
    listByIds$(ids: string): Observable<User[]> {
      return of(agentUsers);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SchedulerAdminService,
        { provide: DataAccessService, useClass: MockDataAccessService },
        { provide: UserService, useClass: MockUserService }
      ]
    });
    agentUsers = [];
    while (agentUsers.length < 5) {
      agentUsers.push(User.forge());
    }
  });

  it('should be able to get agent users from admin data', () => {
    const schedulerAdminService: SchedulerAdminService = TestBed.get(SchedulerAdminService);
    const mockDataAccessService: MockDataAccessService = TestBed.get(
      DataAccessService
    );
    const mockUserService: MockUserService = TestBed.get(UserService);
    jest.spyOn(mockDataAccessService, 'getDataObject$');
    jest.spyOn(mockUserService, 'listByIds$');
    schedulerAdminService.listAgentUsers$().subscribe(results => {
      expect(mockDataAccessService.getDataObject$).toHaveBeenCalled();
      expect(mockUserService.listByIds$).toHaveBeenCalled();
      expect(results).toBe(agentUsers);
    });
  });
});
